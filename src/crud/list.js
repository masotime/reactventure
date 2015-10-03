// "crud" components
import React from 'react';
import { User, Message, Media, Post } from './item';

// assume all list components will receive a "page" prop
// of data
const Users = React.createClass({
	render() {
		const props = this.props;

		return (
			<ul>{ props.page.map( user => <li key={user.id}><User {...user} /></li> ) }</ul>
		);
	}
});

const Messages = React.createClass({
	render() {
		const props = this.props;

		return (
			<ul>{ props.page.map( message => <li key={message.id}><Message {...message} /></li>)}</ul>
		);
	}
});

const Medias = React.createClass({
	render() {
		const props = this.props;

		return (
			<ul>{ props.page.map( media => <li key={media.id}><Media {...media} /></li>)}</ul>
		);
	}
});

const Posts = React.createClass({
	render() {
		const props = this.props;

		return (
			<ul>{ props.page.map( post => <li key={post.id}><Post {...post} /></li>)}</ul>
		);
	}
});

export default { Users, Messages, Medias, Posts };