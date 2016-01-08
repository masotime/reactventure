import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

const mapping = state => ({ name: state.auth.user });
const Dashboard = React.createClass({
	render() {
		const { name } = this.props;
		return (
			<div>
				<h1>A dashboard</h1>
				{ name ? <p>Hello {name}, welcome to your dashboard</p> : <p>Hey there, you should probably <Link to="/login">login</Link> first.</p> }
			</div>
		);
	}
});

export default connect(mapping)(Dashboard);