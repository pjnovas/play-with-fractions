import React from 'react';
import styles from './CardList.module.css';
import { getFraction } from 'app/utils/room';

const CardList = ({ cards, highlight }) => (
  <ul className={styles.cards}>
    {cards.map((card, i) => (
      <li
        key={`${card}-${i}`}
        dangerouslySetInnerHTML={{ __html: getFraction(card) }}
        className={highlight === card ? styles.highlight : ''}
      ></li>
    ))}
  </ul>
);

export default CardList;
