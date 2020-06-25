import React from 'react';

import styles from './Home.module.css';
import Admin from 'features/admin/RoomForm';
import AdminRoom from 'features/admin/Room';
import Play from 'features/play';
import Ranking from 'features/ranking';

import { useSelector } from 'react-redux';
import { prop } from 'lodash/fp';

const Home = () => (
  <div className={styles.hero}>
    <div>
      l0-0l<span>.xyz</span>
    </div>
    <p>Play with fractions</p>
  </div>
);

const NotFound = () => {
  const path = useSelector(prop('location.pathname'));
  return (
    <div>
      <h3>404</h3>
      Page not found: <code>{path}</code>
    </div>
  );
};

export default {
  Home,
  Admin,
  AdminRoom,
  Play,
  Ranking,
  NotFound
};
