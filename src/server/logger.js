import colors from 'colors';
import { diffJson } from 'diff';

export default store => next => action => {
  console.group(action.type);
  console.info('ACTION', action);

  const prevState = store.getState();
  let result = next(action);
  const nextState = store.getState();

  // TODO: make this recursive
  Object.keys(nextState).forEach(key => {
    const diff = diffJson(prevState[key], nextState[key]);

    if (diff.length > 1) {
      console.log(
        diff.reduce(
          (log, { value, added, removed }) =>
            `${log}${
              added
                ? colors.green(value)
                : removed
                ? colors.red(value)
                : colors.gray(value)
            }`,
          colors.gray(`"${key}": `)
        )
      );
    }
  });

  console.groupEnd(action.type);
  return result;
};
