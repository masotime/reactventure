import React from 'react';
import { connect } from 'react-redux';

export { default as weitify } from './weitify';
export const pageOf = (title, ListComponent) => {
	return React.createClass({
		render() {
			const props = this.props;

			if (props.page) {
				return (<div>
					<h1>List of {title}</h1>
					<ListComponent page={props.page} />
				</div>);
			} else {
				return (<p>There are no {title} to display</p>);
			}
		}
	});
};

// react-redux stuff, as a combinator
export const connected = (component, property) => {
	const stateMapper = state => {
		return {
			page: state[property]
		};
	};
	const connector = connect(stateMapper);

	return connector(component);
};

export const contentified = (component) => {
	return connect(state => ({content: state.content}))(component);
}

