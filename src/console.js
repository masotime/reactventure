import defs from './defs';
import routes from './routes';

import render from './server/render';
import { html_beautify } from 'js-beautify';

export default function (url) {
	render(routes, url, (err, result) => {
		if (err) {
			console.error(err.stack);
		} else {
			console.log(html_beautify(result));
		}
	});
}