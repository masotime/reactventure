import defs from './defs';
import routes from './routes';

import render from './server/render';

render(routes, '/inbox/messages/1', (err, result) => {
	if (err) {
		console.error(err.stack);
	} else {
		console.log(result);
	}
});