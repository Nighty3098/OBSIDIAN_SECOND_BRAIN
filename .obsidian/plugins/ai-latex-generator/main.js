var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => LatexConverterPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var DEFAULT_SETTINGS = {
  ollamaModel: "llama2"
};
var LatexConverterPlugin = class extends import_obsidian.Plugin {
  async onload() {
    await this.loadSettings();
    this.addCommand({
      id: "convert-to-latex",
      name: "Convert to LaTeX",
      editorCallback: (editor) => this.convertToLatex(editor)
    });
    this.addSettingTab(new LatexConverterSettingTab(this.app, this));
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
  async convertToLatex(editor) {
    const selection = editor.getSelection();
    if (!selection) {
      new import_obsidian.Notice("No text selected. Please select the text you want to convert to LaTeX.", 5e3);
      return;
    }
    const loadingNotice = new import_obsidian.Notice("Converting to LaTeX...", 0);
    try {
      const latexEquation = await this.callLocalLLM(selection);
      editor.replaceSelection(`$${latexEquation}$`);
      new import_obsidian.Notice("Successfully converted to LaTeX!", 3e3);
    } catch (error) {
      this.handleError(error);
    } finally {
      loadingNotice.hide();
    }
  }
  async callLocalLLM(input) {
    var _a;
    const ollamaEndpoint = "http://localhost:11434/api/generate";
    try {
      const response = await fetch(ollamaEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: this.settings.ollamaModel,
          prompt: `Convert the following natural language to a LaTeX equation, output ONLY THE EQUATION AND NOTHING ELSE: "${input}".Output should
                    be in this format: \${output}$`,
          stream: true
        })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const reader = (_a = response.body) == null ? void 0 : _a.getReader();
      if (!reader) {
        throw new Error("Unable to read response from Ollama");
      }
      let latexEquation = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split("\n").filter((line) => line.trim() !== "");
        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (data.response) {
              latexEquation += data.response;
            }
          } catch (parseError) {
            console.error("Error parsing JSON:", parseError);
            throw new Error("Failed to parse response from Ollama");
          }
        }
      }
      return latexEquation.trim();
    } catch (error) {
      console.error("Error in callLocalLLM:", error);
      throw error;
    }
  }
  handleError(error) {
    let errorMessage = "An unexpected error occurred while converting to LaTeX.";
    if (error instanceof Error) {
      if (error.message.includes("HTTP error")) {
        errorMessage = `Failed to connect to Ollama. Please ensure Ollama is running and accessible at http://localhost:11434. Error: ${error.message}`;
      } else if (error.message.includes("Failed to parse response")) {
        errorMessage = `Received an invalid response from Ollama. The model might be having issues. Error: ${error.message}`;
      } else if (error.message.includes("Unable to read response")) {
        errorMessage = `Failed to read the response from Ollama. The connection might have been interrupted. Error: ${error.message}`;
      } else {
        errorMessage = `Error converting to LaTeX: ${error.message}`;
      }
    }
    new import_obsidian.Notice(errorMessage, 1e4);
    console.error(errorMessage);
  }
};
var LatexConverterSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "LaTeX Generator Settings" });
    new import_obsidian.Setting(containerEl).setName("Ollama Model").setDesc("Choose the Ollama model to use for LaTeX conversion").addText((text) => text.setPlaceholder("Enter model name").setValue(this.plugin.settings.ollamaModel).onChange(async (value) => {
      this.plugin.settings.ollamaModel = value;
      await this.plugin.saveSettings();
    }));
  }
};

/* nosourcemap */