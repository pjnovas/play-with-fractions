import { eventChannel } from 'redux-saga';
import shortid from 'shortid';
import ServerActions from './actionTypes';
import { noop } from 'lodash';

const adminToken = process.env.ADMIN_TOKEN;
const qsToken = process.env.REACT_APP_QS_TOKEN;
const qsRoomId = process.env.REACT_APP_QS_ROOM;

const pingTime = process.env.REACT_APP_PING_TIME || 30000;

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
      ws.isAlive = true;
      ws.on('pong', () => {
        ws.isAlive = true;
      });

      emit({ type: ServerActions.NewConnection, payload: { ws, ...data } });
    });

    const pingInterval = setInterval(() => {
      server.clients.forEach(ws => {
        if (ws.isAlive === false) {
          emit({
            type: ServerActions.TimeoutConnection,
            payload: { id: ws.id }
          });

          return ws.terminate();
        }

        ws.isAlive = false;
        ws.ping(noop);
      });
    }, pingTime);

    server.on('close', function close() {
      clearInterval(pingInterval);
    });

    // TODO: errors

    return () => {
      clearInterval(pingInterval);
      server.close();
    };
  });
