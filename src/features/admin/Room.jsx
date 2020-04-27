import React from 'react';
// import styles from './Room.module.css';
import { prop } from 'lodash/fp';
import { useDispatch, useSelector } from 'react-redux';
import RoomLink from './RoomLink';

const Room = () => {
  const dispatch = useDispatch();
  const settings = useSelector(prop('room.settings'));

  return (
    <div>
      {!settings ? (
        <div>CARGANDO</div>
      ) : (
        <>
          <RoomLink />
          <h1>Partida {settings.name}</h1>
        </>
      )}
    </div>
  );
};

export default Room;
