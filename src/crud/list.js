// "crud" components
import React from 'react';
import { User, Message, Media, Post } from './item';

// assume all list components will receive a "page" prop
// of data
const Users = React.createClass({
	render() {
		const props = this.props;

		return (
			<ul>{ props.page.map( user => <li><User {...user} /></li> ) }</ul>
		);
	}
});

const Messages = React.createClass({
	render() {
		const props = this.props;

		return (
			<ul>{ props.page.map( message => <li><Message {...message} /></li>)}</ul>
		);
	}
});

const Medias = React.createClass({
	render() {
		const props = this.props;

		return (
			<ul>{ props.page.map( media => <li><Media {...media} /></li>)}</ul>
		);
	}
});

const Posts = React.createClass({
	render() {
		const props = this.props;

		return (
			<ul>{ props.page.map( post => <li><Post {...post} /></li>)}</ul>
		);
	}
});

export default { Users, Messages, Medias, Posts };