import { resolve } from 'path';

const config = {
  // webpack配置
  webpack: {
    // 配置别名
    alias: {
      // 约定：使用@表示src文件所在路径
      '@': resolve(__dirname, 'src'),
    },
    // 抽离公用模块
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            name: 'vendor', // chunk名称
            priority: 1, // 权限更高，优先抽离，重要！
            test: /node_modules/, // 模块的路径
            minSize: 0, // 大小限制
            minChunks: 1, // 最少复用过几次，只要命中一次，就把他作为单独的模块
          },
          commons: {
            name: 'common', // chunk名称
            priority: 0, // 优先级
            minSize: 0, // 公共模块的大小限制
            minChunks: 2, // 公共模块最少复用过几次，引用两次及以上，把公共模块拆分
            maxInitialRequests: 4, // 入口的最大并行请求数
          },
        },
      },
    },
    configure: (webpackConfig: any) => {
      if (webpackConfig.mode === 'production') webpackConfig.devtool = false;
      return webpackConfig;
    },
  },
};

export default config;
