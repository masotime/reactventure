import { cloneDeep, remove } from 'lodash';

// a blank slate schema is as follows
const blank = {
	users: [],
	messages: [],
	posts: [],
	medias: []
};

// stick with basic one first
const reducer = (state = blank, action) => {
	const newState = cloneDeep(state);
	const removeUsingId = type => remove(newState[type], 'id', action.id);

	// let's just do deletion for now
	switch (action.type) {
		case 'DELETE_MESSAGE': removeUsingId('message'); break;
		case 'DELETE_POST': removeUsingId('post'); break;
		case 'DELETE_MEDIA': removeUsingId('media'); break;
	}

	return newState;
};

export default reducer;