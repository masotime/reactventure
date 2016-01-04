import express from 'express';

console.log(`Server initializing...`);

const app = express();

// add the hot middleware into the stack
import ignite from './lib/ignite'; // this adds webpack hot loading
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

// we prepare a store creation function with a reducer and server-side specific middleware
import rootReducer from './redux/reducers'; // this adds the univesal reducers
import routes from './routes';
import { server as redouter } from 'redouter';
app.use(redouter.redouter({
	rootReducer, initialState: {}, routes
}));

// for any request, we either force the creation of an action or
// we augment the existing one with auth information (if it is present
// in the cookie but not included)
//
// once done, we define a req.action which express routes will use to
// do further processing.
import { authSync } from './lib/jwt';
app.use(authSync);

// we apply express routes
import { basicRoutes, securedRoutes, authRoutes } from './server/routes';
app.use(basicRoutes);
app.use(securedRoutes);
app.use(authRoutes);

import errorHandler from './server/middleware/error';
app.use(errorHandler);

const server = app.listen(8000, () => {
	const started = server.address();
	console.log(`Example app listening at http://${started.address}:${started.port}`);
});