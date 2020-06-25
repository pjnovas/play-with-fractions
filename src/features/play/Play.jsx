import React from 'react';
import styles from './Play.module.css';
import { prop } from 'lodash/fp';
import { useSelector } from 'react-redux';
import { isLoading, hasStarted, hasEnded } from 'app/reducer/room/table';
import PlayerForm from './PlayerForm';
import GameTable from './GameTable';
import Emoji from 'components/Emoji';
import Ranking from 'features/ranking';

const Logout = () => {
  const onLogout = () => {
    window.localStorage.removeItem('player');
    window.location.reload();
  };

  return (
    <button className={styles.logout} onClick={onLogout}>
      <Emoji text="🏃" />
    </button>
  );
};

const Play = () => {
  const player = useSelector(prop('player'));
  const { timeout } = useSelector(prop('table'));
  const isFinished = useSelector(hasEnded);
  const justStarted = useSelector(hasStarted);
  const loading = useSelector(isLoading);

  if (justStarted) {
    return (
      <div className={styles.fullscreen}>
        <Emoji
          text="😁"
          className={[styles.animStarted, 'animated infinite bounce'].join(' ')}
        />
        <span className={styles.setready}>
          Preparate!, empieza en <b>{Math.round(timeout / 1000)}</b>
        </span>
      </div>
    );
  }

  if (!player?.nickname) {
    return (
      <div className="game">
        <PlayerForm />
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.fullscreen}>
        <Emoji text="🙂" className={styles.animRotate} />
        <span className={styles.waiting}>
          <b>{`Hola ${player.nickname}!`}</b>, esperemos a los demás
        </span>
        <Logout />
      </div>
    );
  }

  if (isFinished) {
    return <Ranking />;
  }

  return (
    <div className="game">
      <GameTable />
      <Logout />
    </div>
  );
};

export default Play;
