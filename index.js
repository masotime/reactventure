// most basic functionality - render to console. Pass in the route as an command-line argument.
var path = process.argv[2] || '/';
console.log('Rendering route %s to console', path);

require('babel/register');
require('./src/console')(path);