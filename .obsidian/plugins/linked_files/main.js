const { Plugin } = require("obsidian");
module.exports = class MyPlugin extends Plugin {
  async onload() {
    this.addCommand({
      id: "link-unlinked-notes",
      name: "Link Unlinked Notes",
      callback: () => this.linkUnlinkedNotes(),
    });
  }
  async linkUnlinkedNotes() {
    const allNotes = this.app.vault.getMarkdownFiles();
    const notesData = {};
    for (const note of allNotes) {
      const metadata = await this.app.metadataCache.getFileCache(note);
      const tags = metadata?.tags || [];
      notesData[note.path] = tags;
    }
    for (const [notePath, tags] of Object.entries(notesData)) {
      if (tags.length > 0) {
        const linkedNotes = Object.entries(notesData)
          .filter(
            ([otherPath, otherTags]) =>
              otherPath !== notePath &&
              otherTags.some((tag) => tags.includes(tag)),
          )
          .map(([otherPath]) => `[[${otherPath}]]`);
        if (linkedNotes.length > 0) {
          const file = this.app.vault.getAbstractFileByPath(notePath);
          await this.app.vault.modify(
            file,
            `\n\n# Связанные заметки: ${linkedNotes.join(", ")}`,
          );
        }
      }
    }
  }
};
