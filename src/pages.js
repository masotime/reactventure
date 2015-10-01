import React from 'react';
import { Users, Messages, Medias, Posts } from './crud/list';

const Dashboard = React.createClass({
	render() {
		return (
			<div>
				<h1>This is a dashboard</h1>
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

const Login = React.createClass({
	render() {
		const props = this.props;
		return (<div>
			{
				props.users ? <UserButtons users={props.users} /> : <span>No users found. Guess you&rsquo;re out of luck</span>
			}
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

const [ UsersPage, MessagesPage, MediasPage, PostsPage ] = [ 
	pageOf('Users', Users),
	pageOf('Messages', Messages),
	pageOf('Medias', Medias),
	pageOf('Posts', Posts)
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


export { About,	Dashboard, Login, UsersPage, MessagesPage, MediasPage, PostsPage };