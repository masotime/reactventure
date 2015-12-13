import express from 'express';
import routes from './routes';
import render from './server/render';
import ignite from './lib/ignite'; // this adds webpack hot loading

// we prepare a store creation function with a reducer and server-side specific middleware
import reducer from './redux/reducers'; // this adds the univesal reducers
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

// we serve static files (really just the webpack bundle)
app.use(express.static('build/public'));

// for any request, we either force the creation of an action or
// we augment the existing one with auth information (if it is present
// in the cookie but not included)
//
// once done, we define a req.action which express routes will use to
// do further processing.
//
import { authSync } from './lib/jwt';
import { routeAction } from './redux/actions';

app.use((req, res, next) => {
	// base "ROUTE" action, with empty body and headers
	let action = routeAction(req.originalUrl, req.method)({}, {});
	const actionQueue = [];
	const store = getStore();

	// if the request has a body, then we use that instead
	// to represent the action
	if (req.body && req.body.type === 'ROUTE') {
		action = req.body;
		action.body = action.body || {};
		action.headers = action.headers || {};

		// however, we force the url and method to match the 
		// actual HTTP url and method to prevent possible abuse.
		action.url = req.originalUrl;
		action.method = req.method;
	}

	// declare an "action" on the request
	req.action = action;

	// utility methods
	res.getState = () => store.getState();

	// we augment the response with an action and actionRedirect
	// both of which will provide specialized responses for redux actions
	res.dispatch = (action = req.action) => {
		console.log('[server] dispatch action = ' + JSON.stringify(action, null, 4));
		actionQueue.push(action); 
	};

	res.universalRender = () => {
		// check the last action in the queue. If it is not a ROUTE action,
		// then send a base ROUTE action with a 200 status code
		if ((actionQueue[actionQueue.length - 1] || {}).type !== 'ROUTE') {
			const finishAction = routeAction(req.originalUrl, req.method)({}, {});
			finishAction.status = res.statusCode || 200;
			actionQueue.push(finishAction);
		}

		if (req.xhr) {
			// respond with JSON containing the action
			console.log('[server] universalRender | xhr | respond with JSON queue');
			return res.json(actionQueue);
		} else {
			// dispatch the action and render server-side
			console.log('[server] universalRender | server-side | dispatch all and respond with HTML');
			actionQueue.forEach( action => store.dispatch(action) );
			renderRouter(req, res, store);
		}
	}

	res.universalRedirect = (route) => {
		const redirectAction = routeAction(req.originalUrl, req.method)({}, {});
		redirectAction.status = 302;
		redirectAction.headers.location = route;
		res.dispatch(redirectAction); // simple passthrough

		if (req.xhr) {
			console.log('[server] dispatchRedirect | xhr | ending with redirect action');
			res.universalRender(); // terminate. We should not do anything else after a redirect
		} else {
			// note that a server-side redirect means that all actions queued are lost
			// this is consistent with how redirect works normally.
			res.redirect(route);
		}
	};

	console.log(`[server] req.action ${JSON.stringify(req.action, null, 4)}`);
	next();
});

app.use(authSync);

// we apply express routes
import { basicRoutes, securedRoutes, authRoutes } from './server/routes';
app.use(basicRoutes);
app.use(securedRoutes);
app.use(authRoutes);

const renderRouter = (req, res, store) => {

	render({ routes, location: req.originalUrl, store}, (err, result) => {
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
	<body><div id="react-container">${result.output}</div></body>
	<!-- Hydration -->
	<script>window.__INITIAL_STATE__ = ${JSON.stringify(result.state)}</script>
	<script src="js/bundle.js"></script>
</html>
			`);
		}
	});
}

app.use(function handleErrors(err, req, res, next) {
	console.error(err && err.stack);
	res.status(500).send(err.stack);
});

const server = app.listen(8000, () => {
	const started = server.address();
	console.log(`Example app listening at http://${started.address}:${started.port}`);
});