import React from 'react';
import Room from './Room';
import RoomForm from './RoomForm';

const Admin = ({ roomId }) => (roomId ? <Room /> : <RoomForm />);

export default Admin;
