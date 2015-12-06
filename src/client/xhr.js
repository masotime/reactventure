// another possible name is "routes.js"
// essentially we need to inject a client-side specific redux middleware that will 
// perform data / I/O operations based upon the simple actions that are dispatched by
// individual components.
//
// redux-thunk itself does nothing to help in this, since it just enables manual dispatch
// control. The actions sent from the React tier are identical, and a transformer must
// be defined to specify how to handle requests.
//
// to make things as "seamless" as possible, such actions will have a .url attribute
// that will match an express-route, and with a .method attribute.

// quick primer
// * store gives me access to the store to .getState()
// * next is really just dispatch, but to the next middleware
// * action is... the action that is passed to me either from
//   the top or the previous middleware

/* global fetch, location */
import es6promise from 'es6-promise';
import 'isomorphic-fetch';
import { applyState } from '../redux/actions';

es6promise.polyfill();

// *sigh*
function relPathToAbs(sRelPath) {
  var nUpLn, sDir = "", sPath = location.pathname.replace(/[^\/]*$/, sRelPath.replace(/(\/|^)(?:\.?\/+)+/g, "$1"));
  for (var nEnd, nStart = 0; nEnd = sPath.indexOf("/../", nStart), nEnd > -1; nStart = nEnd + nUpLn) {
    nUpLn = /^\/(?:\.\.\/)*/.exec(sPath.slice(nEnd))[0].length;
    sDir = (sDir + sPath.substring(nStart, nEnd)).replace(new RegExp("(?:\\\/+[^\\\/]*){0," + ((nUpLn - 1) / 3) + "}$"), "/");
  }
  return sDir + sPath.substr(nStart);
}

export default history => store => next => action => {

	// basically this is a middleware that executes xhr
	// requests and dispatches the response from
	// the server when it finally comes back.

	// TODO: timeouts, and error handling from the server
	if (action.type === 'ROUTE') {
		// start by initiating - we will define an attribute "state" that
		// represents the state of the "request" - 'pending', 'success', 'error'
		// TODO: Make an immutable clone
		action.state = 'pending';
		next(action);

		// we need to prepare a payload for the fetch.
		// seriously annoying.
		let payload = {
			method: action.method || 'GET',
			headers: { // this is even more irritating. fetch is not considered an XHR wtf.
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'X-Requested-With': 'XMLHttpRequest' // this guarantees req.xhr === true server-side
			},
			credentials: 'same-origin' // for cookies to be sent in the headers
		};

		// we deal with JWT authentication. I don't like all this boilerplate in here though
		// TODO: Find a way to refactor
		const state = store.getState();
		if (state.auth && state.auth.token) {
			payload.headers.Authorization = 'Bearer ' + state.auth.token;
		}


		if (!/^(GET|HEAD)$/.test(payload.method)) {
			// the body must be some weird Form object or a string. It cannot be a JSON object wtf.
			payload.body = JSON.stringify(action);
		}

		return fetch(action.url, payload).then(function(res) {
			if (res.status >= 400) {
				const errorAction = applyState('error', { message: `Status ${res.status}` })(action);
				return next(errorAction);
			}

			// there is no way to be directly aware of redirects according to WhatWG's
			// fetch protocol. The only way is to look at the url from the response
			const finalPath = /^[^\/]+\/\/[^\/]+(.*)$/.exec(res.url)[1];
			const originalPath = relPathToAbs(action.url);

			if (finalPath !== originalPath) {
				// this is where we force a redirect via react-router / history
				console.log(`AJAX redirect to ${finalPath}`)
				return history.push(finalPath);
			}

			// TODO: do checks before dispatching
			res.json().then(next); // ugh all these irritating promises
		}).catch(function (err) {
			console.log(err);
		});
	}

	// not a ROUTE, passthrough
	return next(action);

	/*
	if (action.url) {
		// start by initiating - we will define an attribute "state" that
		// represents the state of the "request" - 'pending', 'success', 'error'
		action.state = 'pending';
		next(action);

		// we do "route matching next"
		// simplified here, should use express router eventually
		switch (action.url) {
			case '/login':
				const { name, password } = action.body;
				// fake a login request
				console.log(`Mock login using ${name} / ${password} started...`);
				return setTimeout(() => {
					action.state = 'success';
					next(action);
				}, 1000);

			case '/logout':
				action.state = 'success';
				return next(action);

			default:
				action.state = 'error';
				action.error = new Error(['404 NOT FOUND', action.url].join('/'));
				return next(action);
		};

	} else {
		// passthrough, not a "url" action
		return next(action);
	}
	*/
};