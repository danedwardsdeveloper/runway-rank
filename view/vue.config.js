const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const webpack = require('webpack');

module.exports = {
	chainWebpack: (config) => {
		config.plugin('define').tap((definitions) => {
			Object.assign(definitions[0], {
				__VUE_OPTIONS_API__: 'true',
				__VUE_PROD_DEVTOOLS__: 'false',
				__VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
			});
			return definitions;
		});

		config.plugin('node-polyfill').use(NodePolyfillPlugin);

		config.plugin('provide').use(webpack.ProvidePlugin, [
			{
				process: 'process/browser',
			},
		]);
	},
	configureWebpack: {
		resolve: {
			fallback: {
				crypto: require.resolve('crypto-browserify'),
				buffer: require.resolve('buffer/'),
				stream: require.resolve('stream-browserify'),
				util: require.resolve('util/'),
				assert: require.resolve('assert/'),
				http: require.resolve('stream-http'),
				https: require.resolve('https-browserify'),
				os: require.resolve('os-browserify'),
				url: require.resolve('url/'),
			},
		},
	},
};
