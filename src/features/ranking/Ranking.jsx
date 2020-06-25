import React from 'react';
import styles from './Ranking.module.css';
import { isEmpty } from 'lodash';
import { prop } from 'lodash/fp';
import { useSelector } from 'react-redux';

const Ranking = () => {
  const players = useSelector(prop('room.ranking'));
  const me = useSelector(prop('player.nickname'));
  const loading = isEmpty(players);

  return (
    <div className={styles.Ranking}>
      {!loading && players.length && (
        <>
          <h1>Ranking</h1>
          <table className={styles.rank}>
            <thead>
              <tr>
                <th></th>
                <th>Nombre</th>
                <th>Puntos</th>
              </tr>
            </thead>
            <tbody>
              {players.map(({ position, nickname, points }) => (
                <tr key={nickname} className={me === nickname ? styles.me : ''}>
                  <td>{`#${position}`}</td>
                  <td>{nickname}</td>
                  <td>{points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default Ranking;
