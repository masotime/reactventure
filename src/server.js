import express from 'express';
import routes from './routes';
import render from './server/render';

console.log(`Initializing...`);

// all the webpack-hot-middleware stuff
import webpack from 'webpack';
import devMiddleware from 'webpack-dev-middleware';
import hotMiddleware from 'webpack-hot-middleware';

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

// define a route module to be used as middleware
const routerMiddleware = ((router) => {
	router.get('/', (req, res, next) => {
		console.log('Index page');
		next();
	});

	router.get('/about', (req, res, next) => {
		console.log('About page');
		next();
	});

	router.get('/inbox', (req, res, next) => {
		console.log('Inbox page');
		next();
	});

	router.get('/login', (req, res, next) => {
		console.log('Login page');
		next();
	})

	return router;
})(express.Router());

// add the hot middleware into the stack
import webpackConfig from '../webpack.config';
ignite(app, webpackConfig);

// we serve static files (really just the webpack bundle)
app.use(express.static('build/public'));

// we delegate rendering to a universal react catchall
app.use(routerMiddleware);
app.use('/*', (req, res) => {
	// DON'T USE req.url, it's part of http not express
	render(routes, req.originalUrl, (err, result) => {
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
	<body>${result.output}</body>
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