import React from 'react';
import styles from './GameTable.module.css';
import { prop } from 'lodash/fp';
import { useSelector } from 'react-redux';
// import Emoji from 'components/Emoji';

const GameTable = () => {
  const player = useSelector(prop('player'));
  const table = useSelector(prop('table'));

  return (
    <div className={styles.table}>
      {table.id} - {player.nickname}
    </div>
  );
};

export default GameTable;
