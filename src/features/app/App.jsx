import React from 'react';
import Admin from '../admin';

const qsToken = process.env.REACT_APP_QS_TOKEN;
const qsRoomId = process.env.REACT_APP_QS_ROOM;

const App = () => {
  const urlParams = new URLSearchParams(window.location.search);

  if (urlParams.get(qsToken)) {
    return <Admin roomId={urlParams.get(qsRoomId)} />;
  }

  if (urlParams.get(qsRoomId)) {
    return <div>ROOM</div>;
  }

  return <div>UNAUTHORIZED</div>;
};

export default App;
