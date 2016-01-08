// taken from https://github.com/rackt/react-router/blob/master/docs/introduction/README.md
// this is effectively the "layout file"
import React from 'react';
import { Link } from 'react-router';

import StatusBar from './widgets/statusbar';

const Main = React.createClass({
	render() {
		return (
			<div>
				<h1 className="header">Universal Thinking</h1>
				<StatusBar />
				<ul className="nav">
					<li><Link to="/dashboard">Dashboard</Link></li>
					<li><Link to="/users">Users</Link></li>
					<li><Link to="/posts">Posts</Link></li>
					<li><Link to="/medias">Media</Link></li>
					<li><Link to="/messages">Messages</Link></li>
					<li><Link to="/about">About</Link></li>
				</ul>
				{this.props.children}
			</div>
		);
	}
});

export default Main;