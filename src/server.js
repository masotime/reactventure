import express from 'express';
import routes from './routes';
import render from './server/render';

// all the webpack-hot-middleware stuff
import webpack from 'webpack';
import devMiddleware from 'webpack-dev-middleware';
import hotMiddleware from 'webpack-hot-middleware';

console.log(`Server initializing...`);

const app = express();

// assumes "webpack", "devMiddleware" and "hotMiddleware" are in closure
const ignite = (app, config) => {
	const compiler = webpack(config);
	app.use(devMiddleware(compiler, {
		noInfo: true,
		publicPath: config.output.publicPath
	}));

	app.use(hotMiddleware(compiler));
}

// these are basic routes, without security
const basicRoutes = ((router) => {
	router.get('/', (req, res, next) => {
		console.log('Index page');
		next();
	});

	router.get('/about', (req, res, next) => {
		console.log('About page');
		next();
	});

	router.get('/login', (req, res, next) => {
		console.log('Login page');
		next();
	});


	return router;
})(express.Router());

// we introduce secured routes. 
// see https://auth0.com/blog/2015/09/28/5-steps-to-add-modern-authentication-to-legacy-apps-using-jwts/
import { authenticate, generate } from './lib/jwt';
import moment from 'moment';
const securedRoutes = ((router, generate, authenticate) => {

	// this route does the acutal login stuff
	// NOTE: This doesn't check to see if the user_id is actually an existing one!
	router.post('/login', (req, res) => {
		const id_token = generate({ user_id: req.body.user_id });
		res.json({ id_token });
	});

	// this route checks the header for a valid jwt and 
	// sets an appropriate cookie. "authenticate" adds
	// the token to the body which we will retrieve
	router.post('/authorize-cookie', authenticate, (req, res) => {
		res.cookie('id_token', req.body.token, {
			expires: moment().add(1, 'hour'),
			httpOnly: true
		});
		res.json({ message: 'Cookie set!' });
	});

	router.get('/users', authenticate, (req, res, next) => {
		console.log('Users page');
		next();
	});

	router.get('/posts', authenticate, (req, res, next) => {
		console.log('Posts page');
		next();
	});

	router.get('/media', authenticate, (req, res, next) => {
		console.log('Media page');
		next();
	});

	router.get('/messages', authenticate, (req, res, next) => {
		console.log('Messages page');
		next();
	});

	return router;

})(express.Router(), generate, authenticate);

// add the hot middleware into the stack
import webpackConfig from '../webpack.config';
ignite(app, webpackConfig);

// add cookies and body-parser (JSON and text) into the stack
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.text());

// we serve static files (really just the webpack bundle)
app.use(express.static('build/public'));

// we delegate rendering to a universal react catchall
app.use(basicRoutes);
app.use(securedRoutes);
app.use('/*', (req, res) => {
	// DON'T USE req.url, it's part of http not express
	render({ routes, location: req.originalUrl, state: req.session.state}, (err, result) => {
		if (err) {
			return res.status(500).send(err);
		} else if (result.code === 302) {
			return res.status(302).redirect(result.url);
		} else if (result.code === 404) {
			return res.status(404).end();
		} else {
			// the whole __INITIAL_STATE__ thing is from https://goo.gl/bOrXPH
			return res.status(200).send(`
<!doctype html>
<html>
	<head></head>
	<!-- I give up - it is way too troublesome to not render into an outer container -->
	<body><div id="react-container">${result.output}</div></body>
	<!-- Hydration -->
	<script>window.__INITIAL_STATE__ = ${JSON.stringify(result.state)}</script>
	<script src="js/bundle.js"></script>
</html>
			`);
		}
	});
});

const server = app.listen(8000, () => {
	const started = server.address();
	console.log(`Example app listening at http:\/\/${started.address}:${started.port}`);
});