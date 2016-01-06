// listens to a route change. The custom listener will fire off "route" actions to the store,
// which via "xhr" will fetch data (or fail, if the user is not sufficiently authenticated and/or authorized)
import { helpers } from 'route-action';
const { GET } = helpers;

export default (history, store) => {
	let initialLoad = true; // messy? prevents redundant fetch on first load.
	history.listen(location => {
		const url = location.pathname;
		console.log(`[react-router] ${url}`);
		if (initialLoad) {
			initialLoad = false;
		} else {
			// TODO: this doesn't check authorization first, making a wasted trip on the server-side
			store.dispatch(GET({url}));
		}
	});
}