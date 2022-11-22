module.exports = {
	// 'parser': 'babel-eslint',
	'env': {
		'browser': true,
		'commonjs': true,
		'node': true,
		'es6': true,
		'es2021': true
	},
	'extends': 'eslint:recommended',
	'overrides': [
	],
	'parserOptions': {
		'ecmaVersion': 2018,
		'ecmaFeatures': {
			'experimentalObjectRestSpread': true
		}
	},
	'rules': {
		'indent': [
			'error',
			'tab'
		],
		'linebreak-style': [
			'error',
			'windows'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'always'
		]
	}
};
