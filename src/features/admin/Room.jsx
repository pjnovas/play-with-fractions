import React from 'react';
import styles from './Room.module.css';
import { prop, propOr } from 'lodash/fp';
import { useDispatch, useSelector } from 'react-redux';
import { types as Routes } from 'routes';

import { getOnlinePlayers, getOfflinePlayers } from 'app/reducer/room/players';
import { isGameplay, hasEnded } from 'app/reducer/room/tables';
import Players from './Players';
import RoomLink from './RoomLink';
import Header from './RoomHeader';
import Tables from './Tables';

const help = {
  waiting:
    'Jugadores conectados (llenando o no el formulario) sobre los esperados para iniciar la partida',
  online:
    'Jugadores que llenaron el formulario de ingreso y están en la página de espera',
  offline:
    'Jugadores que ya ingresaron el formulario en esta partida pero cerraron la página (tienen que volver a ingresar el formulario con el MISMO EMAIL)'
};

const Lobby = () => {
  const settings = useSelector(propOr({}, 'room.settings'));
  const players = useSelector(propOr([], 'room.players'));
  const onlinePlayers = useSelector(getOnlinePlayers);
  const offlinePlayers = useSelector(getOfflinePlayers);

  const isFinished = useSelector(hasEnded);

  return (
    <>
      <h2 title={help.waiting}>
        Jugadores en espera ( {players.length} / {settings.maxPlayers} )
      </h2>
      <div className={styles.playerLists}>
        <Players
          title={help.online}
          type="Online"
          list={onlinePlayers}
          total={settings.maxPlayers}
        />
        <Players
          title={help.offline}
          type="Offline"
          list={offlinePlayers}
          total={settings.maxPlayers}
        />
      </div>
      {isFinished && <h2>Partida terminada [agregar link ranking]</h2>}
    </>
  );
};

const Room = () => {
  const dispatch = useDispatch();
  const token = useSelector(prop('location.params.token'));
  const settings = useSelector(propOr({}, 'room.settings'));
  const isPlaying = useSelector(isGameplay);

  const goToNewRoom = () => dispatch({ type: Routes.ADMIN, params: { token } });

  return (
    <div className={styles.content}>
      {!settings.id || settings.notFound ? (
        <>
          <h2>Partida no encontrada</h2>
          <button onClick={goToNewRoom}>Crear una partida nueva</button>
        </>
      ) : (
        <>
          <RoomLink />
          <h1>Partida {settings.name}</h1>
          <Header />
          {isPlaying ? <Tables /> : <Lobby />}
        </>
      )}
    </div>
  );
};

export default Room;
