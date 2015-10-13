import React from 'react';
import { Users, Messages, Medias, Posts } from './crud/list';
import { connect } from 'react-redux';

const Dashboard = React.createClass({
	render() {
		return (
			<div>
				<h1>This dashboard has been updated to <code>react@0.14</code> and <code>react-router@1.0.0-rc3</code></h1>
				<p>Stats on the various entities should go here.</p>
			</div>
		);
	}
});

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

const UserButtons = React.createClass({
	render() {
		const props = this.props;
		return (<ul>
			{props.users.map(user => <li key={user.id}><button type="button">{user.username}</button></li> )}
		</ul>);
	}
});

const Login = React.createClass({
	render() {
		const props = this.props,
			hasUsers = props.users && props.users.length > 0;

		return (<div>
				<h2>{ hasUsers ? 'Select a user to login (no passwords wooo!)' : 'No users found. Guess you&rsquo;re out of luck'}</h2>
				<UserButtons users={props.users} />
		</div>);
	}
});

const pageOf = (title, ListComponent) => {
	return React.createClass({
		render() {
			const props = this.props;
			return (<div>
				<h1>List of {title}</h1>
				<ListComponent page={props.page} />
			</div>);
		}
	});
};

// react-redux stuff, as a combinator
const connected = (component, property) => {
	const stateMapper = state => {
		return {
			page: state[property]
		};
	};
	const connector = connect(stateMapper);

	return connector(component);
};

const [ UsersPage, MessagesPage, MediasPage, PostsPage ] = [ 
	connected(pageOf('Users', Users), 'users'),
	connected(pageOf('Messages', Messages), 'messages'),
	connected(pageOf('Medias', Medias), 'medias'),
	connected(pageOf('Posts', Posts), 'posts')
];

/* KIV for reference */
/*
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
*/

export default { About, Dashboard, Login: connect(state => ({users: state.users}))(Login), UsersPage, MessagesPage, MediasPage, PostsPage };
