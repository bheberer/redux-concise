import { overrideObjectProps, resetState } from "./action-handlers";
import { pipeReducers } from '../utils';

/*
This is how I want the use of this reducer to look like

reducer = createObjectReducer(initialState, {
  OVERRIDE_ACTION: 'override',
  RESET_ACTION: 'reset',
  PIPE: {
    bool: createBooleanReducer(false, {
      TRUE_ACTION: 'true'
    })
  }
})

*/

const createObjectReducer = (initialState, actionTypes, reducersToPipe) => {
  const sourceReducer = (state = initialState, action) => {
    const objectHandlers = {
      override: () => overrideObjectProps(state, action),
      reset: () => resetState(initialState)
    }

    const handlerType = actionTypes[action.type];
    return handlerType ? objectHandlers[handlerType]() : state;
  };

  return reducersToPipe ?
    pipeReducers(sourceReducer, reducersToPipe, initialState) :
    sourceReducer;
};

export default createObjectReducer;
