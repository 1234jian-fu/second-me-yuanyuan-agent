export const memoryHooks = {
  async beforeChatContext() {
    // Future hook: assemble persona, recent summaries, and retrieval snippets here.
    return {
      persona: null,
      recentMemory: [],
      retrievedSnippets: [],
    };
  },
  async afterUserRecordSaved() {
    // Future hook: enqueue transcription, summary, embedding, and profile updates here.
    return {
      queued: false,
    };
  },
};
