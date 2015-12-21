// adds "dispatch-like" functionality to response object
import { createStore, render } from '../../universal/redux';
import { routeAction } from '../../redux/actions';

import createHistory from '../../universal/history';
import createRouterComponent from '../../universal/react-router';
import { log } from '../../lib/extras';


const reactRouterRender = ({ store, routes }, req, res) => {

	const history = createHistory(req.originalUrl);
	createRouterComponent(routes, history, (err, Component) => {
		if (err) {
			if (err.statusCode) {
				res.status(err.statusCode)
			}

			switch (err.constructor.name) {
				case 'RedirectError':
					return res.redirect(err.url);
				case 'NotFoundError':
					return res.end();
				case 'ServerError':
					return res.send(err.error.stack);
				default:
					return res.status(500).send(err); // unexpected error
			}
		}

		const html = render(Component, store);
		const state = store.getState();
		log(html, state);

		// the whole __INITIAL_STATE__ thing is from https://goo.gl/bOrXPH
		return res.status(200).send(`
<!doctype html>
<html>
	<head></head>
	<body><div id="react-container">${html}</div></body>
	<!-- Hydration -->
	<script>window.__INITIAL_STATE__ = ${JSON.stringify(store.getState())}</script>
	<script src="js/bundle.js"></script>
</html>`);
	});
}

export default ({ rootReducer, initialState, routes }, ...middlewares) => (req, res, next) => {

	// base "ROUTE" action, with empty body and headers
	let action = routeAction(req.originalUrl, req.method)({}, {});
	const actionQueue = [];
	const store = createStore({ reducer: rootReducer, initialState }, ...middlewares);

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
			reactRouterRender({ store, routes }, req, res);
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
};