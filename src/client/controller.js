// another possible name is "routes.js"
// essentially we need to inject a client-side specific redux middleware that will 
// perform data / I/O operations based upon the simple actions that are dispatched by
// individual components.
//
// redux-thunk itself does nothing to help in this, since it just enables manual dispatch
// control. The actions sent from the React tier are identical, and a transformer must
// be defined to specify how to handle requests.
//
// to make things as "seamless" as possible, such actions will have a .url attribute
// that will match an express-route, and with a .method attribute.

// quick primer
// * store gives me access to the store to .getState()
// * next is really just dispatch, but to the next middleware
// * action is... the action that is passed to me either from
//   the top or the previous middleware
export default store => next => action => {

	if (action.url) {
		action.method = action.method || 'GET'; // default method

		// start by initiating - we will define an attribute "state" that
		// represents the state of the "request" - 'pending', 'success', 'error'
		action.state = 'pending';
		next(action);

		// we do "route matching next"
		// simplified here, should use express router eventually
		switch (action.url) {
			case '/login':
				const { name, password } = action.payload;
				// fake a login request
				console.log(`Mock login using ${name} / ${password} started...`);
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
		};

	} else {
		// passthrough, not a "url" action
		return next(action);
	}
};