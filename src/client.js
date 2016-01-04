/* global window, document */
// This is a client-side entry-point
// It can use the same React components as the server-side, but essentially
// this is the version that is loaded by the browser.

// use redouter to reduce boilerplate
import { universal } from 'redouter';

// load stuff like css
import './css/main.css';

// this is the application specific routes and reducers
import routes from './routes';
import activateListener from './client/listener';
import rootReducer from './redux/reducers'; // this adds the univesal reducers
import xhr from './client/xhr'; // xhr acts as a middleware to dispatch to server-side

const history = universal.createHistory(); // so this will be a client-side history 
const store = universal.createStore(
	{ reducer: rootReducer, initialState: window.__INITIAL_STATE__ },
	xhr(history)
);
window.store = store; // for debugging
activateListener(history, store);
universal.createRouterComponent(routes, history, (err, Component) => {
	if (err) {
		console.error(err);
	} else {
		universal.render(Component, store, document.getElementById('react-container'));
	}
});