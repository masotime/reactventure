// create a store with supplied middleware, reducer and initial state
import { applyMiddleware, createStore } from 'redux';

// this function takes a reducer and a set of middlewares (presumably invariant during app runtime)
// and returns a function that takes an initial state and returns a store.
const storeMaker = (reducer, ...middlewares) => state => applyMiddleware(...middlewares)(createStore)(reducer, state);

export default storeMaker;