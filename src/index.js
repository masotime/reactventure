import defs from './defs';
import routes from './routes';

import render from './server/render';

render(routes, '/', (err, result) => {
	if (err) {
		console.error(err.stack);
	} else {
		console.log(result);
	}
});