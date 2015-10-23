import express from 'express';
import routesFactory from './routes';
import render from './server/render';
import ignite from './lib/ignite'; // this adds webpack hot loading

// database hydration code - REFACTOR
import getDb from './lib/db';
const hydrateSession = (req) => {
	if (req && req.session) {
		req.session.state = getDb();
	}
}

// we prepare a store creation function with a reducer and server-side specific middleware
import reducer from './redux/reducers'; // this adds the univesal reducers
import controller from './server/controller'; // this adds a server-side specific "data fetcher"
import storeMaker from './redux/store'; // lol... i need to refactor this
const getStore = storeMaker(reducer, controller);

console.log(`Server initializing...`);

const app = express();

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
})(express.Router());

// we introduce secured routes. 
// see https://auth0.com/blog/2015/09/28/5-steps-to-add-modern-authentication-to-legacy-apps-using-jwts/
import { authMiddleware, auth, generate } from './lib/jwt';
import moment from 'moment';

// TODO: the function parameters are irritatingly confusing
const securedRoutes = ((router, generate, auth, authenticate) => {

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
	router.post('/authorize-cookie', authenticate, (req, res) => {
		res.cookie('id_token', req.body.token, {
			expires: moment().add(1, 'hour'),
			httpOnly: true
		});
		res.json({ message: 'Cookie set!' });
	});

	router.get('/users', authenticate, (req, res, next) => {
		console.log('Users page');
		next();
	});

	router.get('/posts', authenticate, (req, res, next) => {
		console.log('Posts page');
		next();
	});

	router.get('/media', authenticate, (req, res, next) => {
		console.log('Media page');
		next();
	});

	router.get('/messages', authenticate, (req, res, next) => {
		console.log('Messages page');
		next();
	});

	return router;

})(express.Router(), generate, auth, authMiddleware);

// add the hot middleware into the stack
import webpackConfig from '../webpack.config';
ignite(app, webpackConfig);

// add cookies and body-parser (JSON and text) into the stack
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.text());

// add session support
import session from 'express-session';
app.use(session({
	resave: false,
	saveUninitialized: false,
	secret: 'pineapple'
}));

// we serve static files (really just the webpack bundle)
app.use(express.static('build/public'));

// we delegate rendering to a universal react catchall
app.use(basicRoutes);
app.use(securedRoutes);
app.use('/*', (req, res) => {

	// NOTE: I may not want to use session / state if I can avoid it
	// TODO: More thinking needed.
	hydrateSession(req);
	const store = getStore(req.session.state);

	// DON'T USE req.url, it's part of http not express
	render({ routes: routesFactory(store), location: req.originalUrl, store}, (err, result) => {
		if (err) {
			return res.status(500).send(err);
		} else if (result.code === 302) {
			return res.status(302).redirect(result.url);
		} else if (result.code === 404) {
			return res.status(404).end();
		} else {
			// the whole __INITIAL_STATE__ thing is from https://goo.gl/bOrXPH
			return res.status(200).send(`
<!doctype html>
<html>
	<head></head>
	<!-- I give up - it is way too troublesome to not render into an outer container -->
	<body><div id="react-container">${result.output}</div></body>
	<!-- Hydration -->
	<script>window.__INITIAL_STATE__ = ${JSON.stringify(result.state)}</script>
	<script src="js/bundle.js"></script>
</html>
			`);
		}
	});
});

// error handling. there doesn't seem to be any elegant way to handle this
app.use(function handleErrors(err, req, res, next) {
	console.error(err && err.stack);
	if (err.name === 'UnauthorizedError') {
		res.redirect('/login');
	} else {
		next(err);
	}
});

const server = app.listen(8000, () => {
	const started = server.address();
	console.log(`Example app listening at http:\/\/${started.address}:${started.port}`);
});