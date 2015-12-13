import { cloneDeep, set, get } from 'lodash';
import { combineReducers } from 'redux';

const initialAuth = {
	user: undefined,
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

	switch (action.type) {
		case 'AUTHENTICATE':
			auth.token = action.token;
			auth.user = action.name;
			auth.loggedIn = true;
			break;
		case 'LOGOUT':
			delete auth.token;
			auth.user = undefined;
			auth.loggedIn = false;
			break;
		case 'AUTHENTICATE_FAILURE':
			auth.error = action.error;
			break;
		case 'ROUTE':
			if (action.method === 'POST' &&
					action.url === '/login' &&
					action.state === 'pending') {
				auth.loggingIn = true;
			}
			break;
	}

	return auth;

}

// freshness reducer
const freshnessReducer = (state = {}, action) => {

	// only applies for route actions
	if (action.type !== 'ROUTE' || action.method !== 'GET') { // TODO: may not always be a GET
		return state;
	}

	const freshness = cloneDeep(state);

	// we track the "freshness" of the retrieved data
	const url = action.url;
	const timestamp = (new Date()).getTime();
	freshness[url] = freshness[url] || {};

	switch (action.status) {
		case 102:
			console.log(`setting freshness[${url}] to pending`);
			freshness[url].state = 'pending';
			break;

		case 500: 
			console.log(`setting freshness[${url}] to failure`);
			freshness[url].state = 'failure';
			freshness[url].timestamp = timestamp;
			break; // what do i do?

		case 200: 
			console.log(`setting freshness[${url}] to success`);
			freshness[url].state = 'success';
			freshness[url].timestamp = timestamp;
			break;
	}

	return freshness;

}

const populateReducerMaker = (path, initial = {}) => {
	return (state = initial, action) => {

		switch(action.type) {
			case 'POPULATE':
				state = cloneDeep(get(action, path)) || state;
				break;
		}

		return state;
	}
}

const reducerMap = {
	auth: authReducer,
	freshness: freshnessReducer,
	loginform: populateReducerMaker('loginform', { username: '', password: ''}),
	content: populateReducerMaker('content'),
	users: populateReducerMaker('users', []),
	posts: populateReducerMaker('posts', []),
	medias: populateReducerMaker('medias', []),
	messages: populateReducerMaker('messages', [])
}

export default function (state = {}, action) {
	state = cloneDeep(nonRouteAction(state, action));
	return combineReducers(reducerMap)(state, action);
}