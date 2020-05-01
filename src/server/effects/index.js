import { all } from 'redux-saga/effects';

import websockets from './websockets';
import room from './room';
import gameplay from './gameplay';

export default function* () {
  yield all([websockets(), room(), gameplay()]);
}
