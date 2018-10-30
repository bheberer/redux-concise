import { updateObjectProps, resetState, clearObject } from './action-handlers'
import { pipeReducers } from '../utils'

const createObjectReducer = (
  initialState,
  actionTypes,
  // innerReducers = null,
  customHandlers = {}
) => (state = initialState, action) => {
  // const sourceReducer = (state = initialState, action) => {
  const objectHandlers = {
    update: () => updateObjectProps(state, action),
    clear: () => clearObject(state, action),
    reset: () => resetState(initialState),
    ...customHandlers
  }

  const handlerType = actionTypes[action.type]
  return handlerType ? objectHandlers[handlerType](state, action) : state
  // }

  // return reducersToPipe
  //   ? pipeReducers(sourceReducer, innerReducers, initialState)
  //   : sourceReducer
}

export default createObjectReducer
