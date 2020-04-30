import React from 'react';

import Admin from 'features/admin/RoomForm';
import AdminRoom from 'features/admin/Room';
import Play from 'features/play';

import { useSelector } from 'react-redux';
import { prop } from 'lodash/fp';

const Home = () => (
  <div>
    <p>Welcome home!</p>
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
  NotFound
};
