import React from 'react';
import styles from './Room.module.css';
import { flatten, isEmpty } from 'lodash';
import { propOr } from 'lodash/fp';
import { /*useDispatch, */ useSelector } from 'react-redux';
import RoomLink from './RoomLink';

const Room = () => {
  // const dispatch = useDispatch();
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

  return (
    <div className={styles.content}>
      {!settings?.id ? (
        <div>CARGANDO PARTIDA</div>
      ) : (
        <>
          <RoomLink />
          <h1>Partida {settings.name}</h1>
          <div>
            <label>Administradores: </label>
            <span>{admins}</span>
            <br />
            <label>Por ingresar: </label>
            <span>{emptySockets}</span>
          </div>
          <h2>
            Jugadores en Lobby ( {players.length} / {settings.maxPlayers} )
          </h2>
          <ul>
            {players.map(player => (
              <li>{`${player.nickname} <${player.email}> ${
                isEmpty(player.sockets) ? 'Offline' : ''
              }`}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Room;
