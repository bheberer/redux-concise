# redux-func

## Introduction

This library was created with the intent of reducing the amount of boilerplate code needed to write Redux reducers. It is a collection of reducer creators, which are higher order functions that output a fully functional reducer. The reducer creators provided here help to create reducers for some of the most common use cases for different JavaScript data structures.

## Installation

This library is distrubuted on npm, and has no dependencies.

```
npm install --save redux-func
```

## Reducer Creators
Currently, the reducer creators included in the library are as follows:
- Boolean (set true, set false, toggle, reset to initial state)
- Value (update, reset to initial state)
- Array (push, pop, update at index, concat, clear, filter, map, reset to initial state)
- Object (add, remove, update, clear, reset to initial state)

## Example
Let's create the reducers for the todo app written in the Redux documentation with redux-func so we can see how concise we can get our code to be.

```js
const visibilityFilter = createValReducer(SHOW_ALL, {
  SET_VISIBILITY_FILTER: 'update'
})

const todos = createArrReducer([], {
  ADD_TODO: 'push',
  TOGGLE_TODO: 'updateValueAtIndex'
})
```

## Actions
This concision is achieved through some basic assumptions that the reducers make about the actions that they recieve. For the most part,they expect to recieve actions that follow the Flux Standard Action rules, with some exceptions.

There are three types of actions to be used with redux-func. Actions that only require a type field, actions that require both a type and payload field and actions that require a type, payload and something extra.

- Boolean
  - set true: type only
  - set false: type only
  - toggle: type only
  - reset: type only
- Value
  - update: type + payload
  - reset: type only
- Array
  - push: type + payload (value to be pushed)
  - pop: type only
  - update index: type + payload (new value or update function) + index
    - example of an update function ``` (elem) => elem + 1 ```
  - concat: type + payload (array to be concatenated)
  - clear: type only
  - filter: type + payload (filter function)
  - map: type + payload (map function)
  - reset: type only
- Object
  - add: type + payload (object containing values to add)
  - remove: type + payload (array with values to remove)
  - update: type + payload (object to update state with)
  - reset: type only
  - clear: type only

## Customizing Your Reducers
While I've tried my best to include a lot of the most common use cases in redux-func, there's more than likely going to be times where redux-func doesn't include an action that you want to use. Because of this, I've included an extra parameter to all redux-func reducers called `customHandlers`, which is an object in which you can include whatever custom action handler functions you want and use them in the same way you would use the standard, included handlers.

As an example, the standard `push` handler in redux-func adds a value to the back of an array. Now, you want to add something to the front of the array instead. Here's how you would do it.

```js
const reducer = createArrReducer([], {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
  ADD_TO_FRONT: 'addToFront'
}, {
  addToFront: (state, action) => [...state, action.payload]
})
```
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

function reducer(state = 'hello', action) {
  switch (action.type) {
    case SAY_HI:
      return action.payload;
    case SAY_GOODBYE:
      return action.payload;

    default:
      return state;
  }
}

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

const reducer = createObjectReducer(
  {},
  {
    OVERRIDE_PROPERTIES: 'override',
    RESET_OBJECT: 'reset'
  },
  {
    arr: createArrayReducer([], {
      ADD_TO_ARRAY: 'push'
    })
  }
);
```

Now, whatever slice of state that we create with `reducer` will contain an `arr` property that is controlled by it's own reducer,
so you can take advantage of all of the things that createArrayReducer gives you.

## Creating Custom Reducers

```js
const enhancedArrReducer = createArrReducer(
  [],
  {
    ADD: 'push'
  },
  {
    appendToFront: (state, action) => [...action.payload, ...state]
  }
);
```
