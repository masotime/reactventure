import React from 'react';
import { Router, Route } from 'react-router';
import { App, Inbox, Message, About } from './defs'

export default (
	<Router>
		<Route path="/" component={App}>
			<Route path="about" component={About} />
			<Route path="inbox" component={Inbox}>
				<Route path="messages/:id" component={Message} />
			</Route>
		</Route>
	</Router>
);