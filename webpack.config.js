var webpack = require('webpack');
module.exports = {
    entry: {
        login: [
            'webpack/hot/only-dev-server',
            "./src/login.js"
        ],
        app: [
            'webpack/hot/only-dev-server',
            "./src/app.js"
        ]
    },
    output: {
        path: './build',
        filename: "[name].bundle.js"
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
            { test: /\.(css|less)$/, loader: 'style-loader!css-loader!postcss-loader!less-loader' },
            { test: /\.(png|jpg|jpeg|gif)$/, loader: 'url-loader?limit=10000&name=./images/[name].[ext]' },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                query:
                {
                    presets: ['react', 'es2015']
                }
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.json']
    },
    devServer: {
        hot: true,
        inline: true
    },
    plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.CommonsChunkPlugin('common.js')
    ]
};

