/* Simple Tab Indent - ZWSP + Tab and configurable tab width */
const { Plugin, PluginSettingTab, Setting } = require("obsidian");
const { keymap } = require("@codemirror/view");
const { Prec, EditorSelection } = require("@codemirror/state");

/* ---------- defaults ---------- */
const DEFAULT_SETTINGS = {
  tabWidth: 4, // CSS tab-size
};

module.exports = class SimpleTabIndentPlugin extends Plugin {
  /* ---------- lifecycle ---------- */
  async onload() {
    /* load settings or fallback */
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());

    /* inject CSS for tab-size */
    this.applyTabSizeCSS();

    /* CodeMirror keymap: ZWSP + real Tab */
    const INDENT = "\u200B\t";
    const tabKeymap = Prec.highest(
      keymap.of([
        {
          key: "Tab",
          preventDefault: true,
          run: (view) => {
            const tr = view.state.changeByRange((range) => ({
              changes: { from: range.from, to: range.to, insert: INDENT },
              range: EditorSelection.cursor(range.from + INDENT.length),
            }));
            view.dispatch(tr);
            return true;
          },
        },
      ])
    );
    this.registerEditorExtension(tabKeymap);

    /* settings UI */
    this.addSettingTab(new SimpleTabIndentSettingTab(this.app, this));

    console.log(
      "Simple Tab Indent - loaded (ZWSP+Tab, tab-size =",
      this.settings.tabWidth,
      ")"
    );
  }

  onunload() {
    this.styleEl?.remove();
    console.log("Simple Tab Indent - unloaded");
  }

  /* ---------- helpers ---------- */
  async saveSettings() {
    console.log(
      "Simple Tab Indent - saving settings (tab-size =",
      this.settings.tabWidth,
      ")"
    );
    await this.saveData(this.settings);
    this.applyTabSizeCSS(); // live-update CSS
  }

  applyTabSizeCSS() {
    const css = `
/* injected by Simple Tab Indent */
.cm-content, .markdown-source-view { tab-size: ${this.settings.tabWidth} !important; -moz-tab-size: ${this.settings.tabWidth} !important; }
`;
    if (this.styleEl) this.styleEl.remove();
    this.styleEl = document.createElement("style");
    this.styleEl.setAttribute("id", "simple-tab-indent-style");
    this.styleEl.textContent = css;
    document.head.appendChild(this.styleEl);
  }
};

/* ---------- settings tab ---------- */
class SimpleTabIndentSettingTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Simple Tab Indent - Settings" });

    new Setting(containerEl)
      .setName("Tab width")
      .setDesc("How many spaces a tab renders as (CSS tab-size).")
      .addText((txt) =>
        txt
          .setPlaceholder("4")
          .setValue(String(this.plugin.settings.tabWidth))
          .onChange(async (value) => {
            const n = Math.max(1, Number(value) || 4);
            this.plugin.settings.tabWidth = n;
            await this.plugin.saveSettings();
          })
      );
  }
}

/* nosourcemap */