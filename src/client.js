/* global window */
// This is a client-side entry-point
// It can use the same React components as the server-side, but essentially
// this is the version that is loaded by the browser.

// load stuff like css
import './css/main.css';

// this is the application specific routes and reducers
import routes from './routes';

// we also create a history client side. the history is the "counterpart" to the location
// required on the server-side. It will have a custom listener that will fire off
// "route" actions to the store, which via "xhr" will fetch data (or fail, if the user
// is not sufficiently authenticated and/or authorized)
import { GET } from './redux/actions'; // creates route GET actions
import { createHistory } from 'history';
const history = createHistory(); // so this will be a client-side history 
let initialLoad = true; // messy? prevents redundant fetch on first load.
history.listen(location => {
	const route = location.pathname;
	console.log(`[react-router] ${route}`);
	if (initialLoad) {
		initialLoad = false;
	} else {
		// TODO: this doesn't check authorization first, making a wasted trip on the server-side
		store.dispatch(GET(route)({})); // params....?
	}
});


// we prepare a store creation function with a reducer and server-side specific middleware
import rootReducer from './redux/reducers'; // this adds the univesal reducers
import xhr from './client/xhr'; // xhr acts as a middleware to dispatch to server-side
import { createStore } from './universal/redux';

// load the client-side renderer
import render from './client/render';

// assuming it will magically work
const store = createStore(
	{ reducer: rootReducer, initialState: window.__INITIAL_STATE__ },
	xhr(history)
);
window.store = store; // for debugging

render({
	routes,
	location: window.location, // this is unused, but here to maintain parity with server-side "render"
	history,
	store
}, (err) => {
	if (err) {
		console.error(err);
	} else {
		console.log('React component mounted');	
	}
});