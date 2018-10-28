import { updateObjectProps, resetState } from './action-handlers'
import { pipeReducers } from '../utils'

const createObjectReducer = (
  initialState,
  actionTypes,
  innerReducers = null,
  customHandlers = null
) => {
  const sourceReducer = (state = initialState, action) => {
    const objectHandlers = {
      update: () => updateObjectProps(state, action),
      clear: () => clearObject(state, action),
      reset: () => resetState(initialState),
      ...customHandlers
    }

    const handlerType = actionTypes[action.type]
    return handlerType ? objectHandlers[handlerType]() : state
  }

  return reducersToPipe
    ? pipeReducers(sourceReducer, innerReducers, initialState)
    : sourceReducer
}

export default createObjectReducer
