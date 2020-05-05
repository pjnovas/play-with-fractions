import React, { useRef } from 'react';
import styles from './Cards.module.css';
import { noop, shuffle, take } from 'lodash';
import { prop } from 'lodash/fp';
import { useSelector, useDispatch } from 'react-redux';
import { getFraction } from 'app/utils/room';
import { pick as pickCard } from 'app/reducer/room/table';

const allColors = ['yellow', 'blue', 'green', 'red', 'violet'];
const getRndColors = qty => take(shuffle(allColors), qty);

const Cards = () => {
  const dispatch = useDispatch();
  const { cards, pick, winCard } = useSelector(prop('table'));
  const colors = useRef(getRndColors(3));

  const onPickCard = card => () => {
    const action = pickCard(card);
    dispatch(action); // local update
    dispatch({ type: 'WS:SEND', payload: action });
  };

  return (
    <div className={styles.cards}>
      {cards.map((card, i) => (
        <div
          key={card}
          className={[
            styles.card,
            styles[colors.current[i]],
            pick ? (pick === card ? styles.selected : styles.notSelected) : '',
            winCard
              ? winCard === card
                ? styles.correct
                : styles.incorrect
              : ''
          ].join(' ')}
          onClick={pick ? noop : onPickCard(card)}
        >
          <div
            className={styles.cardInner}
            dangerouslySetInnerHTML={{ __html: getFraction(card) }}
          ></div>
        </div>
      ))}
    </div>
  );
};

export default Cards;
