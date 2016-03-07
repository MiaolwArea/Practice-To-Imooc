var express = require('express') //express主模块加载
var path = require('path') //页面有样式脚本等路径请求时，需要此模块
var mongoose = require('mongoose') //引入mongoose连接数据库
var cookieParser = require('cookie-parser')
var session = require('express-session')
var mongoStore = require('connect-mongo')(session)
var logger = require('morgan')
var serveStatic = require('serve-static')
var multipart = require('connect-multiparty');	// 混合提交中间件
var port = process.env.PORT || 3000 // 设置端口,process是全局变量用来获取环境中的变量以及我们所传入的参数
var app = express() //启动web服务器,将实例赋给变量app
var bodyParser=require('body-parser'); //导入格式化模块，并赋值
var dbUrl = 'mongodb://localhost/imooc'

mongoose.connect(dbUrl)
// models loading
var models_path = __dirname + '/app/models'
var walk = function(path){
	fs
		.readdirSync(path)
		.forEach(function(file){
			var newPath = path + '/' + file
			var stat = fs.statSync(newPath)

			if(stat.isFile()){
				if(/(.*)\.(js|coffee)/.test(file)){
					require(newPath)
				}
			}else if(stat.isDirectory){
				walk(newPath)
			}
		})
}
walk(models_path)

app.set('views','./app/views/pages') //设置视图路径
app.set('view engine','jade')	//设置模板引擎为jade
app.use(bodyParser.urlencoded({extended: true})); //将提交表单的数据进行格式化处理
app.use(serveStatic(path.join(__dirname, 'public')))	//静态资源获取，join来拼接路径__dirname为当前目录
app.use(cookieParser())		//secret是为了防止篡改cookie，注意use顺序
app.use(multipart())	// 混合提交中间件
app.use(session({
  	secret: 'imooc',
  	store: new mongoStore({
		url: dbUrl,
		collection: 'sessions'
	}),
	resave: false,
	saveUninitialized: true
}))
// 判断不同环境，进行特定配置
var env = process.env.NODE_ENV || 'development'

if('development' === env){
	app.set('showStackError', true) // 使错误信息能在屏幕上打印出来
	app.use(logger(':method :url :status')) //输出的信息领域
	app.locals.pretty = true // 格式化输出样式
	// mongoose.set('debug', true) // 输出数据库的信息
}
require('./config/routes')(app);
app.locals.moment = require('moment')
app.listen(port) 		// 端口监听

console.log('imooc started on port:'+port);


