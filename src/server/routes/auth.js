// these are authentication routes
// see https://auth0.com/blog/2015/09/28/5-steps-to-add-modern-authentication-to-legacy-apps-using-jwts/
import { Router } from 'express';
import { auth, generate, addTokenCookie, logout } from '../../lib/jwt';
import { populateAction } from '../../redux/actions';
export default ((router, auth, generate) => {

	// this route does the actual login stuff
	router.post('/login', (req, res) => {
		const action = req.action;
		const user = auth(action.body.name, action.body.password);
		if (user) {
			const payload = { user_id: user.id };
			const authAction = {
				type: 'AUTHENTICATE',
				token: generate(payload),
				name: user.username
			};
			res.dispatch(authAction);
			addTokenCookie(res, payload); // add it to the client cookie as well, HTTP Only
			return res.universalRedirect('/dashboard');
		} else {
			res.dispatch({
				type: 'AUTHENTICATE_FAILED',
				error: 'Authentication failed'
			});
			res.dispatch(populateAction({
				loginform: {
					username: action.body.name,
					password: ''
				}
			}));
			return res.universalRender();
		}
	});

	router.get('/logout', (req, res) => {
		logout(res);
		res.dispatch({ type: 'LOGOUT' });
		res.universalRedirect('/about');
	});

	return router;

})(Router(), auth, generate);