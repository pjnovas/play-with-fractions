import React from 'react';
import styles from './Players.module.css';
import { prop } from 'lodash/fp';
import { useSelector } from 'react-redux';
import PlayerReaction from './PlayerReaction';

const PlayerBadge = ({ me, nickname, points, state }) => (
  <div className={[styles.player, me ? styles.me : ''].join(' ')}>
    <div className={styles.points}>{points}</div>
    <div className={styles.nickname}>{nickname}</div>
    <PlayerReaction state={state} />
  </div>
);

const Players = ({ side }) => {
  const me = useSelector(prop('player'));
  const { players, points } = useSelector(prop('table'));

  return (
    <div className={[styles.players, styles[side]].join(' ')}>
      {players.map(({ email, ...player }) => (
        <PlayerBadge
          key={email}
          {...player}
          me={me.email === email}
          points={points[email] || 0}
        />
      ))}
    </div>
  );
};

export default Players;
