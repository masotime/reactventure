/* global document, window */
// This is a client-side entry-point
// It can use the same React components as the server-side, but essentially
// this is the version that is loaded by the browser.

import React from 'react';

// the history nonsense is a pain
import { createHistory } from 'react-router/node_modules/history';
const history = createHistory(); // so this will be a client-side history

// this is the base react-router code
import { Router } from 'react-router';
import routes from './routes';
const routerFactory = () => <Router history={history}>{routes}</Router>;

// this is the reduxification code, assuming there is a 
// window.__INITIAL_STATE__ already defined.
import reducer from './redux/reducers';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
const initialized = (componentFactory, reducer, initialState) => {
	return (
		<Provider store={createStore(reducer, initialState)}>
			{ componentFactory }
		</Provider>
	);
};

// assuming it will magically work
React.render(initialized(routerFactory, reducer, window.__INITIAL_STATE__), document.body);