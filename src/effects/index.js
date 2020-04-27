import { fork } from 'redux-saga/effects';
import websockets from './websockets';

export default function* () {
  yield fork(websockets);
}
