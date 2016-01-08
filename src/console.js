import routes from './components/routes';

import { universal } from 'redouter';
import { html_beautify } from 'js-beautify';

// everything redux related
import { rootReducer } from './redux/index';

const { createStore, createHistory, createRouterComponent, render } = universal;

export default function browse(url) {
	const store = createStore({ reducer: rootReducer });
	const history = createHistory(url);

	createRouterComponent(routes, history, (err, Component) => {
		if (err) {
			switch (err.constructor.name) {
				case 'NotFoundError': console.error(`404 NOT FOUND ${url}`); break;
				case 'RedirectError': console.error(`302 REDIRECT ${err.url}`); break;
				case 'ServerError': console.error(`500 ERROR ${err.error}`); break;
				default: console.error(err);
			}
		} else {
			const output = render(Component, store);
			console.log('200 OK');
			console.log(html_beautify(output));
		}
	});
}