import { fork } from 'redux-saga/effects';
import serverEffects from './server';

export default function* () {
  yield fork(serverEffects);
}
