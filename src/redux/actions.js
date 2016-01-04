import { cloneDeep } from 'lodash';

const fieldUpdateAction = (path, value) => ({
	type: 'FIELD_UPDATE',
	path, value
});

const populateAction = body => ({
	...body,
	type: 'POPULATE'
});

export default {
	fieldUpdateAction,
	populateAction
};