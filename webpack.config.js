'use strict';
var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './index.js',
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'backend.js'
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.IgnorePlugin(/\.(md|json)?$/),
        new webpack.BannerPlugin('require("source-map-support").install();',
            {raw: true, entryOnly: false}),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('dev')
        })
    ],
    module: {
        loaders: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ["es2015"]
                },
            },
            {include: /\.json$/, loaders: ["json-loader"]},
        ],
    },
    target: 'node',
    devtool: 'sourcemap',
};