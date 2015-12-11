import { cloneDeep, set, get } from 'lodash';
import { combineReducers } from 'redux';

// a blank slate schema is as follows
const blank = {
	auth: {
		user: undefined,
		loggingIn: false,
		loggedIn: false,
		error: undefined
	}
};

const initialAuth = {
	user: undefined,
	loggingIn: false,
	loggedIn: false,
	error: undefined
}

// TODO: Refactor!!!!
const nonRouteAction = (state, action) => {
	if (action.type === 'FIELD_UPDATE') {
		const path = action.path;
		const value = action.value;
		return set(state, path, value);
	}

	return state;
};

// auth reducer
const authReducer = (state = initialAuth, action) => {

	const auth = cloneDeep(state);
	auth.loggingIn = false;

	// if any action contains .headers.token, then we transfer that information
	// (token, username) into the state. This means we don't have to handle
	// POST /login separately.
	if (action && action.headers && action.headers.token) {
		console.log('transferring auth information from action header to state');
		auth.token = action.headers.token;
		auth.user = action.headers.name;
		auth.loggedIn = true;
	}

	if (action.method === 'GET' && action.url === '/logout') {
		switch (action.state) {
			case 'pending': break;
			case 'success': delete auth.token; auth.user = undefined; auth.loggedIn = false; break;
			case 'failure': auth.error = action.error; break;
		}

	}

	if (action.method === 'POST' && action.url === '/login') {
		// success case applies for any route
		switch (action.state) {
			case 'pending': auth.loggingIn = true; break;
			case 'failure': auth.error = action.error; break;
		}
	}

	return auth;

}

// freshness reducer
const freshnessReducer = (state = {}, action) => {

	const freshness = cloneDeep(state);

	// we track the "freshness" of the retrieved data
	if (action.method === 'GET') { // TODO: may not always be a GET
		const url = action.url;
		const timestamp = (new Date()).getTime();
		freshness[url] = freshness[url] || {};

		switch (action.state) {
			case 'pending':
				console.log(`setting freshness[${url}] to pending`);
				freshness[url].state = 'pending';
				break;

			case 'failure': 
				console.log(`setting freshness[${url}] to failure`);
				freshness[url].state = 'failure';
				freshness[url].timestamp = timestamp;
				break; // what do i do?

			case 'success': 
				console.log(`setting freshness[${url}] to success`);
				freshness[url].state = 'success';
				freshness[url].timestamp = timestamp;
				break;
		}
	}

	return freshness;

}

const replacementReducerMaker = (path, conditional = () => true) => {
	return (state = {}, action) => {
		if (conditional(action, state) && get(action, path)) {
			return cloneDeep(get(action, path));
		}
	}
}

const contentReducer = (state = {}, action) => {

	let content;

	switch (action.url) {
		case '/dashboard':
			if (action.state === 'success') {
				content = cloneDeep(action.body && action.body.content || {});
			}
	}

	return content;
}

const usersReducer = (state = {}, action) => {

}

// this reducer will deal with "urls"
const reducer = (state = blank, action) => {
	console.log('got an action', action);
	const newState = cloneDeep(nonRouteAction(state, action)); // TODO: REFACTOR!!!!
	const { auth } = newState;

	// if any action contains .headers.token, then we transfer that information
	// (token, username) into the state. This means we don't have to handle
	// POST /login separately.
	if (action && action.headers && action.headers.token) {
		console.log('transferring auth information from action header to state');
		auth.token = action.headers.token;
		auth.user = action.headers.name;
		auth.loggedIn = true;
	}

	// we track the "freshness" of the retrieved data
	if (action.method === 'GET') { // TODO: may not always be a GET
		const freshness = newState.freshness = newState.freshness || {};
		const url = action.url;
		const timestamp = (new Date()).getTime();
		freshness[url] = freshness[url] || {};

		switch (action.state) {
			case 'pending':
				console.log(`setting freshness[${url}] to pending`);
				freshness[url].state = 'pending';
				break;

			case 'failure': 
				console.log(`setting freshness[${url}] to failure`);
				freshness[url].state = 'failure';
				freshness[url].timestamp = timestamp;
				break; // what do i do?

			case 'success': 
				console.log(`setting freshness[${url}] to success`);
				freshness[url].state = 'success';
				freshness[url].timestamp = timestamp;
				break;
		}
	}
	
	// depending on the method, we deal with it differently
	if (action.method === 'GET') {
		console.log('Dealing with a GET reduction');
		switch (action.url) {
			// "content" routes
			case '/about':
			case '/dashboard':
				switch (action.state) {
					case 'pending': newState.content = {}; break;
					case 'failure': newState.content = {}; break;

					// content for now
					case 'success': newState.content = action.body && action.body.content; break;
				}
				break;

			case '/login': 
				// TODO: This is problematic, is there a better way of doing this???
				newState.users = action.body.users;
				newState.loginform = action.body.loginform;
				break;

			case '/users': newState.users = action.body.users; break;
			case '/posts': newState.posts = action.body.posts; break;
			case '/medias': newState.medias = action.body.medias; break;
			case '/messages': newState.messages = action.body.messages; break;

			// TODO: how does this work in a universal context?
			case '/logout': 
				auth.loggingIn = false;
				switch (action.state) {
					case 'pending': auth.loggingIn = true; break; // this doesn't make sense
					case 'success': delete auth.token; auth.user = undefined; auth.loggedIn = false; break;
					case 'failure': auth.error = action.error; break;
				}
				break;

		}
	} else if (action.method === 'POST') {
		console.log('Dealing with a POST reduction');
		switch (action.url) {

			// login transitional and final states
			case '/login': 
				auth.loggingIn = false;

				// success case applies for any route
				switch (action.state) {
					case 'pending': auth.loggingIn = true; break;
					case 'failure': auth.error = action.error; break;
				}
				break;
		}
	}

	return newState;
};

export default reducer;