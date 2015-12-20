/* global document */
// for client-side rendering
import { Router } from 'react-router';
import React from 'react'; // still needed to createElement(s) as transpiled by Babel from JSX
import ReactDOM from 'react-dom';

// redux imports
import { reduxify } from '../universal/redux';

// [async callback function]
// input: { routes (react-router routes), history (history object), store (redux) }
// callback: { } // react renders to DOM
export default function render({ routes, history, store }, cb) {
	// assuming it will magically work
	ReactDOM.render(
		reduxify(<Router history={history}>{routes}</Router>, store),
		document.getElementById('react-container')
	);
	cb(null);
}