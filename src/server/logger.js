import colors from 'colors';
import { diffJson } from 'diff';

export default store => next => action => {
  console.group(action.type);
  console.info('ACTION', action);

  const prevState = store.getState();
  let result = next(action);
  const nextState = store.getState();

  const diff = diffJson(prevState, nextState);

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
      ''
    )
  );

  console.groupEnd();
  return result;
};
