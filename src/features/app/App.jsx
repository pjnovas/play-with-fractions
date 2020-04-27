import React from 'react';
import { useDispatch } from 'react-redux';
import { create } from '../../app/reducer/room/settings';
import './App.css';

const qsToken = process.env.REACT_APP_QS_TOKEN;
const qsRoomId = process.env.REACT_APP_QS_ROOM;

const App = () => {
  const dispatch = useDispatch();
  const urlParams = new URLSearchParams(window.location.search);

  const createRoom = () => {
    dispatch({
      type: 'WS:SEND',
      payload: create({
        name: 'My Room',
        // cards,
        maxPlayers: 24,
        maxPerTable: 3
      })
    });
  };

  if (urlParams.get(qsToken)) {
    return (
      <div className="App">
        ADMIN
        <button onClick={createRoom}>CREATE</button>
      </div>
    );
  }

  if (urlParams.get(qsRoomId)) {
    return (
      <div className="App">
        ROOM
        <button onClick={createRoom}>CREATE</button>
      </div>
    );
  }

  return <div className="App">UNAUTHORIZED</div>;
};

export default App;
