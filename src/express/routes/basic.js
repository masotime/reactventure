import { Router } from 'express';
import { populateAction } from '../../redux/actions';
import { users as getUsers } from '../../services/dal';

// these are basic routes, without security
const router = Router();

router.get('/', (req, res) => {
	res.universalRedirect('/dashboard');
});

router.get('/dashboard', (req, res) => {
	res.universalRender();
});

router.get('/about', (req, res) => {
	res.dispatch(populateAction({
		content: {
			header: 'About this site',
			body: 'This is a demo project utilizing the res.dispatch() and ROUTE action concepts'
		}
	}));
	res.universalRender();
});

router.get('/login', (req, res) => {
	res.dispatch(populateAction({
		users: getUsers().map(({username}) => ({username}))
	}));
	res.dispatch(populateAction({
		loginform: { username: '', password: '' }
	}));
	res.universalRender();
});

export default router;