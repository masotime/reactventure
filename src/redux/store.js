// This is a store.
import { createStore } from 'redux';
import maker from '../lib/maker';
import { quickArray, choose, chooseUpTo } from '../lib/util';
import { cloneDeep, remove } from 'lodash';

// for simplicity, we will have users, messages, posts and media
// * users are users, everything else is tied to a user.
// * messages assumed to be always text
// * posts assuemd to be random collection of media
// * medias is either paragraph, image or video, stored in .data (either raw text or URL)
const users = quickArray(5, () => maker.user());

const initial = {
	users: users
};

// messages and medias require users to be defined first
initial.messages = quickArray(5, () => maker.message(...choose(users, 2)));
initial.medias = quickArray(5, () => maker.media(...choose(users, 1)));

// posts require both medias and users
// going to ignore that users can post media that's not their own.
initial.posts = quickArray(5, () => maker.post(...choose(users, 1), chooseUpTo(initial.medias, 5)));

// stick with basic one first
const reducer = (state = initial, action) => {
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

export default function getStore() {
	return createStore(reducer, initial);
};