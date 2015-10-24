// place to store express routes
import { Router } from 'express';

// these are basic routes, without security
const basicRoutes = ((router) => {
	router.get('/', (req, res, next) => {
		console.log('Index page');
		next();
	});

	router.get('/about', (req, res, next) => {
		console.log('About page');
		next();
	});

	router.get('/login', (req, res, next) => {
		console.log('Login page');
		next();
	});


	return router;
})(Router());

// these are secured routes
import { authMiddleware } from '../lib/jwt';
const securedRoutes = ((router, authMiddleware) => {

	router.get('/users', authMiddleware, (req, res, next) => {
		console.log('Users page');
		next();
	});

	router.get('/posts', authMiddleware, (req, res, next) => {
		console.log('Posts page');
		next();
	});

	router.get('/media', authMiddleware, (req, res, next) => {
		console.log('Media page');
		next();
	});

	router.get('/messages', authMiddleware, (req, res, next) => {
		console.log('Messages page');
		next();
	});

	return router;

})(Router(), authMiddleware);

// these are authentication routes
// see https://auth0.com/blog/2015/09/28/5-steps-to-add-modern-authentication-to-legacy-apps-using-jwts/
import { auth, generate } from './lib/jwt';
import { routeAction, applyState } from './lib/jwt';
const authRoutes = ((router, auth, generate) => {

	// this route does the actual login stuff
	router.post('/login', (req, res) => {
		if (auth(req.body.username, req.body.password)) {
			res.json({
				token: generate({ user_id: req.body.user_id }) // this is needed for client-side
			});
		} else {
			// respond with an action
			res.stats(500).json({ code: 'AUTH_FAILURE',  })
		}
		
	});

	// this route checks the header for a valid jwt and 
	// sets an appropriate cookie. "authenticate" adds
	// the token to the body which we will retrieve
	// TODO: Do we need this???
	/*
	import moment from 'moment';
	router.post('/authorize-cookie', authenticate, (req, res) => {
		res.cookie('id_token', req.body.token, {
			expires: moment().add(1, 'hour'),
			httpOnly: true
		});
		res.json({ message: 'Cookie set!' });
	});
	*/

	return router;

})(Router(), auth, generate);

export default {
	basicRoutes,
	securedRoutes,
	authRoutes
};