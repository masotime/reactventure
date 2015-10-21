/* global window */
// This is a client-side entry-point
// It can use the same React components as the server-side, but essentially
// this is the version that is loaded by the browser.

// load stuff like css
import './css/main.css';

// this is the application specific routes and reducers
import routesFactory from './routes';

// we prepare a store creation function with a reducer and server-side specific middleware
import reducer from './redux/reducers'; // this adds the univesal reducers
import controller from './client/controller'; // this adds a client-side specific "data fetcher"
import storeMaker from './redux/store'; // lol... i need to refactor this
const getStore = storeMaker(reducer, controller);

// load the client-side renderer
import render from './client/render';

// assuming it will magically work
const store = getStore(window.__INITIAL_STATE__);
render({
	routes: routesFactory(store),
	location: window.location, // this is unused, but here to maintain parity with server-side "render"
	store
}, (err) => {
	if (err) {
		console.error(err);
	} else {
		console.log('React component mounted');	
	}
});