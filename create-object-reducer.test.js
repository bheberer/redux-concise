import createObjectReducer from './create-object-reducer';
import createBooleanReducer from './create-boolean-reducer';
import createArrayReducer from './create-array-reducer';

describe('createObjectReducer', () => {
  let reducer;
  beforeEach(() => {
    reducer = createObjectReducer({ value: 10, bool: false, arr: [] }, {
      UPDATE_ACTION: 'update'
    }, {
      bool: createBooleanReducer(false, {
        TRUE_ACTION: 'true'
      })
    });
  });

  it('should return initialState if action is not found', () => {
    const result = reducer(undefined, { type: 'RANDOM' });
    expect(result).toEqual({ value: 10, bool: false });
  });

  it('should override object properties with action payload if udpate action is found', () => {
    const result = reducer(undefined, { type: 'UPDATE_ACTION', payload: { value: undefined, newValue: 20 } });
    expect(result).toEqual({ newValue: 20, bool: false });
  });

  it('should properly update piped properties with correspoding piped reducer', () => {
    const result = reducer(undefined, { type: 'TRUE_ACTION' });
    expect(result).toEqual({ value: 10, bool: true });
  });
})