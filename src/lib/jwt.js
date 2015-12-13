// does all the JSON web tokens stuff. Taken from https://auth0.com/blog/2015/09/28/5-steps-to-add-modern-authentication-to-legacy-apps-using-jwts/
// Notes: 
// 1. You need to add cookies manually to the express middleware stack.
// 2. Be aware of the magical string "id_token"
// import jwtExpress from 'express-jwt';
import jwt from 'jsonwebtoken';
import keys from './keys';
import { find } from 'lodash';

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

const logout = (res) => {
	res.clearCookie(COOKIE_KEY);
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

const auth = (user, password) => {
	// we ignore the password
	console.log(`auth on ${user} / ${password} auto-success`);

	// returns the id of the user
	// i should have used a proper db. this is messy
	const userObj = find(users(), { username: user });
	return userObj;
}

export default {
	authActionMiddleware, addTokenCookie, authSync, logout, checkToken, generate, auth
};