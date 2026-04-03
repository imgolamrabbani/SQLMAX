// engine.js — sql.js wrapper for in-browser SQLite execution
let SQL = null;
let db = null;
let currentSchema = null;

const Engine = {
  async init() {
    return new Promise((resolve, reject) => {
      if (SQL) { resolve(); return; }
      const config = {
        locateFile: filename => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/${filename}`
      };
      initSqlJs(config).then(SqlModule => {
        SQL = SqlModule;
        resolve();
      }).catch(reject);
    });
  },

  loadSchema(schemaName) {
    if (currentSchema === schemaName && db) return;
    if (db) db.close();
    db = new SQL.Database();
    let sql = '';
    switch (schemaName) {
      case 'ecommerce':  sql = SCHEMA_ECOMMERCE;  break;
      case 'healthcare': sql = SCHEMA_HEALTHCARE; break;
      case 'university': sql = SCHEMA_UNIVERSITY; break;
      case 'dml':        sql = SCHEMA_DML;        break;
    }
    try {
      db.run(sql);
      currentSchema = schemaName;
    } catch (e) {
      console.error('Schema load error:', e);
      throw e;
    }
  },

  // Execute one or multiple statements, return results of last SELECT
  execute(sqlText) {
    if (!db) throw new Error('Database not loaded');

    // Split statements for DML multi-step queries
    const statements = sqlText.split(';').map(s => s.trim()).filter(s => s.length > 0);
    let lastResult = null;
    let error = null;

    for (const stmt of statements) {
      try {
        const results = db.exec(stmt);
        if (results && results.length > 0) {
          lastResult = results[results.length - 1];
        }
      } catch (e) {
        error = e;
        break;
      }
    }

    if (error) throw error;

    if (!lastResult) {
      // DML statement with no SELECT — return affected rows message
      return { columns: ['Result'], values: [['Statement executed successfully']] };
    }

    return lastResult;
  },

  // Format result for display
  formatResult(result) {
    if (!result) return { columns: [], rows: [] };
    return {
      columns: result.columns || [],
      rows: result.values || [],
    };
  },

  // Reset DB to clean schema state (for DML levels)
  resetSchema() {
    currentSchema = null;
    if (db) db.close();
    db = null;
  },

  close() {
    if (db) { db.close(); db = null; }
    currentSchema = null;
  }
};
