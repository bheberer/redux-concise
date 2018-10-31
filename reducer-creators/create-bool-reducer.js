import { toggle, resetState } from './action-handlers'

const createBoolReducer = (
  initialState,
  actionTypes,
  customHandlers = {}
) => (state = initialState, action) => {
  const booleanHandlers = {
    true: () => true,
    false: () => false,
    toggle: () => toggle(state),
    reset: () => resetState(initialState),
    ...customHandlers
  }

  const handlerType = actionTypes[action.type]
  return handlerType ? booleanHandlers[handlerType](state, action) : state
}

export default createBoolReducer
