import React from 'react';
import { contentified } from '../meta/index';

const About = React.createClass({
	render() {
		const props = this.props;
		return (
			<div>
				<h2>{props.content.header}</h2>
				<p>{props.content.body}</p>
			</div>
		);
	}
});

export default contentified(About);