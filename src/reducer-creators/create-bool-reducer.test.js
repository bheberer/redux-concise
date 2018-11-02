import createBoolReducer from './create-bool-reducer';

describe('createBoolReducer', () => {
  let reducer;
  beforeEach(() => {
    reducer = createBoolReducer(false, {
      TRUE_ACTION: 'true',
      FALSE_ACTION: 'false',
      TOGGLE_ACTION: 'toggle',
      RESET_ACTION: 'reset'
    });
  });

  it('should return initialState if action is not found', () => {
    const nextState = reducer(undefined, { type: 'RANDOM' });
    expect(nextState).toBe(false);
  });

  it('should return true if a truthy action is found', () => {
    const nextState = reducer(false, { type: 'TRUE_ACTION' });
    expect(nextState).toBe(true);
  });

  it('should return false if a falsy action in found', () => {
    const nextState = reducer(true, { type: 'FALSE_ACTION' });
    expect(nextState).toBe(false);
  });

  it('should return false if we toggle when state is true', () => {
    const nextState = reducer(true, { type: 'TOGGLE_ACTION' });
    expect(nextState).toBe(false);
  });

  it('should return true if we toggle when state is false', () => {
    const nextState = reducer(false, { type: 'TOGGLE_ACTION' });
    expect(nextState).toBe(true);
  });

  it('should reset to initialState if reset action is found', () => {
    const result = reducer(undefined, { type: 'RESET_ACTION' });
    expect(result).toEqual(false);
  })
});
