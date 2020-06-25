import React, { useState, useEffect } from 'react';
import styles from './Tables.module.css';
import { propOr, map, orderBy, pipe } from 'lodash/fp';
import { useSelector } from 'react-redux';

import CardList from './CardList';

const TablePlayer = ({ winCard, nickname, points, pick }) => (
  <div>
    <div>{points}</div>
    <div className={winCard && !pick ? styles.empty : ''}>{nickname}</div>
    {pick && (
      <div
        className={
          winCard === pick
            ? styles.correct
            : (winCard && styles.incorrect) || ''
        }
      >
        {pick}
      </div>
    )}
  </div>
);

// TODO: make a selector for this
const Table = ({ players, points, picks, winCard }) => {
  const [tablePlayers, setPlayers] = useState([]);

  useEffect(() => {
    const translated = pipe(
      map(({ email, nickname }) => ({
        nickname,
        points: points[email],
        pick: picks[email] && picks[email].card
      })),
      orderBy(['points', 'nickname'], ['desc', 'asc'])
    )(players);

    setPlayers(translated);
  }, [players, points, picks]);

  return (
    tablePlayers.length && (
      <div className={styles.table}>
        {tablePlayers.map(props => (
          <TablePlayer key={props.nickname} winCard={winCard} {...props} />
        ))}
      </div>
    )
  );
};

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
