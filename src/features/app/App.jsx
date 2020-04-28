import React from 'react';
import { useSelector } from 'react-redux';
import { prop } from 'lodash/fp';
import pages from './pages';

const App = () => {
  const page = useSelector(prop('page'));
  const Component = pages[page];
  return <Component />;
};

export default App;
