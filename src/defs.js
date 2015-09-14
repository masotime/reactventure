// taken from https://github.com/rackt/react-router/blob/master/docs/introduction/README.md
import React from 'react';
import { Link } from 'react-router';

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

const App = React.createClass({
	render() {
		return (
			<div>
				<h1>App</h1>
				<ul>
					<li><Link to="/about">About</Link></li>
					<li><Link to="/inbox">Inbox</Link></li>
				</ul>

				{this.props.children}
			</div>
		);
	}
});

export { About,	Message, Inbox, App };