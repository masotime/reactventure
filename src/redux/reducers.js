import { cloneDeep, /* remove */ } from 'lodash';

// a blank slate schema is as follows
const blank = {
	auth: {
		user: undefined,
		loggingIn: false,
		loggedIn: false,
		error: undefined
	},
	users: [],
	messages: [],
	posts: [],
	medias: []
};

// this reducer will deal with "urls"
const reducer = (state = blank, action) => {
	const newState = cloneDeep(state);
	const { auth } = newState;

	console.log('got an action',action);
	
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
				break;

			// TODO: how does this work in a universal context?
			case '/logout': 
				auth.loggingIn = false;
				switch (action.state) {
					case 'pending': auth.loggingIn = true; break; // this doesn't make sense
					case 'success': auth.user = undefined; auth.loggedIn = false; break;
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

				switch (action.state) {
					case 'pending': auth.loggingIn = true; break;
					case 'success': auth.user = action.body.name; auth.loggedIn = true; break;
					case 'failure': auth.error = action.error; break;
				}
				break;
		}
	}

	return newState;
};

export default reducer;

// this is really to KIV my previous work
/*
const removerReducer = (state = blank, action) => {
	const newState = cloneDeep(state);
	const removeUsingId = type => remove(newState[type], 'id', action.id);

	// let's just do deletion for now
	switch (action.type) {
		case 'DELETE_MESSAGE': removeUsingId('message'); break;
		case 'DELETE_POST': removeUsingId('post'); break;
		case 'DELETE_MEDIA': removeUsingId('media'); break;
	}

	return newState;
}
*/
