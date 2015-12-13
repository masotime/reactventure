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

/* global fetch */
import es6promise from 'es6-promise';
import 'isomorphic-fetch';

es6promise.polyfill();

export default history => store => next => action => {

	// this is a middleware that executes xhr
	// requests and dispatches the response from
	// the server when it finally comes back.

	// if not a ROUTE, passthrough
	if (action.type !== 'ROUTE') {
		return next(action);
	}

	// as the action is essentially mimicking a HTTP request
	// we use similar HTTP status codes. Apparently, 102 means "processing"
	// TODO: Make an immutable clone
	action.status = 102;
	next(action);

	// we need to prepare a payload for the fetch method.
	const payload = {
		method: action.method || 'GET',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'X-Requested-With': 'XMLHttpRequest' // this guarantees req.xhr === true server-side
		},
		credentials: 'same-origin' // for cookies to be sent in the headers
	};

	// add JWT authentication headers.
	const state = store.getState();
	if (state.auth && state.auth.token) {
		payload.headers.Authorization = 'Bearer ' + state.auth.token;
	}


	if (!/^(GET|HEAD)$/.test(payload.method)) {
		// the body must be some weird Form object or a string. It cannot be a JSON object wtf.
		payload.body = JSON.stringify(action);
	}

	return fetch(action.url, payload).then(function(res) {
		if (res.status >= 400) {
			console.log(`[client] HTTP Error ${res.status}`);
			action.status = res.status;
			action.error = { message: `An unknown error occurred, status ${res.status}` };
			return next(action);
		}
		
		console.log('[client] retrieving and dispatching actions from server');
		res.json().then(actions => {
			// we now have an array of actions. each action
			// can populate the store, but the final action
			// must be route action that will mark the request
			// either as a success or failure
			let lastAction = actions.pop();

			actions.forEach(action => next(action));

			// massage the last action a little, depending on the
			// status code
			if (lastAction.status >= 400 && !lastAction.error) {
				lastAction.error = {
					message: 'An unknown error occurred, status code ' + lastAction.status
				};
			}

			// dispatch the last action
			// also, if the action has a redirect, then perform it
			next(lastAction);
			if (lastAction.status === 302 && lastAction.headers.location) {
				console.log(`[client] performing in-browser redirection to ${lastAction.headers.location}`);
				history.push(lastAction.headers.location); // history = react-router
			}
		});
	}).catch(function (err) {
		console.error(err);
	});

};