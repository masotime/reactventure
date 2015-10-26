// does all the JSON web tokens stuff. Taken from https://auth0.com/blog/2015/09/28/5-steps-to-add-modern-authentication-to-legacy-apps-using-jwts/
// Notes: 
// 1. You need to add cookies manually to the express middleware stack.
// 2. Be aware of the magical string "id_token"
import jwtExpress from 'express-jwt';
import jwt from 'jsonwebtoken';
import keys from './keys';
import { find } from 'lodash';

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

const generate = (payload) => {
	return jwt.sign(payload, keys.CLIENT_SECRET, {
		algorithm: 'HS256', // symmetric for an easier life
		expiresIn: '1h',
		audience: keys.CLIENT_ID,
		issuer: keys.ISSUER
	});
}

// synchronous? asynchronous? to A or not to A.
import getDb from './db';
const auth = (user, password) => {
	// we ignore the password
	console.log(`auth on ${user} / ${password} auto-success`);

	// returns the id of the user
	// i should have used a proper db. this is messy
	const db = getDb();
	const userObj = find(db.users, { username: user });
	return userObj && userObj.id;
}

export default {
	authMiddleware, generate, auth
};