import React from 'react'; // this is needed by the transpiler
import { Route, IndexRoute } from 'react-router';

// we only need pages for routes
import { About, Dashboard, Login, Logout, UsersPage, MessagesPage, MediasPage, PostsPage } from './pages';

// we also need a master "App" layout
import App from './app';

// this is for creating actions
import { GET } from './redux/actions';

export default store => {

	// i can't think of a clean way to decouple this from the store and dispatch
	const requireAuth = (nextState, replaceState) => {
		const { auth: { loggedIn }} = store.getState();

		/*if (!loggedIn) {
			console.log('[react-router] auth failed, redirecting to /login');
			replaceState(null, '/login');
		}*/
	}

	const logout = () => {
		const logoutAction = GET('/logout')({});
		store.dispatch(logoutAction); // ??? then what?
	}

	return (<Route path="/" component={App}>
		<IndexRoute component={Dashboard} />
		<Route path="dashboard" component={Dashboard} />
		<Route path="about" component={About} />
		<Route path="login" component={Login} />
		<Route path="logout" component={Logout} onEnter={logout} />

		{/* These are protected routes */}
		<Route path="users" component={UsersPage} onEnter={requireAuth} />
		<Route path="messages" component={MessagesPage} onEnter={requireAuth} />
		<Route path="medias" component={MediasPage} onEnter={requireAuth} />
		<Route path="posts" component={PostsPage} onEnter={requireAuth} />
	</Route>);

}

// KIV this stuff
/*
		<Route path="inbox" component={Inbox}>
			<Route path="/messages/:id" component={Message} /> 
			<Redirect from="messages/:id" to="/messages/:id" />
		</Route>
*/