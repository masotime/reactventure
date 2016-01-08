import React from 'react';
import { connect } from 'react-redux';
import { fieldUpdateAction } from '../../redux/actions';
import { helpers } from 'route-action';
import { weitify } from '../meta/index';

const { POST } = helpers;

const mapping = ({users, loginform}) => ({users, loginform});
const Login = React.createClass({

	render() {
		const props = this.props,
			dispatch = props.dispatch,
			hasUsers = props.users && props.users.length > 0;

		const events = {
			onSubmit: (e) => {
				e.preventDefault();
				dispatch(POST({
					url: '/login',
					body: { 
						name: props.loginform.username, 
						password: props.loginform.password 
					}
				}));
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

export default weitify(connect(mapping)(Login));