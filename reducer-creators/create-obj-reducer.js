import { updateObjectProps, resetState, clearObject } from './action-handlers'
import { pipeReducers } from '../utils'

const createObjReducer = (
  initialState,
  actionTypes,
  customHandlers = {},
  innerReducers = {}
) => /*{
  const sourceReducer = */(state = initialState, action) => {
    const objectHandlers = {
      update: () => updateObjectProps(state, action),
      clear: () => clearObject(state, action),
      reset: () => resetState(initialState),
      ...customHandlers
    }

    const namesOfInnerReducers = Object.keys(innerReducers)
    const stateToPipe = {};

    namesOfInnerReducers.forEach(name => {
      stateToPipe[name] = innerReducers[name](state[name], action)
    })

    const pipedState = { ...state, ...stateToPipe }

    const handlerType = actionTypes[action.type]
    return handlerType ? objectHandlers[handlerType](pipedState, action) : pipedState
  }

  // return innerReducers && actionTypes[action.type] !== 'clear'
  //   ? pipeReducers(sourceReducer, innerReducers, initialState)
  //   : sourceReducer
// }

export default createObjReducer
