// all the webpack-hot-middleware stuff
import webpack from 'webpack';
import devMiddleware from 'webpack-dev-middleware';
import hotMiddleware from 'webpack-hot-middleware';

const ignite = (app, config) => {
	// assumes "webpack", "devMiddleware" and "hotMiddleware" are in closure
	const compiler = webpack(config);
	app.use(devMiddleware(compiler, {
		noInfo: true,
		publicPath: config.output.publicPath
	}));

	app.use(hotMiddleware(compiler));
}

export default ignite;