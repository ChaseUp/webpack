var webpack = require("webpack");
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin("common.js");

module.exports = {
	//插件项
	plugins: [commonsPlugin],
	//页面入口文件配置
	entry: {
		index : "./src/js/index.js"
	},
	//入口文件输出配置
	output: {
		path: "dist/js",
		filename: "[name].js"
	},
	module: {
		//加载器配置
		loaders: [
			{ test: /\.css$/, loader: "style!css" },	//loader也可写成loaders: ["style","css"]
			{ 
				test: /\.js$/, 
				exclude: "/node_modules/",
				loader: "babel", 
				query: {presets: ["es2015","react"]} 
			},
			{ test: /\.(png|jpg)$/, loader: "url?limit=8192" }
		]
	},
	//其他解决方案
	resolve: {
		//查找module的话从这里开始查找
		root: 'E:/github/flux-example/src',	//绝对路径
		//自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
        extensions: ['', '.js', '.json', '.scss'],
        //模块别名定义，方便后续直接引用别名，无须多写长长的地址
        alias: {
            AppStore : 'js/stores/AppStores.js',
            ActionType : 'js/actions/ActionType.js',
            AppAction : 'js/actions/AppAction.js'
        }
	}
}