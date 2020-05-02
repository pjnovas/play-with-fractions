import { all } from 'redux-saga/effects';
import websockets from './websockets';
import gameplay from './gameplay';

export default function* () {
  yield all([websockets(), gameplay()]);
}
