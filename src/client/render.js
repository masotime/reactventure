/* global document */
// for client-side rendering
import { Router } from 'react-router';
import React from 'react'; // still needed to createElement(s) as transpiled by Babel from JSX
import ReactDOM from 'react-dom';

// redux imports
import { Provider } from 'react-redux';

// react-redux decorator
const reduxify = (component, store) => {
	return {
		component: <Provider store={store}>{component}</Provider>,
		state: store.getState()
	};
}

// the history nonsense is a pain
import { createHistory } from 'react-router/node_modules/history';
const history = createHistory(); // so this will be a client-side history

export default function render({ routes, location, store }, cb) {

	// prepare
	const reduxified = reduxify(<Router history={history}>{routes}</Router>, store); // in contrast to <RoutingContext> server-side

	// assuming it will magically work
	ReactDOM.render(reduxified.component, document.getElementById('react-container'));
	cb(null);

}