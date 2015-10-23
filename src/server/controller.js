// this is the server-side variation of the "controllers"
// in practice, servers can call libraries directly in code to fetch data,
// as opposed to client-side where the network call / handshake / authentication
// needs to take place

// quick primer
// * store gives me access to the store to .getState()
// * next is really just dispatch, but to the next middleware
// * action is... the action that is passed to me either from
//   the top or the previous middleware
export default store => next => action => {

	if (action.type === 'ROUTE') {
		action.method = action.method || 'GET'; // default method

		// here we ignore setting a state of pending. Such a state would
		// only be meaningful if we immediately render such a state. The client
		// side would then have to poll for a change in state.
		switch (action.url) {
			case '/login':
				const { name, password } = action.payload;
				console.log(`Server autologin using ${name} / ${password}...`);
				return setTimeout(() => {
					action.state = 'success';
					next(action);
				}, 1000);

			case '/logout':
				action.state = 'success';
				return next(action);

			default:
				action.state = 'error';
				action.error = new Error(['404 NOT FOUND', action.url].join('/'));
				return next(action);
		}

	} else {
		// passthrough, not a "url" action
		return next(action);
	}
};