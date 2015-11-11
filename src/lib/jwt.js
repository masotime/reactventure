// does all the JSON web tokens stuff. Taken from https://auth0.com/blog/2015/09/28/5-steps-to-add-modern-authentication-to-legacy-apps-using-jwts/
// Notes: 
// 1. You need to add cookies manually to the express middleware stack.
// 2. Be aware of the magical string "id_token"
import jwtExpress from 'express-jwt';
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

// we'll leave the cookie alternative here
const getToken = req => {
	const hasAuthorizationHeader = !!req.headers.authorization;
	const headerParts = hasAuthorizationHeader && req.headers.authorization.split(' ');
	if (hasAuthorizationHeader && headerParts[0] === 'Bearer') {
		return headerParts[1];
	} else {
		return req.cookies.id_token;
	}
	return null;
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
		res.redirect('/login');
	}
}


// synchronous? asynchronous? to A or not to A.
const auth = (user, password) => {
	// we ignore the password
	console.log(`auth on ${user} / ${password} auto-success`);

	// returns the id of the user
	// i should have used a proper db. this is messy
	const userObj = find(users(), { username: user });
	return userObj && userObj.id;
}

export default {
	authActionMiddleware, checkToken, generate, auth
};