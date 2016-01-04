import React from 'react';
import { Users, Messages, Medias, Posts } from './crud/list';
import { connect } from 'react-redux';
import { Link } from 'react-router';

// this is for creating actions
import { POST, fieldUpdateAction } from './redux/actions';

const Dashboard = connect(
		(state) => ({ name: state.auth.user })
	)( React.createClass({
	render() {
		const { name } = this.props;
		return (
			<div>
				<h1>A dashboard</h1>
				{ name ? <p>Hello {name}, welcome to your dashboard</p> : <p>Hey there, you should probably <Link to="/login">login</Link> first.</p> }
			</div>
		);
	}
}));

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

const Login = React.createClass({

	render() {
		const props = this.props,
			dispatch = props.dispatch,
			hasUsers = props.users && props.users.length > 0;

		const events = {
			onSubmit: (e) => {
				e.preventDefault();
				dispatch(POST('/login')({ name: props.loginform.username, password: props.loginform.password }));
			},
			name: {
				onChange: e => dispatch(fieldUpdateAction('loginform.username', e.target.value))
			},
			password: {
				onChange: e => dispatch(fieldUpdateAction('loginform.password', e.target.value))
			}
		}

		return (
			<div>
				<h2>{ hasUsers ? 'Select a user to login (no passwords wooo!)' : 'No users found. Guess you&rsquo;re out of luck'}</h2>
				<ul>
					{ props.users.map( (user) => <li key={user.username}><span>{user.username}</span></li> ) }
				</ul>
				<form onSubmit={events.onSubmit} >
					<div><label>username</label><input type="text" name="username" value={props.loginform.username} onChange={events.name.onChange} /></div>
					<div><label>password</label><input type="password" name="password" value={props.loginform.password} onChange={events.password.onChange} /></div>
					<button type="submit">Submit</button>
				</form>
			</div>
		);
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

import weitify from './weitify';
const [ UsersPage, MessagesPage, MediasPage, PostsPage ] = [ 
	weitify(connected(pageOf('Users', Users), 'users')),
	weitify(connected(pageOf('Messages', Messages), 'messages')),
	weitify(connected(pageOf('Medias', Medias), 'medias')),
	weitify(connected(pageOf('Posts', Posts), 'posts'))
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
	Login: weitify(connect( ({users, loginform}) => ({users, loginform}) )(Login)), Logout, // auth related
	UsersPage, MessagesPage, MediasPage, PostsPage // protected pages
};
