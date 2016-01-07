/* global window, document */
// This is a client-side entry-point
// It can use the same React components as the server-side, but essentially
// this is the version that is loaded by the browser.

// load stuff like css
import './css/main.css';

// use redouter to reduce boilerplate
import { universal, client } from 'redouter';

// this is the application specific routes and reducers
import routes from './routes';
import rootReducer from './redux/reducers'; // this adds the univesal reducers
import auth from './client/auth';

const history = universal.createHistory(); // so this will be a client-side history 
const store = universal.createStore(
	{ reducer: rootReducer, initialState: window.__INITIAL_STATE__ },
	auth,
	client.requestRedux(history)
);

window.store = store; // for debugging
client.routeTrigger(history, store); // listen to location changes and dispatch route actions
universal.createRouterComponent(routes, history, (err, Component) => {
	if (err) {
		console.error(err);
	} else {
		universal.render(Component, store, document.getElementById('react-container'));
	}
});