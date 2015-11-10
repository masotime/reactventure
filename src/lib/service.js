// this will be the "service" layer
import getDb from './db';

export default {
	auth: () => getDb().auth,
	users: () => getDb().users,
	messages: () => getDb().messages,
	posts: () => getDb().posts,
	medias: () => getDb().medias
};