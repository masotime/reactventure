// place to store express routes
import { Router } from 'express';
import { applyState } from '../redux/actions';
import { users, posts, medias, messages } from '../lib/service';

// these are basic routes, without security
const basicRoutes = ((router) => {
	router.get('/', (req, res) => {
		console.log('Index page');
		res.action();
	});

	router.get('/dashboard', (req, res) => {
		res.action(applyState('success')(req.action));
	});

	router.get('/about', (req, res) => {
		req.action.body = {
			content : {
				header: 'About BenBook',
				body: 'This is an experimental web project used to figure out how to achieve _nirvana_... a _truly_ universal application.'
			}
		};

		res.action(applyState('success')(req.action));
	});

	router.get('/login', (req, res) => {
		// load users to login with
		// TODO: USERS DUMP, EXPERIMENTATION ONLY, REMOVE LATER
		req.action.body = { 
			users : users(), 
			loginform: { 
				username: '', password: '' 
			} 
		};
		res.action(applyState('success')(req.action));
	});

	return router;
})(Router());

// these are secured routes
import { authActionMiddleware } from '../lib/jwt';
const securedRoutes = ((router, authMiddleware) => {

	const delay = 1000;

	router.get('/users', authMiddleware, (req, res) => {
		console.log('Load users');
		req.action.body = { users: users() };

		setTimeout( () => res.action(applyState('success')(req.action)), delay);
	});

	router.get('/posts', authMiddleware, (req, res) => {
		console.log('Load posts');
		req.action.body = { posts: posts() };

		setTimeout( () => res.action(applyState('success')(req.action)), delay);
	});

	router.get('/medias', authMiddleware, (req, res) => {
		console.log('Load medias');
		req.action.body = { medias: medias() };

		setTimeout( () => res.action(applyState('success')(req.action)), delay);
	});

	router.get('/messages', authMiddleware, (req, res) => {
		console.log('Load messages');
		req.action.body = { messages: messages() };

		setTimeout( () => res.action(applyState('success')(req.action)), delay);
	});

	return router;

})(Router(), authActionMiddleware);

// these are authentication routes
// see https://auth0.com/blog/2015/09/28/5-steps-to-add-modern-authentication-to-legacy-apps-using-jwts/
import { auth, generate, addTokenCookie, logout } from '../lib/jwt';
const authRoutes = ((router, auth, generate) => {

	// this route does the actual login stuff
	router.post('/login', (req, res) => {
		const action = req.action;
		const user = auth(action.body.name, action.body.password);
		if (user) {
			// generate a JSON action response
			// NOTE: we will use a "header" to prevent pollution of the action body
			const payload = { user_id: user.id };
			action.headers = action.headers || {};
			action.headers.token = generate(payload);
			action.headers.name = user.username;
			addTokenCookie(res, payload); // add it to the client cookie as well, HTTP Only
			res.actionRedirect(applyState('success')(action), '/dashboard');
		} else {
			// respond with an action
			res.action(applyState('error', { 
				message: 'Authentication failure'
			})(action));
		}
	});

	router.get('/logout', (req, res) => {
		// remove auth information from client-side (action.headers)
		// as well as server-side (cookies).
		const action = logout(res, req.action);
		res.redirectAction(applyState('success')(action), '/about');
	});

	return router;

})(Router(), auth, generate);

export default {
	basicRoutes,
	securedRoutes,
	authRoutes
};