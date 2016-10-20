var webpack = require('webpack');
module.exports = {
    entry: {
        login: [
            'webpack/hot/only-dev-server',
            "./js/login.js"
        ],
        app: [
            'webpack/hot/only-dev-server',
            "./js/app.js"
        ]
    },
    output: {
        path: './build',
        filename: "[name].bundle.js"
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
            { test: /\.css$/, loader: "style!css" },
            { test: /\.less/, loader: 'style-loader!css-loader!less-loader' },
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

