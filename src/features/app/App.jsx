import React from 'react';
import Admin from '../admin';
import './App.css';

const qsToken = process.env.REACT_APP_QS_TOKEN;
const qsRoomId = process.env.REACT_APP_QS_ROOM;

const App = () => {
  const urlParams = new URLSearchParams(window.location.search);

  if (urlParams.get(qsToken)) {
    return (
      <div className="App">
        <Admin />
      </div>
    );
  }

  if (urlParams.get(qsRoomId)) {
    return <div className="App">ROOM</div>;
  }

  return <div className="App">UNAUTHORIZED</div>;
};

export default App;
