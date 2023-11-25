const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const glob = require('glob');
function globEntries(globPath) {
    const entries = {};
    glob.sync(globPath).forEach((entry) => {
        const basename = path.basename(entry, path.extname(entry));
        entries[basename] = './' + entry;
    });
    return entries;
}
function globHtmlPlugins(globPath) {
    const plugins = [];
    glob.sync(globPath).forEach((file) => {
        const basename = path.basename(file, path.extname(file));
        plugins.push(
            new HtmlWebpackPlugin({
                template: file,
                filename: `${basename}.html`,
                chunks: [basename, 'style'],
                inject: 'head',
            })
        );
    });
    return plugins;
}
module.exports = {
    entry: {...globEntries('./src/css/**/*.css'),...globEntries('./src/js/**/*.js')},
    mode: process.env.NODE_ENV || 'development',
    devServer: {
        port: 3000,
        open: true,
        hot: true,
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'images',
                },
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },
    plugins: [
        ...globHtmlPlugins('./src/pages/**/*.html'),
        new MiniCssExtractPlugin({
            filename: 'styles.[contenthash].css',
        }),
        new CopyWebpackPlugin({
            patterns: [{ from: 'src/img', to: 'img' }],
        }),
    ],
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
    },
};
