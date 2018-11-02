import createValueReducer from './create-value-reducer'

describe('createPropertyReducer', () => {
  let reducer
  beforeEach(() => {
    reducer = createValueReducer('redux', {
      UPDATE_ACTION: 'update',
      RESET_ACTION: 'reset'
    })
  })

  it('should return initialState when action is not found', () => {
    const result = reducer(undefined, { type: 'RANDOM' })
    expect(result).toEqual('redux')
  })

  it('should return action payload when update action is found', () => {
    const result = reducer(undefined, {
      type: 'UPDATE_ACTION',
      payload: 'func'
    })
    expect(result).toEqual('func')
  })

  it('should return correct output when using update function', () => {
    const result = reducer(undefined, {
      type: 'UPDATE_ACTION',
      payload: (state) => state + '-func'
    })
    expect(result).toEqual('redux-func')
  })

  it('should return initalState when reset action is found', () => {
    const result = reducer('func', { type: 'RESET_ACTION' })
    expect(result).toEqual('redux')
  })
})
