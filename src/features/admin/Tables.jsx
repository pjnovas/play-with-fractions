import React from 'react';
import styles from './Tables.module.css';
import { propOr } from 'lodash/fp';
import { useSelector } from 'react-redux';

import CardList from './CardList';

const Table = ({ winCard, players, points, picks }) => (
  <div className={styles.table}>
    {players.map(({ email, nickname }) => (
      <div>
        <div>{points[email]}</div>
        <div className={winCard && !picks[email] ? styles.empty : ''}>
          {nickname}
        </div>
        {picks[email] && (
          <div
            className={
              winCard === picks[email]
                ? styles.correct
                : (winCard && styles.incorrect) || ''
            }
          >
            {picks[email]}
          </div>
        )}
      </div>
    ))}
  </div>
);

const Tables = () => {
  const { deck, cards, winCard, tables } = useSelector(
    propOr({}, 'room.tables')
  );

  const { cardsPerRound } = useSelector(propOr({}, 'room.settings'));

  return (
    <div className={styles.content}>
      <div className={styles.cards}>
        <h3>{`Ronda Actual (quedan ${deck.length / cardsPerRound} rondas)`}</h3>
        <CardList cards={cards} highlight={winCard} />
      </div>
      <div className={styles.tables}>
        {(tables || []).map(table => (
          <Table key={table.id} winCard={winCard} {...table} />
        ))}
      </div>
    </div>
  );
};

export default Tables;
