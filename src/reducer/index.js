import room from 'app/reducer/room';
import sockets from 'app/reducer/sockets';
import table from 'app/reducer/room/table';
import page from './page';
import player from './player';
import websocket from './websocket';

export default {
  room,
  sockets,

  // only client
  player,
  page,
  websocket,
  table
};
