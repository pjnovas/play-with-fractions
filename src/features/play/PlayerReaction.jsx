import React from 'react';
import styles from './PlayerReaction.module.css';
import { shuffle } from 'lodash';
import Emoji from 'components/Emoji';

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

export default PlayerReaction;
