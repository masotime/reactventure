import React from 'react';
import { Users, Messages, Medias, Posts } from './crud/list';
import { connect } from 'react-redux';

// this is for creating actions
import { POST } from './redux/actions';

const Dashboard = React.createClass({
	render() {
		return (
			<div>
				<h1>This dashboard has been updated to <code>react@0.14.2</code> and <code>react-router@1.0.0-rc4</code></h1>
				<p>Stats on the various entities should go here.</p>
			</div>
		);
	}
});

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

const UserButtons = React.createClass({
	login(user) {
		const { dispatch } = this.props;
		const action = POST('/login')({ name: user.username, password: '' });
		return () => {
			console.log('Going to dispatch', action);
			dispatch(action)
		};
	},

	render() {
		const props = this.props;
		const handlers = {
			login: this.login // .bind(this) // ugh...
		};

		if (props.users) {
			return (<ul>
				{props.users.map(user => <li key={user.id}><button onClick={handlers.login(user)}type="button">{user.username}</button></li> )}
			</ul>);
		} else {
			return (<p>No users</p>);
		}
	}
});

const Login = React.createClass({
	render() {
		const props = this.props,
			dispatch = props.dispatch,
			hasUsers = props.users && props.users.length > 0;

		return (<div>
				<h2>{ hasUsers ? 'Select a user to login (no passwords wooo!)' : 'No users found. Guess you&rsquo;re out of luck'}</h2>
				<UserButtons dispatch={dispatch} users={props.users} />
		</div>);
	}
});

const Logout = React.createClass({
	render () {
		return (<div><h2>You have logged out</h2></div>);
	}
});

const pageOf = (title, ListComponent) => {
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
const connected = (component, property) => {
	const stateMapper = state => {
		return {
			page: state[property]
		};
	};
	const connector = connect(stateMapper);

	return connector(component);
};

const contentified = (component) => {
	return connect(state => ({content: state.content}))(component);
}

const [ UsersPage, MessagesPage, MediasPage, PostsPage ] = [ 
	connected(pageOf('Users', Users), 'users'),
	connected(pageOf('Messages', Messages), 'messages'),
	connected(pageOf('Medias', Medias), 'medias'),
	connected(pageOf('Posts', Posts), 'posts')
];

const [ AboutPage ] = [
	contentified(About)
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

export default { 
	About: AboutPage, Dashboard, // public pages
	Login: connect(state => ({users: state.users}))(Login), Logout, // auth related
	UsersPage, MessagesPage, MediasPage, PostsPage // protected pages
};
