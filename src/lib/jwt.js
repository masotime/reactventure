// does all the JSON web tokens stuff. Taken from https://auth0.com/blog/2015/09/28/5-steps-to-add-modern-authentication-to-legacy-apps-using-jwts/
// Notes: 
// 1. You need to add cookies manually to the express middleware stack.
// 2. Be aware of the magical string "id_token"
// import jwtExpress from 'express-jwt';
import jwt from 'jsonwebtoken';
import keys from './keys';
import { find } from 'lodash';

// Don't want to use this for now
/*
const authMiddleware = jwtExpress({
	secret: new Buffer(keys.CLIENT_SECRET, 'base64'),
	audience: keys.CLIENT_ID,
	// Custom function to retrieve the JWT - look for it in header, then look in cookie
	getToken: function fromHeaderOrCookie(req) {
		const hasAuthorizationHeader = !!req.headers.authorization;
		const headerParts = hasAuthorizationHeader && req.headers.authorization.split(' ');
		if (hasAuthorizationHeader && headerParts[0] === 'Bearer') {
			return headerParts[1];
		} else {
			return req.cookies.id_token;
		}
		return null;
	}
});
*/

const COOKIE_KEY = 'id_token';

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
// 1. verify that the cookie's claims are correc
// 2. transfer that information into the action's headers
//
// this will allow the reducers to add this information to
// the store, server side (via server-actions) and client-side
// (via state hydration)
//
// in addition, this is consistent with the client-side logic of always
// including the Authorization Bearer request header if the user is logged in
// which it can only do if the client-side state is hydrated with auth information
const maybeAddAuth = (req, action = {}) => {
	const token = getToken(req);

	if (token) {
		const user = checkToken(token);

		if (user) {
			console.log(`adding auth information to action headers`);
			action.headers = action.headers || {};
			action.headers.token = generate({ user_id: user.id });
			action.headers.name = user.username;
		}
	}

	return action;
}

const logout = (res, action) => {
	res.clearCookie(COOKIE_KEY);
	if (action && action.headers) {
		delete action.headers.token;
		delete action.headers.user;
	}
	return action;
}

// this is a convenience function that will add a response cookie
// note that it doesn't enforce the secure flag, so the cookie
// can still be sent over HTTP (an obvious security issue)
const addTokenCookie = (res, payload) => {
	const token = generate(payload);
	res.cookie(COOKIE_KEY, token, { httpOnly: true });
}

const generate = (payload) => {
	return jwt.sign(payload, keys.CLIENT_SECRET, {
		algorithm: 'HS256', // symmetric for an easier life
		expiresIn: '1h',
		audience: keys.CLIENT_ID,
		issuer: keys.ISSUER
	});
}

import { users } from './service';
const checkToken = (token) => {
	// prove (or otherwise) that the token contains
	// an encrypted version of the specified user,
	// and that said user exists in the database
	let decoded;
	try {
		decoded = jwt.verify(token, keys.CLIENT_SECRET);
	} catch (e) {
		return false;
	}

	// once decoded, we ASSUME (TODO!) that it has a user_id property
	return find(users(), { id: decoded.user_id });
}

import { applyState } from '../redux/actions';

const authActionMiddleware = (req, res, next) => {
	const token = getToken(req); 
	console.log(`Verifying ${token}`);

	const authenticatedUser = checkToken(token);

	if (authenticatedUser) {
		console.log(`Successfully verified user ${authenticatedUser.username}`);
		maybeAddAuth(req, authenticatedUser);
		next();
	} else {
		console.log(`Authentication failed, redirecting to /login`);
		const action = applyState('failure')(req.action);
		action.body.originalUrl = req.originalUrl;
		res.actionRedirect(action, '/login');
	}
}

// synchronous? asynchronous? to A or not to A.
const auth = (user, password) => {
	// we ignore the password
	console.log(`auth on ${user} / ${password} auto-success`);

	// returns the id of the user
	// i should have used a proper db. this is messy
	const userObj = find(users(), { username: user });
	return userObj;
}

export default {
	authActionMiddleware, addTokenCookie, maybeAddAuth, logout, checkToken, generate, auth
};