// taken from https://github.com/rackt/react-router/blob/master/docs/introduction/README.md
import React from 'react';
import { Link } from 'react-router';
import { inspect } from 'util';

const About = React.createClass({
	render() {
		return (
			<div>
				<h2>This is an about!</h2>
				<p>About meeeeee....!!!!</p>
			</div>
		);
	}
});

const Message = React.createClass({
	render() {
		const props = this.props;
		const params = props.params;

		return <h3>Message {params.id}</h3>;
	}
});

const Inbox = React.createClass({
	render() {
		return (
			<div>
				<h2>Inbox</h2>
				{this.props.children || <p>Welcome to your inbox</p>}
			</div>
		);
	}
});

const StatusBar = React.createClass({
	render() {
		const props = this.props;

		return <h3>(props.username ? `You are logged in as ${props.username}` : `${<Link to="/login">Click here</Link>} to login.`</h3>;
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
					<li><Link to="/posts">Posts</Link></li>
					<li><Link to="/media">Media</Link></li>
					<li><Link to="/inbox">Inbox</Link></li>
				</ul>
				{this.props.children}
			</div>
		);
	}
});

const Dashboard = React.createClass({
	render() {
		return (
			<div>
				<h1>This is a dashboard</h1>
				<p>Whoop de doo</p>
			</div>
		);
	}

});

export { About,	Message, Inbox, App, Dashboard };