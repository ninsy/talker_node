'use strict';
var path = require('path');
var webpack = require('webpack');

module.exports = {
    target: "node",
    entry: './index.js',
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'backend.js'
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.IgnorePlugin(/\.(md|json)?$/),
        new webpack.BannerPlugin('require("source-map-support").install();',
            { raw: true, entryOnly: false }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('dev')
        })
    ],
    module: {
        loaders: [{
            test: /\.js?$/,
            exclude: /node_modules/,
            loader: 'babel',
            query: {
                presets: ["es2015"]
            }
        }]
    },
    devtool: 'sourcemap',
};