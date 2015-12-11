import { cloneDeep, set, get } from 'lodash';
import { combineReducers } from 'redux';

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
		if (conditional(action, state) && get(action.body, path)) {
			return cloneDeep(get(action.body, path)) || state;
		} else {
			return state;
		}
	}
}

const reducerMap = {
	auth: authReducer,
	freshness: freshnessReducer,
	loginform: replacementReducerMaker('loginform', ({method, url, state}) => method === 'GET' && url === '/login' && state === 'success'),
	content: replacementReducerMaker('content', ({url, state}) => url === '/dashboard' && state === 'success'),
	users: replacementReducerMaker('users', ({method, url, state}) => method === 'GET' && ['/users', '/login'].indexOf(url) > -1 && state === 'success'),
	posts: replacementReducerMaker('posts', ({method, url, state}) => method === 'GET' && url === '/posts' && state === 'success'),
	medias: replacementReducerMaker('medias', ({method, url, state}) => method === 'GET' && url === '/medias' && state === 'success'),
	messages: replacementReducerMaker('messages', ({method, url, state}) => method === 'GET' && url === '/messages' && state === 'success')
}

export default function (state = {}, action) {
	state = cloneDeep(nonRouteAction(state, action));
	return combineReducers(reducerMap)(state, action);
}