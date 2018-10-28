export const pipeReducers = (reducer, innerReducers, initialState) => (
  state = initialState,
  action
) => {
  const namesOfInnerReducers = Object.keys(innerReducers);
  const nextState = reducer(state, action);
  const stateToPipe = {};

  namesOfInnerReducers.forEach(name => {
    stateToPipe[name] = innerReducers[name](state[name], action);
  });

  return { ...nextState, ...stateToPipe };
};
