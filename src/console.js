import routes from './routes';

import render from './server/render';
import { html_beautify } from 'js-beautify';

import reducer from './redux/reducers'; // this adds the univesal reducers
import getDb from './lib/db';

export default function (url) {
	render({ routes, location: url, reducer, state: getDb() }, (err, result) => {
		if (err) {
			console.error(err.stack);
		} else {
			console.log(html_beautify(result.output));
		}
	});
}