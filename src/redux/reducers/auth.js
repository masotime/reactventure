import { cloneDeep } from 'lodash';

const initialAuth = {
	user: undefined,
	loggedIn: false,
	error: undefined
}

export default (state = initialAuth, action) => {

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