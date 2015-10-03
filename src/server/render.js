// for server-side rendering
// taken from https://github.com/rackt/react-router/blob/master/docs/advanced/ServerRendering.md
import createLocation from 'react-router/node_modules/history/lib/createLocation';
import { RoutingContext, match } from 'react-router';
import React from 'react';

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
const reduxify = (componentMaker, store) => {
	return {
		component: <Provider store={store}>{componentMaker}</Provider>,
		state: store.getState()
	};
}

// note this is asynchronous callback-style
export default function render(routes, url, cb) {

	const location = createLocation(url);
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
			// it must be a factory because React 0.13 is stupid or Provider
			// is the epitome of a leaky abstraction
			const reactComponentFactory = () => <RoutingContext {...renderProps} />;

			// there is a horrible leaky abstraction that makes it impossible to stuff this
			// into a generic function.
			const store = createStore(reducer, serverSideInMemoryState);
			const reduxified = reduxify(reactComponentFactory, store);

			// do it!
			const output = React.renderToString(reduxified.component);
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