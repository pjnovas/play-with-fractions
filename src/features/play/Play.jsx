import React from 'react';
import styles from './Play.module.css';
import { prop } from 'lodash/fp';
import { useSelector } from 'react-redux';
import PlayerForm from './PlayerForm';
import GameTable from './GameTable';
import Emoji from 'components/Emoji';

const Play = () => {
  const { loading, ...player } = useSelector(prop('player'));

  if (loading) {
    return (
      <div className={styles.fullscreen}>
        <Emoji text="🙂" className={styles.animRotate} />
        <span>Esperando inicio de partida...</span>
      </div>
    );
  }

  return (
    <div className="game">
      {player?.nickname ? <GameTable /> : <PlayerForm />}
    </div>
  );
};

export default Play;
