import React from 'react';
import styles from './GameTable.module.css';
import { prop } from 'lodash/fp';
import { useSelector } from 'react-redux';

import { hasEnded } from 'app/reducer/room/table';

import Cards from './Cards';
import Players from './Players';

const Messages = ({ fixed }) => {
  const { pick, winCard } = useSelector(prop('table'));
  let msg = fixed || '';

  if (!msg) {
    if (winCard) {
      if (winCard === pick) {
        msg = 'Muy bien!';
      } else {
        msg = 'Ups!, esa no era';
      }
    } else if (!pick) {
      msg = 'Seleccioná una carta antes de que se termine el tiempo!';
    } else {
      msg = 'Bien!, esperemos a los demás ...';
    }
  }

  return <div className={styles.messages}>{msg}</div>;
};

const GameTable = () => {
  const { timeout } = useSelector(prop('table'));
  const isEnded = useSelector(hasEnded);

  return (
    <div className={styles.content}>
      <div className={styles.cardsContainer}>
        {!isEnded && (
          <>
            <div className={styles.promp}>Cuál es la fracción mayor?</div>
            <Cards />
          </>
        )}
        <div className={styles.footer}>
          <div
            className={[styles.timeBox, 'animated infinite pulse'].join(' ')}
          >
            {timeout / 1000}
          </div>
          <Messages
            fixed={isEnded && 'Partida Terminada!, cargando ranking ...'}
          />
        </div>
      </div>
      <Players />
    </div>
  );
};

export default GameTable;
