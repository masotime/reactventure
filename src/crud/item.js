import React from 'react';

const User = React.createClass({
	render() {
		// assume that it takes all the props
		// of a user object, i.e. 
		// id, email, firstname, lastname, username
		const props = this.props;

		return (
			<dl>
				<dt>ID</dt><dd>{props.id}</dd>
				<dt>E-mail</dt><dd>{props.email}</dd>
				<dt>Name</dt><dd>{props.firstname} {props.lastname}</dd>
				<dt>Username</dt><dd>{props.username}</dd>
			</dl>
		);
	}
});

const Message = React.createClass({
	render() {
		// assume that it will have 2 entities in the
		// props, from{user}, to{user} as well as the message itself
		const props = this.props;

		return (
			<div>
				<span>{props.from.firstname}</span>
				<p>{props.message}</p>
			</div>
		);
	}
});

/* various media types */
const Video = React.createClass({
	render() {
		const props = this.props;
		return (<video src={props.src} poster={props.poster} />);
	}
});

const Image = React.createClass({
	render() {
		const props = this.props;
		return (<img src={props.src} />);
	}
});

const Paragraph = React.createClass({
	render() {
		const props = this.props;
		return (<p>{props.text}</p>);
	}
});

const Media = React.createClass({
	render() {
		// props are id, type and data
		// render differently depending on the type
		const props = this.props;

		// figure out a more elegant way later
		let mediaEl;
		switch (props.type) {
			case 'paragraph': mediaEl = <Paragraph text={props.data} />; break;
			case 'video': mediaEl = <Video src={props.data} />; break;
			case 'image': mediaEl = <Image src={props.data} />; break;
		}

		return (<div>{mediaEl}</div>);
	}

});

const Post = React.createClass({
	render() {
		// props are id, user{user}, medias[]{media}
		const props = this.props;

		return (
			<div>
				<span>{props.user.firstname}</span>
				{props.medias.map( media => <Media {...media} />)}
			</div>
		);
	}
});

export default { User, Message, Media, Post };