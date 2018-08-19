import createArrayReducer from '.create-array-reducer';
import createBooleanReducer from '.create-boolean-reducer';
import createPropertyReducer from '.create-property-reducer';
import createObjectReducer from './create-object-reducer';
import * as actionHandlers from './action-handlers';

export default reducerCreators = {
  ...actionHandlers,
  createArrayReducer,
  createBooleanReducer,
  createPropertyReducer,
  createObjectReducer
};
