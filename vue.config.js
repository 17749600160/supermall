// 快捷路径配置
module.exports = {
  configureWebpack:{
    resolve:{
       extensions:[],
       alias:{
         'assets': '@/assets',
         'common': '@/common',
         'components': '@/components',
         'network': '@/network',
         'views': '@/views',
       }
    }
  }
}