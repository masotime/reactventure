/* global document, window */

// load stuff like css
import './css/main.css';

// This is a client-side entry-point
// It can use the same React components as the server-side, but essentially
// this is the version that is loaded by the browser.
import React from 'react'; // still needed to createElement(s) as transpiled by Babel from JSX
import ReactDOM from 'react-dom';

// the history nonsense is a pain
import { createHistory } from 'react-router/node_modules/history';
const history = createHistory(); // so this will be a client-side history

// this is the base react-router code
import { Router } from 'react-router';
import routes from './routes';

// this is the reduxification code, assuming there is a 
// window.__INITIAL_STATE__ already defined.
import reducer from './redux/reducers';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
const initialized = (component, reducer, initialState) => {
	return (
		<Provider store={createStore(reducer, initialState)}>{ component }</Provider>
	);
};

// assuming it will magically work
ReactDOM.render(initialized(<Router history={history}>{routes}</Router>, reducer, window.__INITIAL_STATE__), document.getElementById('react-container'));