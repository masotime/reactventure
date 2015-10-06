var webpack = require('webpack');
var path = require('path');

function ignite(config) {
  // adds all the webpack-hot-middleware stuff
  var newConfig = config; // can't make a clone, not sure why

  /* Add 'webpack-hot-middleware/client' into the
     entry array. This connects to the server to 
     receive notifications when the bundle rebuilds 
     and then updates your client bundle accordingly.
  */
  newConfig.entry.app = [
    'webpack-hot-middleware/client'
  ].concat(newConfig.entry.app);

  /* Occurence ensures consistent build hashes, hot
     module replacement is somewhat self-explanatory, 
     no errors is used to handle errors more cleanly.
  */
  newConfig.plugins = [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ].concat(newConfig.plugins);

  return newConfig;
}

// adds the weird new react-transform-hmr nonsense
function atomize(config) {
  const newConfig = config;

  newConfig.module.loaders.push({
    test: /\.jsx?$/,
    exclude: /node_modules/,
    loader: 'babel',
    query: {
      stage: 0,
      plugins: [ 'react-transform' ],
      extra: {
        'react-transform': {
          'transforms': [{
            transform: 'react-transform-hmr',
            imports: ['react'],
            locals: ['module']
          }]
        }
      }
    }

  });

  return newConfig;
}

var config = {
  entry: {
    app: [
      './src/client.js'
    ]
  },
  output: {
    path: path.join(__dirname, 'build', 'public', 'js'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      /*{
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: [ 'babel?optional[]=runtime&optional[]=es7.decorators&optional[]=es7.exportExtensions&stage=2' ]
      },*/
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }
    ]
  },
  resolve: {
    extensions: ['', '.jsx', '.js']
  },
  plugins: [
    // i still don't know what this is for
    new webpack.DefinePlugin({
      'process.env.NODE_DEVTOOLS': JSON.stringify(process.env.NODE_DEVTOOLS),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })
  ]
};

module.exports = ignite(atomize(config));
