import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';
import { App, Inbox, Message, About, Dashboard, Login } from './defs';

export default (
	<Route path="/" component={App}>
		<IndexRoute component={Dashboard} />
		<Route path="about" component={About} />
		<Route path="login" component={Login} />
		<Route path="inbox" component={Inbox}>
			<Route path="/messages/:id" component={Message} /> {/* notice the path is absolute... */}
			<Redirect from="messages/:id" to="/messages/:id" /> {/* relative paths redirect to the absolute path above */}
		</Route>
	</Route>
);