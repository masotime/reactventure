// listens to a route change. The custom listener will fire off "route" actions to the store,
// which via "xhr" will fetch data (or fail, if the user is not sufficiently authenticated and/or authorized)
import { GET } from '../redux/actions'; // creates route GET actions

export default (history, store) => {
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
}