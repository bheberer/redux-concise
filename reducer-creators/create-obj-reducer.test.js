import createObjReducer from './create-obj-reducer'
import createBoolReducer from './create-bool-reducer'

describe('createObjectReducer', () => {
  const initialState = {
    value: 10,
    bool: false
  }
  let bool
  let reducer

  beforeEach(() => {
    bool = createBoolReducer(false, {
      TOGGLE_ACTION: 'toggle'
    })

    reducer = createObjReducer(initialState, {
      UPDATE_ACTION: 'update',
      RESET_ACTION: 'reset',
      CLEAR_ACTION: 'clear'
    },
    {},
    {
      bool
    })
  })

  it('should return initialState if action is not found', () => {
    const result = reducer(undefined, { type: 'RANDOM' })
    expect(result).toEqual(initialState)
  })

  it('should update object properties with action payload if override action is found', () => {
    const result = reducer(undefined, {
      type: 'UPDATE_ACTION',
      payload: { value: undefined, newValue: 20 }
    })
    expect(result).toEqual({ newValue: 20, bool: false })
  })

  it('should reset to initialState if reset action is found', () => {
    const result = reducer(undefined, { type: 'RESET_ACTION' })
    expect(result).toEqual(initialState)
  })

  it('should clear object if clear action is found', () => {
    const result = reducer(undefined, { type: 'CLEAR_ACTION' })
    expect(result).toEqual({})
  })

  it('should properly utilize piped reducer', () => {
    const result = reducer(undefined, { type: 'TOGGLE_ACTION' })
    expect(result).toEqual({ value: 10, bool: true })
  })
})
