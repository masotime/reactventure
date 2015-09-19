// for server-side rendering
// taken from https://github.com/rackt/react-router/blob/master/docs/advanced/ServerRendering.md
import createLocation from 'react-router/node_modules/history/lib/createLocation';
import { RoutingContext, match } from 'react-router';
import React from 'react'

// note this is asynchronous callback-style
export default function render(routes, url, cb) {

	const location = createLocation(url);
	const handler = (err, redir, renderProps) => {
		if (redir) {
			return cb(null, '<Redirect to '+ redir.pathname + redir.search + '>');
		} else if (err) {
			return cb(err);
		} else if (renderProps == null) {
			return cb(new Error("404 Not found"));
		} else {
			cb(null, React.renderToString(<RoutingContext {...renderProps} />));
		}
	};

	match({ routes, location}, handler);

}