// Provides JWT related middleware.
// Reference: https://auth0.com/blog/2015/09/28/5-steps-to-add-modern-authentication-to-legacy-apps-using-jwts/
import { generate, checkToken } from '../security';
import { COOKIE_KEY } from '../keys';

// the token is retrieved either from Header or Cookie
// technically the cookie is also in the header, but that's sent
// by the browser. the Authorization / Bearer needs to be sent
// programmatically via client-side JavaScript
const getToken = req => {
	const hasAuthorizationHeader = !!req.headers.authorization;
	const headerParts = hasAuthorizationHeader && req.headers.authorization.split(' ');
	if (hasAuthorizationHeader && headerParts[0] === 'Bearer') {
		console.log('Using token from authorization header');
		return headerParts[1];
	} else {
		console.log('Using token from cookie');
		return req.cookies[COOKIE_KEY];
	}
	return null;
}

// if an action doesn't have auth header information, but
// cookies do,
// 1. verify that the cookie's claims are correct
// 2. dispatch an authentication action
const authSync = (req, res, next) => {
	const token = getToken(req);
	const hasAuthorizationHeader = !!req.headers.authorization;

	if (token && !hasAuthorizationHeader) {
		const user = checkToken(token);

		if (user) {
			console.log(`transferring auth from cookie to store`);
			res.dispatch({
				type: 'AUTHENTICATE',
				token: generate({ user_id: user.id }),
				name: user.username
			});
		}
	}

	next();
}

const authActionMiddleware = (req, res, next) => {
	const token = getToken(req); 
	console.log(`Verifying ${token}`);

	const authenticatedUser = checkToken(token);

	if (authenticatedUser) {
		console.log(`Successfully verified user ${authenticatedUser.username}`);
		next();
	} else {
		console.log(`Authentication failed, redirecting to /login`);
		res.dispatch({
			type: 'ACCESS_ATTEMPT',
			url: req.originalUrl
		});

		res.universalRedirect('/login');
	}
}

export default {
	authActionMiddleware, authSync
};