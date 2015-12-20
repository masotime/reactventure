// this file provides redux-specific functionality
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import React from 'react'; // needed for JSX compilation

export default {
	reduxify: (component, store) => <Provider store={store}>{component}</Provider>,
	createStore: ({ reducer, initialState }, ...middlewares) => applyMiddleware(...middlewares)(createStore)(reducer, initialState)
}