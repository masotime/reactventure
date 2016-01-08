import jwt from 'jsonwebtoken';
import { find } from 'lodash';
import { users } from '../services/dal';
import { COOKIE_KEY, CLIENT_SECRET, CLIENT_ID, ISSUER } from './keys';

// this is a convenience function that will add a response cookie
// note that it doesn't enforce the secure flag, so the cookie
// can still be sent over HTTP (an obvious security issue)
export const addTokenCookie = (res, payload) => {
	const token = generate(payload);
	res.cookie(COOKIE_KEY, token, { httpOnly: true });
}

export const logout = res => {
	res.clearCookie(COOKIE_KEY);
}

export const generate = payload => {
	return jwt.sign(payload, CLIENT_SECRET, {
		algorithm: 'HS256', // symmetric for an easier life
		expiresIn: '1h',
		audience: CLIENT_ID,
		issuer: ISSUER
	});
}

export const auth = (user, password) => {
	// we ignore the password
	console.log(`auth on ${user} / ${password} auto-success`);

	// returns the id of the user
	// i should have used a proper db. this is messy
	const userObj = find(users(), { username: user });
	return userObj;
}


export const checkToken = token => {
	// prove (or otherwise) that the token contains
	// an encrypted version of the specified user,
	// and that said user exists in the database
	let decoded;

	try {
		decoded = jwt.verify(token, CLIENT_SECRET);
	} catch (e) {
		return false;
	}

	// once decoded, we ASSUME (TODO!) that it has a user_id property
	return find(users(), { id: decoded.user_id });
}