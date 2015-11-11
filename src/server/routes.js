// place to store express routes
import { Router } from 'express';
import { POST, GET, applyState } from '../redux/actions';
import { users, posts, medias, messages } from '../lib/service';

const makeGET = req => {
	return GET(req.originalUrl)(req.body.body);
}

// these are basic routes, without security
const basicRoutes = ((router) => {
	router.get('/', (req, res, next) => {
		console.log('Index page');
		next();
	});

	router.get('/dashboard', (req, res, next) => {
		console.log('dashboard page');

		// noop
		res.action = applyState('success')(makeGET(req));
		next();
	});

	router.get('/about', (req, res, next) => {
		console.log('About page');

		const action = makeGET(req);
		action.body = {
			content : {
				header: 'About BenBook',
				body: 'This is an experimental web project used to figure out how to achieve _nirvana_... a _truly_ universal application.'
			}
		};

		res.action = applyState('success')(action);
		next();
	});

	router.get('/login', (req, res, next) => {
		console.log('Login page');

		// load users to login with
		// TODO: EXPERIMENTATION ONLY, REMOVE LATER
		const action = makeGET(req);
		action.body = { users : users() };

		res.action = applyState('success')(action);

		next();
	});


	return router;
})(Router());

// these are secured routes
import { authMiddleware } from '../lib/jwt';
const securedRoutes = ((router, authMiddleware) => {

	router.get('/users', authMiddleware, (req, res, next) => {
		console.log('Load users');
		const action = makeGET(req);
		action.body = { users: users() };

		res.action = applyState('success')(action);
		next();
	});

	router.get('/posts', authMiddleware, (req, res, next) => {
		console.log('Load posts');
		const action = makeGET(req);
		action.body = { posts: posts() };

		res.action = applyState('success')(action);
		next();
	});

	router.get('/media', authMiddleware, (req, res, next) => {
		console.log('Load medias');
		const action = makeGET(req);
		action.body = { medias: medias() };

		res.action = applyState('success')(action);

		console.log('Media page');
		next();
	});

	router.get('/messages', authMiddleware, (req, res, next) => {
		console.log('Load messages');
		const action = makeGET(req);
		action.body = { messages: messages() };

		res.action = applyState('success')(action);

		next();
	});

	return router;

})(Router(), authMiddleware);

// these are authentication routes
// see https://auth0.com/blog/2015/09/28/5-steps-to-add-modern-authentication-to-legacy-apps-using-jwts/
import { auth, generate } from '../lib/jwt';
const authRoutes = ((router, auth, generate) => {

	// this route does the actual login stuff
	router.post('/login', (req, res, next) => {
		const action = POST('/login')(req.body.body); // this is really REALLY irritating
		const id = auth(action.body.name, action.body.password);
		if (id) {
			// generate a JSON action response
			action.body.token = generate({ user_id: id });
			res.action = applyState('success')(action);
		} else {
			// respond with an action
			res.action = applyState('error', { 
				message: 'Authentication failure'
			})(action);
		}

		next();
	});

	router.get('/logout', (req, res, next) => {
		const action = GET('/logout')({}); // GET has no body. params?
		res.action = applyState('success')(action);
		next();
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