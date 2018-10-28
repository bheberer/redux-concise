import {
  push,
  pop,
  concat,
  clear,
  filter,
  map,
  resetState
} from './action-handlers';

const createArrayReducer = (initialState = [], actionTypes, customHandlers = {}) => (
  state = initialState,
  action
) => {
  const arrayHandlers = {
    push: () => push(state, action),
    pop: () => pop(state, action),
    updateValueAtIndex: () => updateValueAtIndex(state, action),
    concat: () => concat(state, action),
    clear: () => clear(state, action),
    filter: () => filter(state, action),
    map: () => map(state, action),
    reset: () => resetState(initialState),
    ...customHandlers
  };

  const handlerType = actionTypes[action.type];
  return handlerType ? arrayHandlers[handlerType]() : state;
};

export default createArrayReducer;
