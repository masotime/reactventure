// UNIVERSAL MODULE
import cloneDeep from 'lodash/lang/cloneDeep';

// action creators go here
const routeAction = (url, method) => body => ({
	type: 'ROUTE',
	url: url,
	method: method,
	body: body
});

const applyState = (state, error) => action => {
	let newAction = cloneDeep(action);
	newAction.state = state;

	if (error) {
		newAction.error = error;
		// make an error a plain JSON if necessary
		if (error instanceof Error) {
			newAction.error = {};
			Object.keys(error).reduce( (errObj, key) => {
				errObj[key] = error[key];
			}, newAction.error);
			newAction.error.message = error.message;
			newAction.error.stack = error.stack;
		}
	}

	return newAction;
}

export default {
	routeAction,
	GET: url => routeAction(url, 'GET'),
	POST: url => routeAction(url, 'POST'),
	applyState
};