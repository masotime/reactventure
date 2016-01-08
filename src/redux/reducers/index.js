import { cloneDeep, get } from 'lodash';
import { combineReducers } from 'redux';

import fieldUpdate from './fieldUpdate';
import freshness from './freshness';
import auth from './auth';

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
	auth, freshness,
	loginform: populateReducerMaker('loginform', { username: '', password: ''}),
	content: populateReducerMaker('content'),
	users: populateReducerMaker('users', []),
	posts: populateReducerMaker('posts', []),
	medias: populateReducerMaker('medias', []),
	messages: populateReducerMaker('messages', [])
}

export default (state = {}, action) => {
	// we need to do the global reducer manually
	state = cloneDeep(fieldUpdate(state, action));
	return combineReducers(reducerMap)(state, action);
}