import React from 'react';
import styles from './RoomHeader.module.css';
import { noop } from 'lodash';
import { prop } from 'lodash/fp';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';

import { start, isGameplay, hasEnded } from 'app/reducer/room/tables';
import { getOnlinePlayers } from 'app/reducer/room/players';
import { getAdminsCount, getPlayersToJoinCount } from 'app/reducer/sockets';
import { isOnline } from 'reducer/websocket';

const isReadyForStart = createSelector(
  isOnline,
  getOnlinePlayers,
  prop('room.settings.maxPlayers'),
  (online, onlinePlayers, maxPlayers) =>
    online && onlinePlayers.length === maxPlayers
);

const Action = () => {
  const dispatch = useDispatch();
  const isReady = useSelector(isReadyForStart);
  const isPlaying = useSelector(isGameplay);
  const isFinished = useSelector(hasEnded);
  const timeout = useSelector(prop('room.tables.timeout'));

  const startGame = () => dispatch({ type: 'WS:SEND', payload: start() });

  if (isPlaying) {
    return (
      <div className={['animated infinite pulse', styles.timer].join(' ')}>
        {timeout / 1000}
      </div>
    );
  }

  return (
    <button
      className={`${isReady ? 'animated infinite pulse' : styles.disabled}`}
      title={`${isReady ? '' : 'Aún no están todos los jugadores online'}`}
      onClick={isReady ? startGame : noop}
    >
      {`${isFinished ? 'Reiniciar' : 'Iniciar'} Partida`}
    </button>
  );
};

const RoomHeader = () => {
  const admins = useSelector(getAdminsCount);
  const playersToJoin = useSelector(getPlayersToJoinCount);

  return (
    <div className={styles.header}>
      <div>
        <div title="Usuarios que están viendo esta página">
          <label>Administradores: </label>
          <span>{admins}</span>
        </div>
        <div title="Jugadores que están llenando el formulario de ingreso">
          <label>Por ingresar: </label>
          <span>{playersToJoin}</span>
        </div>
      </div>
      <Action />
    </div>
  );
};

export default RoomHeader;
