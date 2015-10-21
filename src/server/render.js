// for server-side rendering
// taken from https://github.com/rackt/react-router/blob/master/docs/advanced/ServerRendering.md
import { RoutingContext, match } from 'react-router';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

// redux imports
import { Provider } from 'react-redux';

// react-redux decorator
const reduxify = (component, store) => {
	return {
		component: <Provider store={store}>{component}</Provider>,
		state: store.getState()
	};
}

// this is just for prettification, it is completely optional
import { html_beautify } from 'js-beautify';
import { inspect } from 'util';
const log = (htmlOutput, state) => {
	console.log(html_beautify(htmlOutput));
	console.log(inspect(state, { depth: 1}));
}

// note this is asynchronous callback-style
// render requires a state. if not provided, then a default initial state is used.
export default function render({ routes, location, store}, cb) {

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
			const reduxified = reduxify(<RoutingContext {...renderProps} />, store);

			// do it!
			const output = ReactDOMServer.renderToString(reduxified.component);
			log(output, reduxified.state); // optional logging
			cb(null, {
				code: 200,
				output: output,
				state: reduxified.state
			});
		}
	};

	match({ routes, location }, handler);

}