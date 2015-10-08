// for server-side rendering
// taken from https://github.com/rackt/react-router/blob/master/docs/advanced/ServerRendering.md
import { RoutingContext, match } from 'react-router';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

// this is just for prettification
import { html_beautify } from 'js-beautify';
import { inspect } from 'util';

// redux imports
import { Provider } from 'react-redux';
import { createStore } from 'redux';

// app specific redux-related imports
import reducer from '../redux/reducers';
import getDb from '../lib/db';

// define an initial in-memory database
// this itself is mutable
const serverSideInMemoryState = getDb();

// react-redux decorator
const reduxify = (component, store) => {
	return {
		component: <Provider store={store}>{component}</Provider>,
		state: store.getState()
	};
}

// note this is asynchronous callback-style
export default function render(routes, location, cb) {

	const handler = (err, redir, renderProps) => {

		if (err) {
			return cb(err);
		} else if (redir) {
			return cb(null, {
				code: 302,
				url: redir.pathname + redir.search
			});
		} else if (renderProps == null) {
			return cb(null, {
				code: 404
			});
		} else {
			// prepare
			const store = createStore(reducer, serverSideInMemoryState);
			const reduxified = reduxify(<RoutingContext {...renderProps} />, store);

			// do it!
			const output = ReactDOMServer.renderToString(reduxified.component);
			console.log(html_beautify(output));
			console.log(inspect(reduxified.state, { depth: 1}));
			cb(null, {
				code: 200,
				output: output,
				state: reduxified.state
			});
		}
	};

	match({ routes, location }, handler);

}