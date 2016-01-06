// this simple middleware adds the JWT token header to any route action
// the xhr middleware will transfer this over to the actual request
import { isRouteAction } from 'route-action';

export default store => next => action => {
	if ( isRouteAction(action) ) {
		// add JWT authentication headers.
		const state = store.getState();
		if (state.auth && state.auth.token) {
			action.headers = action.headers || {};
			action.headers.Authorization = `Bearer ${state.auth.token}`;
		}
	}

	next(action);
}