import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

const mapping = state => ({username: state.auth.user});

const StatusBar = React.createClass({
	render() {
		const props = this.props;

		if (props.username) {
			return <h3>{`You are logged in as ${props.username}`}. <Link to="/logout">Logout</Link></h3>;
		} else {
			return <h3><Link to="/login">Click here</Link> to login.</h3>;
		}
	}
});

export default connect(mapping)(StatusBar);