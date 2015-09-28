// This is a client-side entry-point
// It can use the same React components as the server-side, but essentially
// this is the version that is loaded by the browser.

import React from 'react';
import routes from './routes';
import { Router, RoutingContext, match } from 'react-router';

// the history nonsense is a pain
import { createHistory } from 'react-router/node_modules/history';
const history = createHistory(); // so this will be a client-side history

// assuming it will magically work
React.render(<Router history={history}>{routes}</Router>, document.body);
