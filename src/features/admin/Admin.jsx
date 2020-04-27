import React from 'react';
import { useDispatch } from 'react-redux';
import { create } from '../../app/reducer/room/settings';
import RoomForm from './RoomForm';

const Admin = () => {
  const dispatch = useDispatch();

  const createRoom = room => {
    dispatch({
      type: 'WS:SEND',
      payload: create({
        ...room,
        maxPlayers: Number(room.maxPlayers),
        maxPerTable: Number(room.maxPerTable),
        cards: room.cards.split('\n')
      })
    });
  };

  return (
    <div>
      <RoomForm onSubmit={createRoom} />
    </div>
  );
};

export default Admin;
