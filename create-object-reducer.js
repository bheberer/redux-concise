import { overrideObjectProps } from "./action-handlers";
import { pipeReducers } from './utils';

const createObjectReducer = (initialState, actionTypes, reducersToPipe) => {
  const sourceReducer = (state = initialState, action) =>
    actionTypes[action.type] ?
      overrideObjectProps(state, action) :
      state;
      
  return reducersToPipe ?
    pipeReducers(sourceReducer, reducersToPipe, initialState) :
    sourceReducer;
};

export default createObjectReducer;
