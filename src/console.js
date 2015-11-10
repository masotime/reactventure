import routesFactory from './routes';

import render from './server/render';
import { html_beautify } from 'js-beautify';

// everything redux related
import reducer from './redux/reducers'; // this adds the univesal reducers
import storeMaker from './redux/store'; // lol... i need to refactor this
const getStore = storeMaker(reducer);

import getDb from './lib/db';
export default function browse(url) {
	const store = getStore(getDb());
	const routes = routesFactory(store);

	render({ routes, location: url, store }, (err, result) => {
		if (err) {
			console.error('Rendering error');
			console.error(err.stack);
		} else {
			// deal with unexpected codes
			switch (result.code) {
				case 404: return console.log('Not found');
				case 302: return browse(result.url);
			}

			console.log('Rendering success');
			console.log(html_beautify(result.output));
		}
	});
}