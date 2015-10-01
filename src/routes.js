import React from 'react'; // this is needed by the transpiler
import { Route, IndexRoute } from 'react-router';

// we only need pages for routes
import { About, Dashboard, Login, UsersPage, MessagesPage, MediasPage, PostsPage } from './pages';

// we also need a master "App" layout
import App from './app';

export default (
	<Route path="/" component={App}>
		<IndexRoute component={Dashboard} />
		<Route path="dashboard" component={Dashboard} />
		<Route path="about" component={About} />
		<Route path="login" component={Login} />
		<Route path="users" component={UsersPage} />
		<Route path="messages" component={MessagesPage} />
		<Route path="medias" component={MediasPage} />
		<Route path="posts" component={PostsPage} />
	</Route>
);

// KIV this stuff
/*
		<Route path="inbox" component={Inbox}>
			<Route path="/messages/:id" component={Message} /> 
			<Redirect from="messages/:id" to="/messages/:id" />
		</Route>
*/