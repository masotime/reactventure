import { cloneDeep, set } from 'lodash';

export default (state, action) => {
	if (action.type === 'FIELD_UPDATE') {
		const path = action.path;
		const value = action.value;
		return set(cloneDeep(state), path, value);
	}

	return state;
};