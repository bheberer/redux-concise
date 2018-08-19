export const pipeReducers = (reducer, reducersToPipe, initialState) =>
  (state = initialState, action) => {
    const namesOfReducersToPipe = Object.keys(reducersToPipe);
    const nextState = reducer(state, action);
    const stateToPipe = {};

    namesOfReducersToPipe.forEach(name => {
      stateToPipe[name] = reducersToPipe[name](state[name], action)
    });

    return { ...nextState, ...stateToPipe };
  };
  