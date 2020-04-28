const routes = {
  PAGE_HOME: '/',
  PAGE_ADMIN: '/admin/:token',
  PAGE_ADMIN_ROOM: '/admin/:token/:roomId',
  PAGE_PLAY: '/play/:roomId'
};

export const types = Object.keys(routes).reduce(
  (all, key) => ({
    ...all,
    [key.replace('PAGE_', '')]: key
  }),
  {}
);

export default routes;
