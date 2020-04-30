import React from 'react';
import { prop } from 'lodash/fp';
import { useSelector } from 'react-redux';
import PlayerForm from './PlayerForm';
// import Emoji from 'components/Emoji';

const Play = () => {
  const { loading, ...player } = useSelector(prop('player'));

  if (loading) {
    return (
      <div className="game">
        <div>
          {/* <Emoji text="🙂" className="animated infinite rotateIn" /> */}
          Cargando ...
        </div>
      </div>
    );
  }

  return (
    <div className="game">
      {player?.nickname ? <div>Hola {player.nickname}</div> : <PlayerForm />}
    </div>
  );
};

export default Play;
