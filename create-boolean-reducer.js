import { toggle } from './action-handlers';

const createBooleanReducer = (initialState, actionTypes) =>
  (state = initialState, action) => {
    const booleanHandlers = {
      true: () => true,
      false: () => false,
      toggle: () => toggle(state)
    };

    const handlerType = actionTypes[action.type];
    return handlerType ? booleanHandlers[handlerType]() : state;
  };

export default createBooleanReducer;