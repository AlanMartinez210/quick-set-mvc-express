const webpack = require('webpack');
const path = require('path');

const TerserPlugin = require('terser-webpack-plugin');
const webpackConfig = {
	context: path.resolve(__dirname, 'public'),
	entry: './js/index',
	output: {
		path: path.resolve(__dirname, 'public'),
		filename: 'bundle.js',
	},
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
			slick: path.resolve(__dirname, 'node_modules/slick-carousel/slick/'),
			cropper: path.resolve(__dirname, 'node_modules/cropperjs/')
		}
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.browser': 'true'
		}),
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery",
			"window.jQuery": "jquery'",
			"window.$": "jquery"
		}),
	]
}

module.exports = (env, argv) => {
	
	const is_production = argv.mode === 'production';

	webpackConfig.mode = is_production ? argv.mode : 'development';
	webpackConfig.devtool = is_production ? 'none' : 'eval';

	if(is_production){
		webpackConfig.optimization = {
			minimizer: [
				new TerserPlugin({
					terserOptions: {
						compress: {drop_console: true}
					}
				})
			],
		};

		webpackConfig.performance = {
			maxEntrypointSize: 500000,
			maxAssetSize: 500000
		};
	}

	return webpackConfig
};