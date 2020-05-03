export const getTablesConfig = (maxPlayers, maxPerTable) => ({
  tables: Math.floor(maxPlayers / maxPerTable),
  plus: maxPlayers % maxPerTable
});

export const getFraction = number =>
  number.includes('/')
    ? `${number.split('/')[0]}&frasl;${number.split('/')[1]}`
    : number;
