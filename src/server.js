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
// import controller from './server/controller'; // this adds a server-side specific "data fetcher"
import storeMaker from './redux/store'; // lol... i need to refactor this
const getStore = storeMaker(reducer); // no controllers

console.log(`Server initializing...`);

const app = express();

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

// we apply express routes
import { basicRoutes, securedRoutes, authRoutes } from './server/routes';
app.use(basicRoutes);
app.use(securedRoutes);
app.use(authRoutes);

// we first have a delegate that catches all xhr requests
// if it is an xhr, we simply return a JSON and let the client side
// handle the rendering
app.use('/*', (req, res, next) => {
	if (req.xhr && res.action) {
		console.log('xhr request detected. server responds with res.action =', res.action);
		res.json(res.action);
	} else {
		return next();
	}
});

// otherwise, we dispatch the action to the store and
// perform the rendering server side
app.use('/*', (req, res) => {

	// NOTE: I may not want to use session / state if I can avoid it
	// TODO: More thinking needed.
	hydrateSession(req);
	const store = getStore(req.session.state);

	// if an upstream express route has appended a res.action
	// dispatch it to the store before rendering.
	if (res.action) {
		store.dispatch(res.action);
	}

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