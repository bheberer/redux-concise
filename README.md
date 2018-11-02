# redux-func

## Introduction

This library was created with the intent of reducing the amount of boilerplate code needed to write Redux reducers. It is a collection of reducer creators, which are higher order functions that output a fully functional reducer. The reducer creators provided here help to create reducers for some of the most common use cases for different JavaScript data structures. This library is heavily inspired by [redux-data-structures](https://redux-data-structures.js.org/).

## Installation

This library is distrubuted on npm, and has no dependencies.

```
npm install --save redux-func
```

## Data Structures

redux-func contains reducer creators for the following data structures:

- Boolean
- Value
- Array
- Object

## Example

Let's create the reducers for the todo app written in the [Redux documentation](https://redux.js.org/basics/reducers) with redux-func so we can see how concise we can get our code to be.

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

This concision is achieved through some basic assumptions that the reducers make about the actions that they recieve. For the most part, they expect to recieve actions that follow the [Flux Standard Action](https://github.com/redux-utilities/flux-standard-action) rules, with one exception. Below are tables showing what fields are required for each default action in redux-func.

### Boolean Actions:

| Name   | Type | Payload | Index |
| ------ | :--: | :-----: | :---: |
| true   | yes  |   no    |  no   |
| false  | yes  |   no    |  no   |
| toggle | yes  |   no    |  no   |
| reset  | yes  |   no    |  no   |

### Value Actions:

| Name   | Type | Payload | Index |
| ------ | :--: | :-----: | :---: |
| update | yes  |   yes   |  no   |
| reset  | yes  |   no    |  no   |

### Array Actions:

| Name        | Type | Payload | Index |
| ----------- | :--: | :-----: | :---: |
| push        | yes  |   yes   |  no   |
| pop         | yes  |   no    |  no   |
| updateIndex | yes  |   yes   |  yes  |
| concat      | yes  |   yes   |  no   |
| clear       | yes  |   no    |  no   |
| filter      | yes  |   yes   |  no   |
| map         | yes  |   yes   |  no   |
| reset       | yes  |   no    |  no   |

### Object Actions:

| Name   | Type | Payload | Index |
| ------ | :--: | :-----: | :---: |
| update | yes  |   yes   |  no   |
| reset  | yes  |   no    |  no   |
| clear  | yes  |   no    |  no   |

Misc. Action Examples:

```js
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
const reducer = createArrReducer([], {
  ADD_TO_FRONT: 'addToFront'
}, {
  addToFront: (state, action) => [action.payload, ...state]
})
```

## Composition

Lets say we're trying to create a Twitter-like app. We might want to have a slice of state for a post that includes the user that create the post, the content of the post, as well as the comments associated with that post. Let's create this slice of state with our `createObjRedcuer` function. (Note that this wouldn't be an ideal way to shape this state. See the [redux docs](https://redux.js.org/recipes/structuringreducers/normalizingstateshape) for more info, just using this as an example)

```js
const post = createObjReducer({
  user: 'bheberer',
  content: 'hey there',
  comments: []
}, {
  EDIT_CONTENT: 'update',
  ADD_COMMENT: 'addComment',
  EDIT_COMMENT: 'editComment'
}, {
  addComment: (state, action) => {
    ...state,
    comments: [...state.comments, action.payload]
  },
  editComment: (state, action) => {
    ...state,
    comments: Object.assign([...state.comments], {
    [action.index]:
      typeof action.payload === 'function'
        ? action.payload(state.comments[action.index])
        : action.payload
  })
  }
})
```

Because our comments array is contained within this state object, we have to manually add functionality in order to update it appropriately, or include it in the action that we send to the reducer. However, you may have noticed that we're basically just adding `push` and `updateIndex` functionality, which is already included in `createArrReducer`.

In order to utilize this already built-in functionality, I've introduced the concept of `innerReducers` to `createObjReducer`. `innerReducers` is an extra argument for `createObjReducer` that lets you use compeletely separate reducers for certain properties within your output state object. Let's create the same slice of state using `innerReducers`.

```js
const comments = createArrReducer([], {
  ADD_COMMENT: 'push',
  EDIT_COMMENT: 'updateIndex'
})

const post = createObjReducer({
  user: 'bheberer',
  content: 'hey there',
  comments: []
}, {
  EDIT_CONTENT: 'update'
}, {
  /* This is where customHandlers would go */
}, {
  comments
})
```

Here, we've created a completely separate reducer for the comments array, and using the `innerReducers` argument, we're able to pipe it into the `post` reducer. Note that the reducer we're piping in has the same name as the property we're looking to control. Now we're able to utilize the functionality that createArrReducer provides, freeing us from having to write redundant code.

## API

### createValueReducer

```js
const reducer = createValueReducer(
  (initialState: value),
  (actionTypes: Object),
  (customHandlers: Object)
)
```

Higher order function that accepts an initialState value, an object of action types that the reducer will handle, and an object of custom handler functions.

### Default Action Handlers:

| Action | Description                                           |
| ------ | :---------------------------------------------------- |
| update | updates value with payload (can be value or function) |
| reset  | reset value to initial state                          |

Example usage:

```js
const counter = createValueReducer(0, {
  INCREMENT: 'increment',
  DECREMENT: 'decrement',
  RESET: 'reset'
}, {
  increment: (state, action) => action.payload + 1,
  decrement: (state, action) => action.payload - 1
})
```

### createBoolReducer

```js
const reducer = createBoolReducer(
  (initialState: value),
  (actionTypes: Object),
  (customHandlers: Object)
)
```

Higher order function that accepts an initialState value, an object of action types that the reducer will handle, and an object of custom handler functions.

### Default Action Handlers:

| Action | Description                    |
| ------ | :----------------------------- |
| true   | sets boolean to true           |
| false  | sets boolean to false          |
| toggle | toggles boolean value          |
| reset  | reset boolean to initial state |

Example usage:

```js
const isFetching = createBoolReducer(false, {
  FETCHING: 'true',
  RECEIVED: 'false'
})
```

### createArrReducer

```js
const reducer = createArrReducer(
  (initialState: value),
  (actionTypes: Object),
  (customHandlers: Object)
)
```

Higher order function that accepts an initialState value, an object of action types that the reducer will handle, and an object of custom handler functions.

### Default Action Handlers:

| Action      | Description                                                     |
| ----------- | :-------------------------------------------------------------- |
| push        | push payload to end of array                                    |
| pop         | remove element from end of array                                |
| updateIndex | update element at index with payload (can be value or function) |
| concat      | concatenate payload to end of array                             |
| clear       | clear array                                                     |
| filter      | filter array with payload function                              |
| map         | map array with payload function                                 |
| reset       | reset array to initial state                                    |

Example usage:

```js
const comments = createArrReducer([], {
  ADD_COMMENT: 'push',
  DELETE_COMMENT: 'filter',
  EDIT_COMMENT: 'updateIndex',
  DELETE_ALL_COMMENTS: 'clear'
})
```

### createObjReducer

```js
const reducer = createObjReducer(
  (initialState: value),
  (actionTypes: Object),
  (customHandlers: Object),
  (innerReducers: Object)
)
```

Higher order function that accepts an initialState value, an object of action types that the reducer will handle, an object of custom handler functions and an object of reducers to be piped into the object.

### Default Action Handlers:

| Action | Description                     |
| ------ | :------------------------------ |
| update | spreads payload to state object |
| clear  | empties state object            |
| reset  | reset object to initial state   |

Example usage:

```js
const comments = createArrReducer([], {
  ADD_COMMENT: 'push',
  DELETE_COMMENT: 'filter',
  EDIT_COMMENT: 'updateIndex',
  DELETE_ALL_COMMENTS: 'clear'
})

const post = createObjReducer({
  poster: 'bheberer',
  content: 'first',
  comments: []
}, {
  UPDATE_OP_USERNAME: 'update',
  EDIT_CONTENT: 'update',
  DELETE: 'clear'
}, {
  /* This is where customHandlers would go */
}, {
  comments
})
```
