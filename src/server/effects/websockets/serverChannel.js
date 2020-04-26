import { eventChannel } from 'redux-saga';
import shortid from 'shortid';
import ServerActions from './actionTypes';

const adminToken = process.env.ADMIN_TOKEN;
const qsToken = process.env.REACT_APP_QS_TOKEN;
const qsRoomId = process.env.REACT_APP_QS_ROOM;

export default server =>
  eventChannel(emit => {
    server.on('connection', (ws, req) => {
      const data = {};
      const searchParams = new URLSearchParams(req.url.replace('/', ''));

      const token = searchParams.get(qsToken);
      if (token === adminToken) {
        data.isAdmin = true;
      }

      data.roomId = searchParams.get(qsRoomId);

      if (!data.isAdmin && !data.roomId) {
        ws.send(JSON.stringify({ error: '401 Unauthorized' }));
        ws.close();
        return;
      }

      ws.id = shortid.generate();
      emit({ type: ServerActions.NewConnection, payload: { ws, ...data } });
    });

    // TODO: destroy server, errors

    return () => {
      console.log('CLOSE SERVER');
    };
  });
