// taken from https://github.com/rackt/react-router/blob/master/docs/introduction/README.md
// this is effectively the "layout file"
import React from 'react';
import { Link } from 'react-router';

const StatusBar = React.createClass({
	render() {
		const props = this.props;

		if (props.username) {
			return <h3>`You are logged in as ${props.username}`</h3>;
		} else {
			return <h3><Link to="/login">Click here</Link> to login.</h3>;
		}
	}
});

const App = React.createClass({
	render() {
		const props = this.props;

		return (
			<div>
				<h1>BenBook</h1>
				<StatusBar {...props.session} />
				<ul>
					<li><Link to="/dashboard">Dashboard</Link></li>
					<li><Link to="/users">Users</Link></li>
					<li><Link to="/posts">Posts</Link></li>
					<li><Link to="/media">Media</Link></li>
					<li><Link to="/messages">Messages</Link></li>
					<li><Link to="/about">About</Link></li>
				</ul>
				{this.props.children}
			</div>
		);
	}
});

export default App;