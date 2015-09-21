require('babel/register');

var maker = require('./src/redux/maker');
var user = maker.user();

console.log(JSON.stringify({
	user: user,
	message: maker.message(user, user),
	media: maker.media('video'),
	post: maker.post(user)
}, null, 4));
