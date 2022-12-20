const store = new Map();

const storeDiscordTokens = async (userId, tokens) => {
  await store.set(`discord-${userId}`, tokens);
}

const getDiscordTokens = async (userId) => {
  return store.get(`discord-${userId}`);
}
