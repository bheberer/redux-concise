import { overrideObjectProps, resetState } from "./action-handlers";
import { pipeReducers } from '../utils';

const createObjectReducer = (initialState, actionTypes) => {
  const sourceReducer = (state = initialState, action) => {
    const objectHandlers = {
      override: () => overrideObjectProps(state, action),
      reset: () => resetState(initialState)
    }

    const handlerType = actionTypes[action.type];
    return handlerType ? objectHandlers[handlerType]() : state;
  };

  const reducersToPipe = actionTypes['PIPE'];

  return reducersToPipe ?
    pipeReducers(sourceReducer, reducersToPipe, initialState) :
    sourceReducer;
};

export default createObjectReducer;
