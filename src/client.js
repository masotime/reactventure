/* global window */
// This is a client-side entry-point
// It can use the same React components as the server-side, but essentially
// this is the version that is loaded by the browser.

// load stuff like css
import './css/main.css';

// this is the application specific routes and reducers
import routes from './routes';
import reducer from './redux/reducers';

// load the client-side renderer
import render from './client/render';

// assuming it will magically work
render({
	routes,
	location: window.location, // this is unused, but here to maintain parity with server-side "render"
	reducer,
	state: window.__INITIAL_STATE__
}, (err) => {
	if (err) {
		console.error(err);
	} else {
		console.log('React component mounted');	
	}
});