let config = {
    dist: './dist',  // 配置构建目录
    src: 'src',
    port: 9090,
    replace: {
        '__URL__': "https://**.com/"
    },
    proxy: {
        '/api/': {
            target: 'http://localhost:8080/',
            changeOrigin: true,
            pathRewrite: { '^/api/': '' },  //路由重写
        }
    }
};


config = {
    ...config,
    replace_reg: new RegExp(Object.keys(config['replace']).join("|"), "g")
};
  
  
module.exports = config;