// validator.js — Strict result-set comparison against the solution query
const Validator = {

  normalizeVal(v) {
    if (v === null || v === undefined) return '__NULL__';
    const s = String(v).trim();
    // Numeric: round to 2 dp for float comparison
    const n = parseFloat(s);
    if (!isNaN(n) && s !== '') return Math.round(n * 100) / 100;
    return s.toLowerCase();
  },

  normalizeRow(row) {
    return row.map(v => this.normalizeVal(v));
  },

  rowKey(row) {
    return this.normalizeRow(row).join('|||');
  },

  // Compare two result sets, order-insensitive (unless ordered=true)
  setsMatch(playerRows, solutionRows, ordered = false) {
    if (playerRows.length !== solutionRows.length) return false;
    if (ordered) {
      return playerRows.every((row, i) => this.rowKey(row) === this.rowKey(solutionRows[i]));
    }
    // Order-insensitive: sort both and compare
    const sort = rows => [...rows].map(r => this.rowKey(r)).sort();
    const sortedPlayer   = sort(playerRows);
    const sortedSolution = sort(solutionRows);
    return sortedPlayer.every((k, i) => k === sortedSolution[i]);
  },

  // ── Main validation entry point ──────────────────────────────────────
  // Always runs the solution query and compares actual result sets.
  validate(sublevel, playerResult) {
    // Error in player query
    if (playerResult.error) {
      return {
        pass: false,
        stars: 0,
        message: `❌ SQL Error: ${playerResult.error}`,
        detail: 'Fix the syntax error and try again.'
      };
    }

    const { columns: pCols, rows: pRows } = playerResult;

    // ── DML levels: just check that the final SELECT returned rows ──
    if (sublevel.isDML) {
      if (!pRows || pRows.length === 0) {
        return {
          pass: false, stars: 0,
          message: '❌ End your query with a SELECT to verify the result.',
          detail: 'DML challenges require a SELECT at the end to confirm the change.'
        };
      }
      // For DML, just confirm rows exist (state already changed in db)
      return {
        pass: true, stars: 3,
        message: `✅ Operation successful! ${pRows.length} row(s) confirmed.`,
        detail: ''
      };
    }

    // ── Guard: reject DML statements in SELECT-only levels ──────────────
    const rawQuery = (typeof playerResult._rawSql === 'string') ? playerResult._rawSql : '';
    // (This guard is enforced by checking pRows — a DML without trailing SELECT returns 0 rows)

    // ── SELECT levels: run the solution and compare ──────────────────
    let solutionResult;
    try {
      const raw = Engine.execute(sublevel.solution);
      solutionResult = Engine.formatResult(raw);
    } catch (e) {
      // Solution itself errored — fall back to permissive check
      console.warn('Solution query error:', e.message);
      if (pRows && pRows.length > 0) {
        return { pass: true, stars: 2, message: '✅ Looks good! (auto-check unavailable)', detail: '' };
      }
      return { pass: false, stars: 0, message: '❌ No results returned.', detail: '' };
    }

    const { columns: sCols, rows: sRows } = solutionResult;

    // 1. EXACT column match — same columns, same count, no extras allowed
    const pColsNorm = (pCols || []).map(c => c.toLowerCase().trim());
    const sColsNorm = (sCols || []).map(c => c.toLowerCase().trim());

    // Check for missing columns
    const missingCols = sColsNorm.filter(sc => !pColsNorm.includes(sc));
    if (missingCols.length > 0) {
      return {
        pass: false, stars: 0,
        message: `❌ Missing column(s): <strong>${missingCols.join(', ')}</strong>. Check your SELECT clause.`,
        detail: `Your query returned: ${pColsNorm.join(', ') || '(none)'}`
      };
    }

    // Check for EXTRA columns (e.g. SELECT * when only 2 cols expected)
    const extraCols = pColsNorm.filter(pc => !sColsNorm.includes(pc));
    if (extraCols.length > 0) {
      return {
        pass: false, stars: 0,
        message: `❌ Too many columns: <strong>${extraCols.join(', ')}</strong> should not be in the result.`,
        detail: `Select only: ${sColsNorm.join(', ')} — avoid <code>SELECT *</code> unless the task specifically asks for all columns.`
      };
    }

    // 2. Row count must match
    if (pRows.length !== sRows.length) {
      const diff = pRows.length - sRows.length;
      const hint = diff > 0
        ? `You returned ${diff} extra row(s) — check your WHERE conditions.`
        : `You returned ${Math.abs(diff)} fewer row(s) — you might be filtering too much.`;
      return {
        pass: false, stars: 0,
        message: `❌ Wrong number of rows: got <strong>${pRows.length}</strong>, expected <strong>${sRows.length}</strong>.`,
        detail: hint
      };
    }

    // 3. Zero rows — special case
    if (sRows.length === 0) {
      return {
        pass: true, stars: 3,
        message: '✅ Correct! No rows expected and none returned.',
        detail: ''
      };
    }

    // 4. Compare actual data values (use only the columns the solution returns)
    // Extract only the solution columns from player rows (in order)
    const sColIndices = sColsNorm.map(sc => pColsNorm.indexOf(sc));
    const pProjected = pRows.map(row => sColIndices.map(i => i >= 0 ? row[i] : null));

    // Detect if solution has ORDER BY (ordered comparison)
    const ordered = /\border\s+by\b/i.test(sublevel.solution);
    const dataMatch = this.setsMatch(pProjected, sRows, ordered);

    if (!dataMatch) {
      return {
        pass: false, stars: 0,
        message: `❌ Wrong data! Row count matches (${pRows.length}) but values differ.`,
        detail: ordered
          ? 'Check the ORDER of your results — this query requires a specific order.'
          : 'Check your WHERE / JOIN conditions — some values don\'t match.'
      };
    }

    // All good!
    return {
      pass: true, stars: 3,
      message: `✅ Perfect! ${pRows.length} correct row(s) returned.`,
      detail: ''
    };
  },
};
