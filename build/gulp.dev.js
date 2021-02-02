const gulp = require("gulp");
// js
const Jshint = require("gulp-jshint"); //js检查
// css
const Less = require("gulp-less"); // 编译less
const Autoprefixer = require("gulp-autoprefixer"); // 添加 CSS 浏览器前缀
// html
const FileInclude = require("gulp-file-include"); // 文件模块化  可引入公共文件
// server
const Connect = require("gulp-connect"); //引入gulp-connect模块
const { createProxyMiddleware } = require("http-proxy-middleware"); //代理配置  新版proxy改为createProxyMiddleware了

const Clean = require("gulp-clean"); // 清理目录
const Replace = require('gulp-replace');        //替换html内容
// 配置文件
const config = require("./config.dev");


// html编译 html 文件并复制字体
async function html() {
    return await gulp.src(config.src + "/views/*.html")
        .pipe(FileInclude({
            // HTML模板替换，具体查看资料
            prefix: "@@", //变量前缀 @@include
            basepath: config.src + "/views", //引用文件路径
            indent: true, //保留文件的缩进
        }))
        .pipe(Replace(config.replace_reg, function(match) {
            return config['replace'][match];
        }))
        .on("error", function (err) {
            console.error("Task:copy-html,", err.message);
            this.end();
        })
        .pipe(gulp.dest(config.dist)) // 拷贝
        .pipe(Connect.reload())   //为什么要reload呢？
}

// css 编译less 文件 并加入浏览器前缀
async function css() {
    return await gulp.src(config.src + "/css/*.less")
        .pipe(Replace(config.replace_reg, function(match) {
            return config['replace'][match];
        }))
        .pipe(Less()) //编译less
        .pipe(Autoprefixer({
                cascade: true, //是否美化属性值 默认：true 像这样：
                //-webkit-transform: rotate(30deg);
                //        transform: rotate(30deg);
                remove: true, //是否去掉不必要的前缀 默认：true
        }))
        .pipe(gulp.dest(config.dist + "/css")) //当前对应css文件
        .pipe(Connect.reload());//更新
}

// js 检查js文件并拷贝
async function js() {
    return await gulp.src(config.src + "/js/**")
        .pipe(Jshint()) //检查代码
        .on("error", function (err) {
            console.error("Task:js,", err.toString());
        })
        .pipe(gulp.dest(config.dist + "/js")) // 拷贝
        .pipe(Connect.reload()); //更新
}

// 拷贝image文件
async function image() {
    return await gulp.src(config.src + "/images/*").pipe(gulp.dest(config.dist + "/images"));
}

// clean 清空dist文件内容
async function clean() {
    // 不设置allowEmpty: true会报File not found with singular glob
    return await gulp.src(config.dist, { allowEmpty: true }).pipe(Clean());
}

//多个代理时先处理 代理数组  单个代理时在server直接写就行
var proxy_arr = Object.keys(config.proxy).map(function(d) {
    return createProxyMiddleware(d, config.proxy[d]);
});

// 服务器函数
async function server() {
    return await Connect.server({
        root: config.dist, //根目录
        // ip:'192.168.11.62',//默认localhost:8080
        livereload: true, //自动更新
        port: config.port || 8089, //端口
        middleware: function (connect, opt) {
            return proxy_arr;
            //单个代理直接使用下面的 直接写
            // return [
            //     createProxyMiddleware("/api", {
            //         target: "http://localhost:8080",
            //         changeOrigin: true,
            //         pathRewrite: {
            //             '^/api/' : '',     // rewrite path 
            //         },
            //     })
            // ];
        },
    });
}



module.exports = {
    html,
    css,
    js, 
    image,
    clean,
    server,
};
