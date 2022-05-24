module.exports = {
    plugins: {
        'postcss-pxtorem': {
            //rootValue 应为设计稿的10分之一
            //vant 样式默认基准尺寸为37.5去设计的，所以设计稿定多少修改rootValue就好了
            // 可以为数值
            // 也可以为函数动态处理返回
            rootValue({file}) {
                return file.indexOf('vant') !== -1 ? 37.5 : 75;
            },
            // rootValue : 37.5,
            propList: ['*'],

            //配置不要转换的样式资源  (里面直接写文件名，不用加后缀)
            exclude : 'github-markdown'
        },
    },
};