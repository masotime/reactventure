// for server-side rendering
// taken from https://github.com/rackt/react-router/blob/master/docs/advanced/ServerRendering.md
import createLocation from 'react-router/node_modules/history/lib/createLocation';
import { RoutingContext, match } from 'react-router';
import React from 'react'

// note this is asynchronous callback-style
export default function render(routes, url, cb) {

	const location = createLocation(url);
	const handler = (err, redir, renderProps) => {

		if (renderProps) {
			renderProps.pineapple = 'red';
		}

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
			cb(null, {
				code: 200,
				output: React.renderToString(<RoutingContext {...renderProps} />)
			});
		}
	};

	match({ routes, location }, handler);

}