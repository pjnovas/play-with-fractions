import React, { useRef } from 'react';
import styles from './GameTable.module.css';
import { noop, shuffle, take } from 'lodash';
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

const PlayerBadge = ({ me, nickname, points, state }) => (
  <div className={[styles.player, me ? styles.me : ''].join(' ')}>
    <div className={styles.points}>{points}</div>
    <div className={styles.nickname}>{nickname}</div>
    <PlayerReaction state={state} />
  </div>
);

const PlayerList = ({ side }) => {
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

const Messages = () => {
  const { pick, winCard } = useSelector(prop('table'));
  let msg = '';

  if (winCard) {
    if (winCard === pick) {
      msg = 'Muy bien!';
    } else {
      msg = 'Ups!, esa no era';
    }
  } else if (!pick) {
    msg = 'Seleccioná una carta antes de que se termine el tiempo!';
  } else {
    msg = 'Bien!, ahora esperemos a los demás ...';
  }

  return <div className={styles.messages}>{msg}</div>;
};

const Cards = () => {
  const dispatch = useDispatch();
  const { cards, pick, timeout, winCard } = useSelector(prop('table'));
  const colors = useRef(getRndColors(3));

  const onPickCard = card => () => {
    const action = pickCard(card);
    dispatch(action); // local update
    dispatch({ type: 'WS:SEND', payload: action });
  };

  return (
    <div className={styles.cards}>
      <div className={styles.promp}>Cuál es la fracción mayor?</div>
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
      <div className={styles.footer}>
        <div className={[styles.timeBox, 'animated infinite pulse'].join(' ')}>
          {timeout / 1000}
        </div>
        <Messages />
      </div>
    </div>
  );
};

const GameTable = () => (
  <div className={styles.content}>
    <Cards />
    <PlayerList />
  </div>
);

export default GameTable;
