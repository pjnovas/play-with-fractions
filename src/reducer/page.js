import { types as Routes } from 'routes';

const components = {
  [Routes.HOME]: 'Home',
  [Routes.ADMIN]: 'Admin',
  [Routes.ADMIN_ROOM]: 'AdminRoom',
  [Routes.PLAY]: 'Play',
  [Routes.RANKING]: 'Ranking',
  [Routes.NOT_FOUND]: 'NotFound'
};

export default (state = 'Home', action = {}) =>
  components[action.type] || state;
