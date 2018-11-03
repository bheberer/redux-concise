# redux-concise

## Introduction

This library was created with the intent of reducing the amount of boilerplate code needed to write Redux reducers. It is a collection of reducer creators, which are higher order functions that output a fully functional reducer. The reducer creators provided here help to create reducers for some of the most common use cases for different JavaScript data structures. This library is heavily inspired by [redux-data-structures](https://redux-data-structures.js.org/).

## Installation

This library is distrubuted on npm, and has no dependencies.

```
npm install --save redux-concise
```

## Data Structures

redux-concise contains reducer creators for the following data structures:

- Boolean
- Value
- Array
- Object

## Example

Let's create the reducers for the todo app written in the [Redux documentation](https://redux.js.org/basics/reducers) with redux-concise so we can see how concise we can get our code to be.

```js
import { 
  createValReducer, 
  createArrReducer
} from 'redux-concise'

const visibilityFilter = createValReducer(SHOW_ALL, {
  SET_VISIBILITY_FILTER: 'update'
})

const todos = createArrReducer([], {
  ADD_TODO: 'push',
  TOGGLE_TODO: 'updateIndex'
})
```

Let's break this down. In this example, both reducer creators are taking two arguments. The first is simply the initialState. The second argument is an object that maps action types to handler functions that return the next state. These functions are built in to the reducer creators, and are therefore referred to as default handlers. 

You can either use raw strings in order to assign these handler functions to the appropriate action type, or you can import the built in `HandlerTypes` object from `redux-concise`, which already includes strings for all of the default handlers. From now on, we're going to be sticking with using `HandlerTypes`, because it gives us the autocomplete and makes it harder to make silly typos.

## Actions

This concision is possible because of the basic assumptions that the default handlers make about the actions that the output reducer will receive. For the most part, they expect to recieve actions that follow the [Flux Standard Action](https://github.com/redux-utilities/flux-standard-action) rules, with one exception.

Below are tables showing what actions are handled by default for each reducer creator and what needs to be included in each action.

### Boolean Actions:

| Handler Name   | Type | Payload | Index |
| -------------- | :--: | :-----: | :---: |
| true           | yes  |   no    |  no   |
| false          | yes  |   no    |  no   |
| toggle         | yes  |   no    |  no   |
| reset          | yes  |   no    |  no   |

### Value Actions:

| Handler Name   | Type | Payload | Index |
| -------------- | :--: | :-----: | :---: |
| update         | yes  |   yes   |  no   |
| reset          | yes  |   no    |  no   |

### Array Actions:

| Handler Name        | Type | Payload | Index |
| ------------------- | :--: | :-----: | :---: |
| push                | yes  |   yes   |  no   |
| pop                 | yes  |   no    |  no   |
| updateIndex         | yes  |   yes   |  yes  |
| concat              | yes  |   yes   |  no   |
| clear               | yes  |   no    |  no   |
| filter              | yes  |   yes   |  no   |
| map                 | yes  |   yes   |  no   |
| reset               | yes  |   no    |  no   |

### Object Actions:

| Handler Name   | Type | Payload | Index |
| -------------- | :--: | :-----: | :---: |
| update         | yes  |   yes   |  no   |
| reset          | yes  |   no    |  no   |
| clear          | yes  |   no    |  no   |

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

While I've tried my best to include a lot of the most common use cases in redux-concise, there's more than likely going to be times where redux-concise doesn't include an action that you want to use. Because of this, I've included an extra parameter to all redux-concise reducers called `customHandlers`, which is an object in which you can include whatever custom action handler functions you want and use them in the same way you would use the standard, included handlers.

As an example, the standard `push` handler in redux-concise adds a value to the back of an array. Now, you want to add something to the front of the array instead. Here's how you would do it.

```js
import { 
  createArrReducer, 
  HandlerTypes 
} from 'redux-concise'

ArrHandlerTypes = {
  ...HandlerTypes,
  addToFront: 'addToFront'
}

const reducer = createArrReducer([], {
  ADD_TO_FRONT: ArrHandlerTypes.addToFront
}, {
  addToFront: (state, action) => [action.payload, ...state]
})
```

## Composition

Lets say we're trying to create a Twitter-like app. We might want to have a slice of state for a post that includes the user that create the post, the content of the post, as well as the comments associated with that post. Let's create this slice of state with our `createObjRedcuer` function. (Note that this wouldn't be an ideal way to shape this state. See the [redux docs](https://redux.js.org/recipes/structuringreducers/normalizingstateshape) for more info, just using this as an example)

```js
import { 
  createObjReducer, 
  HandlerTypes 
} from 'redux-concise'

const PostHandlerTypes = { 
  ...HandlerTypes, 
  addComment: 'addComment', 
  editComment: 'editComment
}

const post = createObjReducer({
  user: 'bheberer',
  content: 'hey there',
  comments: []
}, {
  EDIT_CONTENT: PostHandlerTypes.update,
  ADD_COMMENT: PostHandlerTypes.addComment,
  EDIT_COMMENT: PostHandlerTypes.editComment
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
import { 
  createArrReducer,
  createObjReducer, 
  HandlerTypes 
} from 'redux-concise'

const comments = createArrReducer([], {
  ADD_COMMENT: HandlerTypes.push,
  EDIT_COMMENT: HandlerTypes.updateIndex
})

const post = createObjReducer({
  user: 'bheberer',
  content: 'hey there',
  comments: []
}, {
  EDIT_CONTENT: HandlerTypes.update
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

| Name   | Description                                           |
| ------ | :---------------------------------------------------- |
| update | updates value with payload (can be value or function) |
| reset  | reset value to initial state                          |

Example usage:

```js
import { 
  createValueReducer,
  HandlerTypes 
} from 'redux-concise'

const CounterHandlerTypes = { 
  ...HandlerTypes,
   increment: 'increment', 
   decrement: 'decrement' 
}

const counter = createValueReducer(0, {
  INCREMENT: CounterHandlerTypes.increment,
  DECREMENT: CounterHandlerTypes.decrement,
  RESET: CounterHandlerTypes.reset
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

| Name   | Description                    |
| ------ | :----------------------------- |
| true   | sets boolean to true           |
| false  | sets boolean to false          |
| toggle | toggles boolean value          |
| reset  | reset boolean to initial state |

Example usage:

```js
import { 
  createBoolReducer,
  HandlerTypes 
} from 'redux-concise'

const isFetching = createBoolReducer(false, {
  FETCHING: HandlerTypes.true,
  RECEIVED: HandlerTypes.false
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

| Name        | Description                                                     |
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
import {
  createArrReducer,
  HandlerTypes
} from 'redux-concise'

const comments = createArrReducer([], {
  ADD_COMMENT: HandlerTypes.push,
  DELETE_COMMENT: HandlerTypes.filter,
  EDIT_COMMENT: HandlerTypes.updateIndex,
  DELETE_ALL_COMMENTS: HandlerTypes.clear
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

| Name   | Description                     |
| ------ | :------------------------------ |
| update | spreads payload to state object |
| clear  | empties state object            |
| reset  | reset object to initial state   |

Example usage:

```js
import { 
  createArrReducer,
  createObjReducer, 
  HandlerTypes 
} from 'redux-concise'

const comments = createArrReducer([], {
  ADD_COMMENT: HandlerTypes.push,
  DELETE_COMMENT: HandlerTypes.filter,
  EDIT_COMMENT: HandlerTypes.updateIndex,
  DELETE_ALL_COMMENTS: HandlerTypes.clear
})

const post = createObjReducer({
  poster: 'bheberer',
  content: 'first',
  comments: []
}, {
  UPDATE_OP_USERNAME: HandlerTypes.update,
  EDIT_CONTENT: HandlerTypes.update,
  DELETE: HandlerTypes.clear
}, {
  /* This is where customHandlers would go */
}, {
  comments
})
```
