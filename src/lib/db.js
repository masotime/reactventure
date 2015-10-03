// this is a faux database to work with. use this server-side only, to generate initial states.
import maker from './maker';
import { quickArray, choose, chooseUpTo } from './util';
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

const getDb = () => initial;

// getDb retrieves the same initial state always, i.e. it retrieves a mutable copy of the "database"
export default getDb;