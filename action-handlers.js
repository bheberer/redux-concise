export const push = (state, action) => [
  ...state, 
  action.payload
];

export const pop = (state, action) => state.slice(0, -1);

export const concat = (state, action) => [
  ...state, 
  ...action.payload
];

export const clear = (state, action) => [];

export const filter = (state, action) => 
  state.filter(element =>
    action.filter(element, action)
  );

export const map = (state, action) => 
  state.map(element => 
    action.map(element, action)
  );

export const toggle = (state) => state === false;

export const overrideObjectProps = (state, action) => ({
  ...state,
  ...action.payload
});

export const overrideStateProp = (action) => action.payload;

export const resetState = (initialState) => initialState;