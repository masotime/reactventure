import { Router } from 'express';
import { populateAction } from '../../redux/actions';
import { users as getUsers, posts as getPosts, medias as getMedias, messages as getMessages } from '../../lib/service';

// these are secured routes
import { authActionMiddleware } from '../../lib/jwt';
export default ((router, authMiddleware) => {

	const delay = 1000;

	router.get('/users', authMiddleware, (req, res) => {
		res.dispatch(populateAction({ users: getUsers() }));
		setTimeout(res.universalRender, delay);
	});

	router.get('/posts', authMiddleware, (req, res) => {
		res.dispatch(populateAction({ posts: getPosts() }));
		setTimeout(res.universalRender, delay);
	});

	router.get('/medias', authMiddleware, (req, res) => {
		res.dispatch(populateAction({ medias: getMedias() }));
		setTimeout(res.universalRender, delay);
	});

	router.get('/messages', authMiddleware, (req, res) => {
		res.dispatch(populateAction({ messages: getMessages() }));
		setTimeout(res.universalRender, delay);
	});

	return router;

})(Router(), authActionMiddleware);
