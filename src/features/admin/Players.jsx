import React from 'react';
import styles from './Players.module.css';

const Players = ({ type, title, list, total }) => (
  <div className={styles.container}>
    <h3 title={title} className={styles.title}>
      {type} ( {list.length} / {total} )
    </h3>
    <ul className={styles.players}>
      {list.map(player => (
        <li key={player.email}>{`${player.nickname} <${player.email}>`}</li>
      ))}
    </ul>
  </div>
);

export default Players;
