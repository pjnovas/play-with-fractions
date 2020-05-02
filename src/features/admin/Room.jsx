import React from 'react';
import styles from './Room.module.css';
import { flatten, isEmpty, noop } from 'lodash';
import { propOr } from 'lodash/fp';
import { useDispatch, useSelector } from 'react-redux';
import { start } from 'app/reducer/room/tables';
import RoomLink from './RoomLink';

const Room = () => {
  const dispatch = useDispatch();
  const settings = useSelector(propOr([], 'room.settings'));
  const players = useSelector(propOr([], 'room.players'));
  const sockets = useSelector(propOr([], 'sockets'));

  const admins = sockets.reduce(
    (count, { isAdmin }) => (isAdmin ? count + 1 : count),
    0
  );
  const playerSockets = flatten(players.map(({ sockets }) => sockets));
  const emptySockets = sockets.reduce(
    (count, { id, isAdmin }) =>
      !isAdmin && !playerSockets.includes(id) ? count + 1 : count,
    0
  );

  const onlinePlayers = players.filter(({ sockets }) => !isEmpty(sockets));
  const offlinePlayers = players.filter(({ sockets }) => isEmpty(sockets));
  const isReady = onlinePlayers.length === settings.maxPlayers;

  const startGame = () => dispatch({ type: 'WS:SEND', payload: start() });

  return (
    <div className={styles.content}>
      {!settings?.id ? (
        <div>CARGANDO PARTIDA</div>
      ) : (
        <>
          <RoomLink />
          <h1>Partida {settings.name}</h1>
          <div className={styles.header}>
            <div>
              <div title="Usuarios que están viendo esta página">
                <label>Administradores: </label>
                <span>{admins}</span>
              </div>
              <div title="Jugadores que están llenando el formulario de ingreso">
                <label>Por ingresar: </label>
                <span>{emptySockets}</span>
              </div>
            </div>
            <button
              className={`${
                isReady ? 'animated infinite pulse' : styles.disabled
              }`}
              title={`${
                isReady ? '' : 'Aún no están todos los jugadores online'
              }`}
              onClick={isReady ? startGame : noop}
            >
              Iniciar Partida
            </button>
          </div>
          <h2 title="Jugadores conectados (llenando o no el formulario) sobre los esperados para iniciar la partida">
            Jugadores en espera ( {players.length} / {settings.maxPlayers} )
          </h2>
          <div className={styles.playerLists}>
            <div>
              <h3 title="Jugadores que llenaron el formulario de ingreso y están en la página de espera">
                Online ( {onlinePlayers.length} / {settings.maxPlayers} )
              </h3>
              <ul className={styles.players}>
                {onlinePlayers.map(player => (
                  <li
                    key={player.email}
                  >{`${player.nickname} <${player.email}>`}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 title="Jugadores que ya ingresaron el formulario en esta partida pero cerraron la página (tienen que volver a ingresar el formulario con el MISMO EMAIL)">
                Offline ( {offlinePlayers.length} / {settings.maxPlayers} )
              </h3>
              <ul className={styles.players}>
                {offlinePlayers.map(player => (
                  <li
                    key={player.email}
                  >{`${player.nickname} <${player.email}>`}</li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Room;
