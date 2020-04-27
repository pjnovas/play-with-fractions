import { all } from 'redux-saga/effects';

import websockets from './websockets';
import room from './room';

export default function* () {
  yield all([websockets(), room()]);
}
