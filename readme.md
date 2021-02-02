使用gulp构建项目
###1.全局安装gulp 
```
npm install -g gulp
```

###2.创建本地项目并初始化
进入本地项目，运行```npm init```初始化项目。
初始化时根据需求输入对应的值，不输直接回车就行，最后输入```y```,生成一个package.json文件（在此文件放需要的插件和对应版本）,初始结构如下：
```
{
  "name": "demo-gulp",
  "version": "1.0.0",
  "description": "简单的gulp demo",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "gulp": "^4.0.2"
  }
}
```

###3.安装常用插件
如果是开发时需要的插件使用```--save-dev```指令（插入devDependencies中），生成环境也需要的使用```--save```指令（插入dependencies中）

gulp-jshint ——js语法检测
//gulp-util ——终端控制台打印自定义错误信息 (4.0版本已弃用)
http-proxy-middleware ——设置代理，配合gulp-connect使用
gulp-less ——将less编译成css
gulp-file-include ——用于文件模块化导入，如用include的方式导入公共部分
gulp-connect ——用于启动本地服务器
gulp-clean ——清理目录
gulp-uglify --压缩js
gulp-minify-css ——压缩css
gulp-autoprefixer ——自动添加浏览器前缀
imagemin-pngquant ——png图片压缩
gulp-imagemin ——图片压缩
gulp-cache ——设置gulp打包的缓存，一般用于img

安装命令如下：
```npm install gulp jshint gulp-jshint gulp-util http-proxy-middleware gulp-less gulp-file-include gulp-connect gulp-clean gulp-uglify gulp-minify-css gulp-autoprefixer imagemin-pngquant gulp-imagemin gulp-cache --save-dev```

###4.项目配置文件（gulpfile.js）
在控制台输入gulp的时候首先执行gulpfile.js文件，在执行default任务，所以建一个名为gulpfile.js的js文件，将任务写在里面。

由于我们要区分开发环境和生产环境，所以使用两个不同的配置文件，配置文件统一放在build文件下。
结构如下：
---build    配置文件存储目录
    |---config.prod.js    生产环境公共配置文件
    |---config.dev.js     开发环境公共配置文件
    |---gulp.dev.js       开发环境配置文件
    |---gulp.prod.js      生产环境配置文件
---gulpfile.js
具体配置信息见：[配置文件信息]
###5.项目整体结构如下
---build    配置文件存储目录
    |---config.prod.js    生产环境公共配置文件
    |---config.dev.js     开发环境公共配置文件
    |---gulp.dev.js       开发环境配置文件
    |---gulp.prod.js      生产环境配置文件
---dist    编译后文件存储目录
---src     项目开发文件目录
    |---scss/sass/less/css
    |---js
    |---images
    |---fonts
    |---views
---package.json   项目描述及安装包
---gulpfile.js    运行时的配置文件