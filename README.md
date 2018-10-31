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
const visibilityFilter = createValReducer(
  SHOW_ALL, 
  { SET_VISIBILITY_FILTER: 'update' }
)

const todos = createArrReducer(
  [], 
  {
    ADD_TODO: 'push',
    TOGGLE_TODO: 'updateValueAtIndex'
  }
)
```

## Actions
This concision is achieved through some basic assumptions that the reducers make about the actions that they recieve. For the most part, they expect to recieve actions that follow the Flux Standard Action rules, with some exceptions.

There are three types of actions to be used with redux-func. Actions that only require a type field, actions that require both a type and payload field and actions that require a type, payload and something extra.

- Boolean
  - true: type only
  - false: type only
  - toggle: type only
  - reset (to initialState): type only
- Value
  - update: type + payload
  - reset: type only
- Array
  - push: type + payload (value to be pushed)
  - pop: type only
  - updateIndex: type + payload (new value or update function) + index
    - example of an update function ``` (elem) => elem + 1 ```
  - concat: type + payload (array to be concatenated)
  - clear: type only
  - filter: type + payload (filter function)
  - map: type + payload (map function)
  - reset (to initialState): type only
- Object
  - update (spread): type + payload (object to update state with)
  - reset (to initialState): type only
  - clear: type only

Misc. Action Examples:
```js
trueAction = {
  type: 'SET_TRUE'
}

filterAction = {
  type: 'NO_CATS',
  payload: (elem, index) => elem !== 'cat'
}

updateIndexAction = {
  type: 'EDIT_COMMENT',
  index: 10,
  payload: 'new comment'
}
```

## Customizing Your Reducers
While I've tried my best to include a lot of the most common use cases in redux-func, there's more than likely going to be times where redux-func doesn't include an action that you want to use. Because of this, I've included an extra parameter to all redux-func reducers called `customHandlers`, which is an object in which you can include whatever custom action handler functions you want and use them in the same way you would use the standard, included handlers.

As an example, the standard `push` handler in redux-func adds a value to the back of an array. Now, you want to add something to the front of the array instead. Here's how you would do it.

```js
const reducer = createArrReducer(
  [], 
  { ADD_TO_FRONT: 'addToFront' }, 
  { addToFront: (state, action) => [...state, action.payload] }
)
```

## Composition
In createObjReducer, there is an argument called `innerReducers` that lets you use a completely separate reducer for a particular property within your slice of state. For example, if we're creating a Twitter-like app, we might want to have a slice of state for a post that includes the user that created the post, the content of the post, as well as the comments on that post. Here's how we would do it using `innerReducers`.

```js
const comments = createArrReducer(
  [],
  { 
    ADD_COMMENT: 'push',
    EDIT_COMMENT: 'updateIndex' 
  }
)

const post = createObjReducer(
  { user: 'bheberer', content: 'hey there', comments: [] }
  {
    EDIT_CONTENT: 'update'
  }, 
  { /* This is where customHandlers would go */ },
  {
    comments
  }
)
```
Here, we've created a completely separate reducer for the `comments` array, and piped it into the `post` reducer. This allows us to use all of the functionality that createArrReducer provides while keeping the array within a specified slice of state.

## API

All of the reducer creators barring createObjReducer 

### createValueReducer
```js
const reducer = createValueReducer(
  initialState: value,
  actionTypes: Object,
  customHandlers: Object
)
```
Higher order function that accepts an initialState value, an object of action types that the reducer will handle, and an object of custom handler functions.

The action types that createValueReducer handles by default are:
- update
- reset (to initialState)

Example usage:
```js
const counter = createValueReducer(
  0, 
  {
    INCREMENT: 'increment',
    DECREMENET: 'decrement',
    RESET: 'reset'
  }, 
  {
    increment: (state, action) => action.payload + 1,
    decrement: (state, action) => action.payload - 1
  }
)
```

### createBoolReducer
```js
const reducer = createBoolReducer(
  initialState: value,
  actionTypes: Object,
  customHandlers: Object
)
```
Higher order function that accepts an initialState value, an object of action types that the reducer will handle, and an object of custom handler functions.

The action types that createValueReducer handles by default are:
- true
- false
- toggle
- reset (to initialState)

Example usage:
```js
const isFetching = createBoolReducer(
  false,
  {
    FETCHING: 'true',
    RECEIVED: 'false'
  }
)
```

### createArrReducer
```js
const reducer = createArrReducer(
  initialState: value,
  actionTypes: Object,
  customHandlers: Object
)
```
Higher order function that accepts an initialState value, an object of action types that the reducer will handle, and an object of custom handler functions.

The action types that createValueReducer handles by default are:
- push
- pop
- updateIndex
- concat
- clear
- filter
- map
- reset (to initialState)

Example usage:
```js
const comments = createArrReducer(
  [],
  {
    ADD_COMMENT: 'push',
    DELETE_COMMENT: 'filter',
    EDIT_COMMENT: 'updateIndex',
    DELETE_ALL_COMMENTS: 'clear'
  }
)
```

### createObjReducer
```js
const reducer = createObjReducer(
  initialState: value,
  actionTypes: Object,
  customHandlers: Object,
  innerReducers: Object
)
```
Higher order function that accepts an initialState value, an object of action types that the reducer will handle, an object of custom handler functions and an object of reducers to be piped into the object.

The action types that createValueReducer handles by default are:
- update (spread)
- clear
- reset (to initialState)

Example usage:
```js
const comments = createArrReducer(
  [],
  {
    ADD_COMMENT: 'push',
    DELETE_COMMENT: 'filter',
    EDIT_COMMENT: 'updateIndex',
    DELETE_ALL_COMMENTS: 'clear'
  }
)

const post = createObjReducer(
  { 
    poster: 'bheberer', 
    content: 'first',
    comments: []
  },
  {
    UPDATE_OP_USERNAME: 'update',
    EDIT_CONTENT: 'update',
    DELETE: 'clear'
  },
  {},
  {
    comments
  }
)
```