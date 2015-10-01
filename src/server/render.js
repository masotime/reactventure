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
import getStore from '../redux/store';

// redux decoration
const reduxify = (component, store) => {
	return {
		component: <Provider store={store}>{() => component}</Provider>,
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
			const reactComponent = <RoutingContext {...renderProps} />;
			const store = getStore();
			const reduxified = reduxify(reactComponent, store);

			// do it!
			const output = React.renderToString(reduxified.component);
			console.log(html_beautify(output));
			console.log(inspect(reduxified.state, { depth: 1}));
			cb(null, {
				code: 200,
				output: React.renderToString(reduxified.component),
				state: reduxified.state
			});
		}
	};

	match({ routes, location }, handler);

}