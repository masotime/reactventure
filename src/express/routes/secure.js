import { Router } from 'express';
import { populateAction } from '../../redux/actions';
import dal from '../../services/dal';

// these are secured routes
import { authActionMiddleware } from '../middleware/security';

const router = Router();
const delay = 1000;

router.get('/users', authActionMiddleware, (req, res) => {
	res.dispatch(populateAction({ users: dal.users() }));
	setTimeout(res.universalRender, delay);
});

router.get('/posts', authActionMiddleware, (req, res) => {
	res.dispatch(populateAction({ posts: dal.posts() }));
	setTimeout(res.universalRender, delay);
});

router.get('/medias', authActionMiddleware, (req, res) => {
	res.dispatch(populateAction({ medias: dal.medias() }));
	setTimeout(res.universalRender, delay);
});

router.get('/messages', authActionMiddleware, (req, res) => {
	res.dispatch(populateAction({ messages: dal.messages() }));
	setTimeout(res.universalRender, delay);
});

export default router;