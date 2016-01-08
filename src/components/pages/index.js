import Dashboard from './dashboard';
import About from './about';
import Login from './login';
import Logout from './logout';
import listComponents from '../data/list';

import { weitify, pageOf, connected } from '../meta/index';

export { Dashboard, About, Login, Logout };
export const Users = weitify(connected(pageOf('Users', listComponents.Users), 'users'));
export const Messages = weitify(connected(pageOf('Messages', listComponents.Messages), 'messages'));
export const Medias = weitify(connected(pageOf('Medias', listComponents.Medias), 'medias'));
export const Posts = weitify(connected(pageOf('Posts', listComponents.Posts), 'posts'));
