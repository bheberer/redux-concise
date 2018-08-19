import { overrideStateProp, resetState } from "./action-handlers";

const createPropertyReducer = (initialState, actionTypes) =>
  (state = initialState, action) => {
    const propertyHandlers = {
      override: () => overrideStateProp(action),
      reset: () => resetState(initialState)
    };

    const handlerType = actionTypes[action.type];
    return handlerType ? propertyHandlers[handlerType]() : state; 
  };

export default createPropertyReducer;
