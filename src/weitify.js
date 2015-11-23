// provides "weitification" services
// assumes store will have a "freshness" property.
import { connect } from 'react-redux';
import React from 'react';

// crude way to get location
const getLocation = () => {
	// I must do this, because I'll get uncaughtReferenceError
	// even if I attempt an undefined test.
	try { 
		return window.location; // eslint-disable-line no-undef
	} catch (e) {
		// probably server-side
		return {
			href: '', // whole url
			pathname: '', // e.g. /one/two/fruit.html
			hash: '', // e.g. #pineapple
			search: '' // e.g. ?color=red
		}; 
	}
}

const getFreshness = (props = { freshness: {} }, pathname = '') => {
	return props.freshness[pathname] || { state: 'success', timestamp: Date.now() };
}

// this assumes that the store will contain a map "freshness"
// mapping pathnames to an object containing
// * .state - "pending" / "success" / "failure"
// * .timestamp
// TODO: Customized weitification?
const weitify = AsyncRoute => {

	return connect( 
		({freshness}) => ({freshness}) 
	)(React.createClass({
		render() {
			const props = this.props;
			const freshness = getFreshness(props, getLocation().pathname);
			// render different things based on whether or not the page is still loading

			switch (freshness.state) {
				case 'success': return <AsyncRoute {...props} />;
				case 'failure': return <div>FAILED TO LOAD!!!</div>;
				case 'pending': return <div>Please WEIT....</div>;
			}
		}
	}));
};

export default weitify;