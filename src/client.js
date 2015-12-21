/* global window, document */
// This is a client-side entry-point
// It can use the same React components as the server-side, but essentially
// this is the version that is loaded by the browser.

// load stuff like css
import './css/main.css';

// this is the application specific routes and reducers
import routes from './routes';

// we also create a history client side. the history is the "counterpart" to the location
// required on the server-side.
import createHistory from './universal/history';
import activateListener from './client/listener';

// we prepare a store creation function with a reducer and server-side specific middleware
import rootReducer from './redux/reducers'; // this adds the univesal reducers
import xhr from './client/xhr'; // xhr acts as a middleware to dispatch to server-side
import { createStore, render } from './universal/redux';
import createRouterComponent from './universal/react-router';


const history = createHistory(); // so this will be a client-side history 
const store = createStore(
	{ reducer: rootReducer, initialState: window.__INITIAL_STATE__ },
	xhr(history)
);
window.store = store; // for debugging
activateListener(history, store);
createRouterComponent(routes, history, (err, Component) => {
	if (err) {
		console.error(err);
	} else {
		render(Component, store, document.getElementById('react-container'));
	}
});