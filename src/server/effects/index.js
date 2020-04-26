// import { all } from 'redux-saga/effects';
import websockets from './websockets';

export default function* () {
  yield websockets();
}
