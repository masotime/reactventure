import React from 'react'; // this is needed by the transpiler
import { Route, IndexRoute } from 'react-router';

// we only need pages for routes
import { About, Dashboard, Login, Logout, Users, Messages, Medias, Posts } from './pages/index';

// we also need a master "App" layout
import Main from './main';

export default (
	<Route path="/" component={Main}>
		<IndexRoute component={Dashboard} />
		<Route path="dashboard" component={Dashboard} />
		<Route path="about" component={About} />
		<Route path="login" component={Login} />
		<Route path="logout" component={Logout} />

		{/* These are protected routes */}
		<Route path="users" component={Users} />
		<Route path="messages" component={Messages} />
		<Route path="medias" component={Medias} />
		<Route path="posts" component={Posts} />
	</Route>
);