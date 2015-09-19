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

	return router;
}(express.Router()));

// we delegate rendering to a universal react catchall
app.use(routerMiddleware);
app.use('/*', (req, res) => {
	render(routes, req.url, (err, result) => {
		if (err) {
			res.send(`<pre>An error occurred trying to render ${req.url}.\n${err.stack}</pre>`);
		} else {
			res.send(result);
		}
	});
});

const server = app.listen(8000, () => {
	const started = server.address();
	console.log(`Example app listening at http:\/\/${started.address}:${started.port}`);
});