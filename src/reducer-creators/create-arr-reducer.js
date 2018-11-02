import {
  push,
  pop,
  concat,
  clear,
  filter,
  map,
  updateValueAtIndex,
  resetState
} from './action-handlers'

const createArrReducer = (
  initialState = [],
  actionTypes,
  customHandlers = {}
) => (state = initialState, action) => {
  const arrayHandlers = {
    push: () => push(state, action),
    pop: () => pop(state, action),
    updateIndex: () => updateValueAtIndex(state, action),
    concat: () => concat(state, action),
    clear: () => clear(state, action),
    filter: () => filter(state, action),
    map: () => map(state, action),
    reset: () => resetState(initialState),
    ...customHandlers
  }

  const handlerType = actionTypes[action.type]
  return handlerType ? arrayHandlers[handlerType](state, action) : state
}

export default createArrReducer
