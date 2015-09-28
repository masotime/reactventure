import express from 'express';
import routes from './routes';
import render from './server/render';

console.log(`Initializing...`);

const app = express();

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
			return res.status(200).send(`
<!doctype html>
<html>
	<head></head>
	<body>${result.output}</body>
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