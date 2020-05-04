import React, { useRef } from 'react';
import styles from './GameTable.module.css';
import { noop, shuffle, take, random } from 'lodash';
import { prop } from 'lodash/fp';
import { useSelector, useDispatch } from 'react-redux';
import { getFraction } from 'app/utils/room';
import { pick as pickCard } from 'app/reducer/room/table';
import Emoji from 'components/Emoji';

const allColors = ['yellow', 'blue', 'green', 'red', 'violet'];
const getRndColors = qty => take(shuffle(allColors), qty);

const PlayerReaction = ({ state }) => {
  switch (state) {
    case 'win':
      return (
        <Emoji
          text={shuffle(['😎', '😁', '😄'])[0]}
          className={`${styles.emoji} animated infinite bounce`}
        />
      );
    case 'loose':
      return (
        <Emoji
          text={shuffle(['😠', '😟', '😑'])[0]}
          className={`${styles.emoji} animated infinite swing`}
        />
      );
    case 'pick':
      return (
        <Emoji
          text={shuffle(['😬', '🤭', '😏'])[0]}
          className={`${styles.emoji} animated infinite tada`}
        />
      );
    default:
      return (
        <Emoji
          text={shuffle(['🤔', '😕', '🤨'])[0]}
          className={`${styles.emoji} animated infinite pulse`}
        />
      );
  }
};

const PlayerBadge = ({ nickname, points, state }) => (
  <div className={styles.player}>
    <div className={styles.points}>{points}</div>
    <div className={styles.nickname}>{nickname}</div>
    <PlayerReaction state={state} />
  </div>
);

const PlayerList = ({ side }) => {
  const { players, points } = useSelector(prop('table'));

  return (
    <div className={[styles.players, styles[side]].join(' ')}>
      {players.map(({ email, ...player }) => (
        <PlayerBadge key={email} {...player} points={points[email]} />
      ))}
    </div>
  );
};

const Messages = () => {
  const { pick } = useSelector(prop('table'));
  let msg = '';

  if (!pick) {
    msg = 'Seleccioná una carta antes de que se termine el tiempo!';
  } else {
    msg = 'Bien!, ahora esperemos a los demás ...';
  }

  return <div className={styles.messages}>{msg}</div>;
};

const Cards = () => {
  const dispatch = useDispatch();
  const { cards, pick, timeout } = useSelector(prop('table'));
  const colors = useRef(getRndColors(cards.length));

  const onPickCard = card => () => {
    const action = pickCard(card);
    dispatch(action); // local update
    dispatch({ type: 'WS:SEND', payload: action });
  };

  return (
    <div className={styles.cards}>
      <div className={styles.promp}>Cuál es la carta mas alta?</div>
      {cards.map((card, i) => (
        <div
          key={card}
          className={[
            styles.card,
            styles[colors.current[i]],
            pick ? (pick === card ? styles.selected : styles.notSelected) : ''
          ].join(' ')}
          onClick={pick ? noop : onPickCard(card)}
        >
          <div
            className={styles.cardInner}
            dangerouslySetInnerHTML={{ __html: getFraction(card) }}
          ></div>
        </div>
      ))}
      <div className={styles.footer}>
        <div className={[styles.timeBox, 'animated infinite pulse'].join(' ')}>
          {timeout / 1000}
        </div>
        <Messages />
      </div>
    </div>
  );
};

// const { nickname, email } = useSelector(prop('player'));
const GameTable = () => (
  <div className={styles.content}>
    <Cards />
    <PlayerList />
  </div>
);

export default GameTable;
