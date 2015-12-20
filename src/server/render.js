// for server-side rendering
// taken from https://github.com/rackt/react-router/blob/master/docs/advanced/ServerRendering.md
import { RoutingContext, match } from 'react-router';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { reduxify } from '../universal/redux';

import { log } from '../lib/extras';

// [async callback function]
// input: { routes (react-router routes), location (url), store (redux) }
// callback: { code (http status), url (for redirects), output (html), state (store) }
export default function render({ routes, location, store }, cb) {
	match({ routes, location }, (err, redir, renderProps) => {

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
			// do it!
			const output = ReactDOMServer.renderToString(reduxify(<RoutingContext {...renderProps} />, store));
			const state = store.getState();

			log(output, state); // optional logging
			cb(null, {
				code: 200,
				output: output,
				state: state
			});
		}
	});
}