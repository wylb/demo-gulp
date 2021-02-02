const gulp = require('gulp');
// js
const Jshint = require("gulp-jshint"); //js检查
const Uglify = require('gulp-uglify');          // 压缩js
// css
const Minifycss = require('gulp-minify-css');   // 压缩css
const Less = require('gulp-less');              // 编译less
const Autoprefixer = require('gulp-autoprefixer');  // 浏览器前缀
// html
const MinifyHtml = require("gulp-minify-html"); //压缩html
const FileInclude = require('gulp-file-include'); // 文件模块化
// image
const Imagemin = require('gulp-imagemin');
const Cache = require('gulp-cache'); 

const Clean = require('gulp-clean');            // 清理目录
const Replace = require('gulp-replace');        //替换html内容

// md5 发版本的时候为了避免浏览器读取旧的缓存文件，需要为其添加md5戳
const md5 = require("gulp-md5-plus");

const config = require('./config.prod');

// html编译 html 文件并复制字体
async function html() {
    return await gulp.src(config.src + '/views/*.html')
        .pipe(FileInclude({ // HTML模板替换，具体用法见下文
            // HTML模板替换，具体查看资料
            prefix: "@@", //变量前缀 @@include
            basepath: config.src + "/views", //引用文件路径
            indent: true, //保留文件的缩进
        }))
        .pipe(Replace(config.replace_reg, function(match) {
            return config['replace'][match];
        }))
        .pipe(MinifyHtml())
        .on('error', function(err) {
            console.error('Task:copy-html,', err.message);
            this.end();
        })
        .pipe(gulp.dest(config.dist)) // 拷贝 
}

// css 编译less 文件 并压缩，加入浏览器前缀
async function css() {
    return await gulp.src(config.src + '/css/**')
        .pipe(Replace(config.replace_reg, function(match) {
            return config['replace'][match];
        }))
        .pipe(Less())       //编译less
        .pipe(Autoprefixer({
            cascade: true, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(30deg);
            //        transform: rotate(30deg);
            remove: true //是否去掉不必要的前缀 默认：true
        }))
        .pipe(Minifycss({   // 压缩css
            //类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
            advanced: true,
            //保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
            compatibility: '',
            //类型：Boolean 默认：false [是否保留换行]
            keepBreaks: false,
            //保留所有特殊前缀 当你用autoprefixer生成浏览器前缀，如果不加这个参数，可能将会删除你的部分前缀        
            keepSpecialComments: '*'
        }))
        .pipe(gulp.dest(config.dist + '/css'))
        .pipe(md5(10, config.dist + '/*.html', {
            mappingFile: 'manifest.json',
            connector: '.' // 文件名和hash的连接符
        }))
        .pipe(gulp.dest(config.dist + '/css')) //当前对应css文件
}

// js 检查js文件并压缩，拷贝
async function js() {
    return await gulp.src(config.src + '/js/**')
        .pipe(Jshint()) //检查代码
        .pipe(Uglify()) // 压缩js
        .pipe(gulp.dest(config.dist + '/js'))
        .pipe(md5(10, config.dist + '/*.html', {
            mappingFile: 'manifest.json',
            connector: '.'
        }))
        .pipe(gulp.dest(config.dist + '/js')) // 拷贝
}

// 拷贝image文件并压缩
async function image() {
    return await gulp.src(config.src + '/images/*')
        .pipe(Cache(Imagemin({
            optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true, //类型：Boolean 默认：false 多次优化svg直到完全优化
            svgoPlugins: [{removeViewBox: false}] //不要移除svg的viewbox属性
            //use: [Pngquant()] //使用pngquant深度压缩png图片的imagemin插件
        })))
        .pipe(gulp.dest(config.dist + '/images'));
}

// clean 清空dist文件内容
async function clean() {
    // 不设置allowEmpty: true会报File not found with singular glob
    return await gulp.src(config.dist, {allowEmpty: true}).pipe(Clean());
}

module.exports = {
    html,
    css,
    js,
    image,
    clean
}