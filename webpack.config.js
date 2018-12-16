const webpack = require('webpack');
const path = require('path');

module.exports = {
  context: path.resolve(__dirname, 'public'),
	entry: './js/index',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js',
	},
  mode: 'development',
  module: {
		rules: [
			{
				test: /\.js/,
				exclude: /(node_modules)/,
				use: ["babel-loader"]
			},
			{
				test: /\.(css|scss)$/,
				loaders: ['style-loader', 'css-loader', 'sass-loader']
			},
			{ test: /\.(eot|svg|woff|ttf|gif|jpg|png)$/, loader: 'url-loader'}
		]
	},
  resolve: {
		extensions: ["*", ".js", ".css"],
		alias: {
			slick: path.resolve(__dirname, 'node_modules/slick-carousel/slick/')
		}
	},
	plugins: [
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery",
			"window.jQuery": "jquery'",
      "window.$": "jquery"
		})
	],
	performance: {
		maxEntrypointSize: 500000,
		maxAssetSize: 500000
  }
};