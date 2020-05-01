export const getTablesConfig = (maxPlayers, maxPerTable) => ({
  tables: Math.floor(maxPlayers / maxPerTable),
  plus: maxPlayers % maxPerTable
});
