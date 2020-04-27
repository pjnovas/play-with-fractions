import { combineReducers } from 'redux';

import settings from './settings';
import players from './players';
import ranking from './ranking';
import tables from './tables';

export default combineReducers({
  settings,
  players,
  ranking,
  tables
});
