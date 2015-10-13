import React from 'react'; // this is needed by the transpiler
import { Route, IndexRoute } from 'react-router';

// we only need pages for routes
import { About, Dashboard, Login, UsersPage, MessagesPage, MediasPage, PostsPage } from './pages';

// we also need a master "App" layout
import App from './app';

// this is a universal function. It _only_ checks for authentication
// it does not verify the token, if any. You cannot make data loading
// univesal because you cannot dump unauthorized data client-side, which
// is an obvious breach of security
const requireAuth = (nextState, replaceState) => {

}

export default (
	<Route path="/" component={App}>
		<IndexRoute component={Dashboard} />
		<Route path="dashboard" component={Dashboard} />
		<Route path="about" component={About} />
		<Route path="login" component={Login} />

		{/* These are protected routes */}
		<Route path="users" component={UsersPage} onEnter={requireAuth} />
		<Route path="messages" component={MessagesPage} onEnter={requireAuth} />
		<Route path="medias" component={MediasPage} onEnter={requireAuth} />
		<Route path="posts" component={PostsPage} onEnter={requireAuth} />
	</Route>
);

// KIV this stuff
/*
		<Route path="inbox" component={Inbox}>
			<Route path="/messages/:id" component={Message} /> 
			<Redirect from="messages/:id" to="/messages/:id" />
		</Route>
*/