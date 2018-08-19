import { push, pop, concat, clear, filter, map, resetState } from './action-handlers';

const createArrayReducer = (initialState = [], actionTypes) =>
  (state = initialState, action) => {
    const arrayHandlers = {
      push: () => push(state, action),
      pop: () => pop(state, action),
      concat: () => concat(state, action),
      clear: () => clear(state, action),
      filter: () => filter(state, action),
      map: () => map(state, action),
      reset: () => resetState(initialState)
    };

    const handlerType = actionTypes[action.type];
    return handlerType ? arrayHandlers[handlerType]() : state;
  };

export default createArrayReducer;