var webpack = require('webpack');
var path = require('path');
var APP_PATH = path.resolve(__dirname, 'app');
var BUILD_PATH = path.resolve(__dirname, 'build');
var plugins = [];

//生产环境
if (process.argv.indexOf('-p') > -1) {
    //编译成生产版本
    plugins.push(new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('production')
        }
    }));
}

module.exports = {
    devServer: {
        host: '0.0.0.0',
        port: 8229,
        inline: true,
        progress: true,
        stats: {
            colors: true
        }
    },
    entry: {
        // real: './app_real.js',
        demo: './app_demo.js',
    },
    output: {
        // publicPath,
        path: BUILD_PATH,
        //编译后的文件名字
        filename: '[name].js',
    },
    module: {
        loaders: [{
            test: /\.jsx?$/, // 匹配'js' or 'jsx' 后缀的文件类型
            exclude: /(node_modules|bower_components)/, // 排除某些文件
            loader: 'babel-loader',
            query: {
                presets: ['es2015']
            }
        }, {
            // 投放代码的前链样式
            test: /\.less/,
            include: APP_PATH + '/entry',
            loader: 'raw!less'
        }, {
            // 详情页的样式
            test: /\.less/,
            include: APP_PATH,
            exclude: APP_PATH + '/entry',
            loader: 'style!css!less'
        }]
    },
    plugins: plugins,
    resolve: {
        //后缀名自动补全
        extensions: ['.js', '.jsx'],
        alias: {
            
        }
    }
};
