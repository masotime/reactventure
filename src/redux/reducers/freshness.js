import { cloneDeep } from 'lodash';
import { isRouteAction } from 'route-action';

export default (state = {}, action) => {

	// only applies for route actions
	if (!(isRouteAction(action) && action.method === 'GET')) { // TODO: may not always be a GET
		return state;
	}

	const freshness = cloneDeep(state);

	// we track the "freshness" of the retrieved data
	const url = action.url;
	const timestamp = (new Date()).getTime();
	freshness[url] = freshness[url] || {};

	switch (action.statusCode) {
		case 102:
			console.log(`setting freshness[${url}] to pending`);
			freshness[url].state = 'pending';
			break;

		case 500: 
			console.log(`setting freshness[${url}] to failure`);
			freshness[url].state = 'failure';
			freshness[url].timestamp = timestamp;
			break; // what do i do?

		case 200: 
			console.log(`setting freshness[${url}] to success`);
			freshness[url].state = 'success';
			freshness[url].timestamp = timestamp;
			break;
	}

	return freshness;

}