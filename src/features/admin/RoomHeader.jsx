import React from 'react';
import styles from './RoomHeader.module.css';
import { noop } from 'lodash';
import { prop } from 'lodash/fp';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';

import { start } from 'app/reducer/room/tables';
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

const RoomHeader = () => {
  const dispatch = useDispatch();
  const admins = useSelector(getAdminsCount);
  const playersToJoin = useSelector(getPlayersToJoinCount);
  const isReady = useSelector(isReadyForStart);

  const startGame = () => dispatch({ type: 'WS:SEND', payload: start() });

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
      <button
        className={`${isReady ? 'animated infinite pulse' : styles.disabled}`}
        title={`${isReady ? '' : 'Aún no están todos los jugadores online'}`}
        onClick={isReady ? startGame : noop}
      >
        Iniciar Partida
      </button>
    </div>
  );
};

export default RoomHeader;
