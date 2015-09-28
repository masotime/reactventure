// This is a client-side entry-point
// It can use the same React components as the server-side, but essentially
// this is the version that is loaded by the browser.

import React from 'react';
import routes from './routes';
import { RoutingContext, match } from 'react-router';

// the history nonsense is a pain
import { createHistory } from 'react-router/node_modules/history';
const history = createHistory(); // so this will be a client-side history

// voodoo i don't understand
const location = { 
	pathname: window.location.pathname || '/',
	search: window.location.search || '',
	hash: window.location.hash || '',
	state: window.location.state || null,
	action: window.location.action || 'POP',
	key: window.location.key || null
};

// assuming it will magically work
match({
	routes,
	history,
	location
}, (err, redir, renderProps) => {
	React.render(<RoutingContext {...renderProps} />, document.body);
});