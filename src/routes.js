import React from 'react';
import { Router, Route, IndexRoute, Redirect } from 'react-router';
import { App, Inbox, Message, About, Dashboard } from './defs'

export default (
	<Router>
		<Route path="/" component={App}>
			<IndexRoute component={Dashboard} />
			<Route path="about" component={About} />
			<Route path="inbox" component={Inbox}>
				<Route path="/messages/:id" component={Message} /> {/* notice the path is absolute... */}
				<Redirect from="messages/:id" to="/messages/:id" /> {/* relative paths redirect to the absolute path above */}
			</Route>
		</Route>
	</Router>
);