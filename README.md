# redux-func


## Introduction
redux-func is a library of higher-order functions that let you create more concise reducers.

## Example

```js
import { createArrayReducer } from 'redux-func';

// actions that are data-reliant must be constructed with a payload property
const addAction = {
  type: 'ADD_TO_ARRAY',
  payload: 'data'
};

// filter + map action handlers require that the filter/map function be included in the action
const removeAction = {
  type: 'REMOVE_FROM_ARRAY',
  payload: 'data',
  filter: (element, action) => element !== action.payload
};

// this action needs no data, so no payload is given
const clearAction = {
  type: 'CLEAR_ARRAY'
};

const reducer = createArrayReducer([], {
  ADD_TO_ARRAY: 'push',
  REMOVE_FROM_ARRAY: 'filter',
  CLEAR_ARRAY: 'clear'
});
```
Each reducer creator comes with a set of default action handlers that you can assign to an action type.

## Composition
If you want have an object in your redux state that contains a property that you want to control via another, more specific
reducer, you can utilize the special `PIPE` action type to compose reducers into your object reducer.

```js
import { createObjectReducer, createArrayReducer } from 'redux-func';

const reducer = createObjectReducer({}, {
  OVERRIDE_PROPERTIES: 'override',
  RESET_OBJECT: 'reset',
  PIPE: {
    arr: createArrayReducer([], {
      ADD_TO_ARRAY: 'push'
    })
  }
}
```
Now, whatever slice of state that we create with `reducer` will contain an `arr` property that is controlled by it's own reducer,
so you can take advantage of all of the things that createArrayReducer gives you.
