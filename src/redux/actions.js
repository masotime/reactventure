import { cloneDeep } from 'lodash';

// action creators go here
const routeAction = (url, method) => (body, headers = {}) => ({
	type: 'ROUTE', url, method, body, headers
});

const fieldUpdateAction = (path, value) => ({
	type: 'FIELD_UPDATE',
	path, value
});

const populateAction = (body) => ({
	...body,
	type: 'POPULATE'
});

export default {
	routeAction,
	fieldUpdateAction,
	populateAction,
	GET: url => routeAction(url, 'GET'),
	POST: url => routeAction(url, 'POST')
};