import React from 'react';
import styles from './Players.module.css';
import { useSelector } from 'react-redux';
import { tablePlayers } from 'app/reducer/room/table';
import PlayerReaction from './PlayerReaction';

const PlayerBadge = ({ me, nickname, points, state }) => (
  <div className={[styles.player, me ? styles.me : ''].join(' ')}>
    <div className={styles.points}>{points}</div>
    <div className={styles.nickname}>{nickname}</div>
    <PlayerReaction state={state} />
  </div>
);

const Players = ({ side }) => {
  const players = useSelector(tablePlayers);

  return (
    <div className={[styles.players, styles[side]].join(' ')}>
      {players.map(player => (
        <PlayerBadge key={player.email} {...player} />
      ))}
    </div>
  );
};

export default Players;
