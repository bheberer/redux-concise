import createObjectReducer from './create-object-reducer';
import createBooleanReducer from './create-boolean-reducer';

describe('createObjectReducer', () => {
  const initialState = { 
    value: 10, 
    bool: false 
  };
  let reducer;

  beforeEach(() => {
    reducer = createObjectReducer(initialState, {
      OVERRIDE_ACTION: 'override',
      RESET_ACTION: 'reset'
    }, {
      bool: createBooleanReducer(false, {
        TRUE_ACTION: 'true'
      })
    });
  });

  it('should return initialState if action is not found', () => {
    const result = reducer(undefined, { type: 'RANDOM' });
    expect(result).toEqual(initialState);
  });

  it('should override object properties with action payload if override action is found', () => {
    const result = reducer(undefined, { type: 'OVERRIDE_ACTION', payload: { value: undefined, newValue: 20 } });
    expect(result).toEqual({ newValue: 20, bool: false });
  });

  it('should properly update piped properties with correspoding piped reducer', () => {
    const result = reducer(undefined, { type: 'TRUE_ACTION' });
    expect(result).toEqual({ value: 10, bool: true });
  });

  it('should reset to initialState if reset action is found', () => {
    const result = reducer(undefined, { type: 'RESET_ACTION' });
    expect(result).toEqual(initialState);
  })
})