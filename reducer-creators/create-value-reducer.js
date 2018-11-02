import { overrideStateProp, resetState } from './action-handlers';

const createValueReducer = (initialState, actionTypes, customHandlers = null) => (
  state = initialState,
  action
) => {
  const propertyHandlers = {
    update: () => overrideStateProp(state, action),
    reset: () => resetState(initialState),
    ...customHandlers
  };

  const handlerType = actionTypes[action.type];
  return handlerType ? propertyHandlers[handlerType](state, action) : state;
};

export default createValueReducer;
