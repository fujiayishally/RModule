const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const packageJson = require('./package.json');
const bannerText =
		`RModule.js v-${packageJson.version}\n` +
		`(c) 2018-${new Date().getFullYear()} ${packageJson.author}\n` +
		`${packageJson.repository.url}`;

module.exports = {
	mode: 'development',
	entry: {
		'RModule': './src/index.ts'
	},
	output: {
		filename: 'RModule.js',
		path: path.resolve(__dirname, 'dist/js')
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js"]
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				use: {
					loader: "ts-loader",
					options: {
						transpileOnly: true,
					}
				}
			}
		]
	},
	plugins: [
		new webpack.BannerPlugin(bannerText),
		new webpack.NamedModulesPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new CleanWebpackPlugin()
	],
	// devtool: 'inline-source-map',
	devServer: {
		port: 8888,
		compress: true,
		contentBase: './dist',
		clientLogLevel: "none",
		stats: "errors-only"
	}
};