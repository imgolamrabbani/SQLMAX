// editor.js — CodeMirror SQL editor setup & management
const Editor = {
  instance: null,
  _shakeTimer: null,
  _lastVal: '',

  init(containerId) {
    const textarea = document.getElementById(containerId);
    if (!textarea) return null;

    this.instance = CodeMirror.fromTextArea(textarea, {
      mode: 'text/x-sql',
      theme: 'dracula',
      lineNumbers: true,
      indentWithTabs: false,
      smartIndent: true,
      lineWrapping: true,
      extraKeys: {
        'Ctrl-Enter': () => Game.runQuery(),
        'Cmd-Enter':  () => Game.runQuery(),
        'Tab': cm => {
          if (cm.somethingSelected()) cm.indentSelection('add');
          else cm.replaceSelection('  ', 'end');
        },
      },
      matchBrackets: true,
      autoCloseBrackets: true,
      styleActiveLine: true,
      gutters: ['CodeMirror-linenumbers'],
    });

    this.instance.setSize('100%', '100%');

    // ── Real-time validation shake ─────────────────────────────────────
    // SQL keywords that any valid query must eventually contain
    const SQL_KEYWORDS = /\b(select|from|where|insert|update|delete|into|set|values|with|create|drop|union|intersect|except|group|having|order|join|on|as|in|exists|not|and|or|null|count|sum|avg|max|min|case|when|then|else|end|distinct|between|like|all|some|any)\b/i;

    this.instance.on('change', (cm) => {
      const val = cm.getValue().trim();

      // Skip: empty, just comment lines, or too short to judge
      if (!val || val.startsWith('--') || val.length < 6) {
        this._lastVal = val;
        return;
      }

      // Clear previous debounce
      clearTimeout(this._shakeTimer);

      this._shakeTimer = setTimeout(() => {
        // Strip comments before checking
        const noComments = val.replace(/--[^\n]*/g, '').trim();
        if (!noComments) return;

        // If long enough but doesn't contain any SQL keyword → shake
        if (noComments.length > 8 && !SQL_KEYWORDS.test(noComments)) {
          this._shakeEditor();
        }
      }, 350); // debounce: 350ms after user stops typing

      this._lastVal = val;
    });

    return this.instance;
  },

  _shakeEditor() {
    const wrapper = document.querySelector('.editor-wrapper');
    if (!wrapper || wrapper.classList.contains('editor-shake')) return;

    wrapper.classList.add('editor-shake');
    // Also flash the border red briefly
    wrapper.style.boxShadow = '0 0 0 2px rgba(247,37,133,0.6)';

    setTimeout(() => {
      wrapper.classList.remove('editor-shake');
      wrapper.style.boxShadow = '';
    }, 500);
  },

  getValue() {
    return this.instance ? this.instance.getValue() : '';
  },

  // FIX 2: Always start empty — never pre-fill with solution
  setValue(code) {
    if (this.instance) {
      // Ignore any passed starterCode — always blank
      this.instance.setValue('');
      this.instance.clearHistory();
      setTimeout(() => {
        this.instance.refresh();
        this.instance.focus();
      }, 50);
    }
  },

  clearHistory() {
    if (this.instance) this.instance.clearHistory();
  },

  focus() {
    if (this.instance) this.instance.focus();
  },
};
