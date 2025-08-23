import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
     base: '/XSZX/NXXT/manage/', 
    plugins: [vue()],
    resolve: {
        // 路径别名配置（需与 tsconfig.json 中的 paths 对应）
        alias: {
            '@': path.resolve(__dirname, './src')
        },
        // 导入时想要省略的扩展名列表
        extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    // 开发服务器配置
    server: {
        port: 3000, // 开发端口
        open: true, // 自动打开浏览器
        cors: true, // 允许跨域
        proxy: {
            // 接口代理示例（根据实际项目调整）
            '/api': {
                target: 'http://localhost:8080', // 后端接口地址
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '')
            }
        }
    },
    // 构建配置
    build: {
        outDir: 'dist', // 输出目录
        assetsDir: 'assets', // 静态资源目录
        sourcemap: false, // 生产环境不生成 sourcemap
        chunkSizeWarningLimit: 1500, //  chunk 大小警告阈值
        minify: 'terser', // 使用 terser 压缩
        terserOptions: {
            compress: {
                drop_console: true, // 移除 console
                drop_debugger: true // 移除 debugger
            }
        },
        // 静态资源处理
        assetsInlineLimit: 4096, // 小于此值的资源会被内联
        rollupOptions: {
            // 自定义构建策略（可选）
            output: {
                // 分割代码块
                chunkFileNames: 'assets/js/[name]-[hash].js',
                entryFileNames: 'assets/js/[name]-[hash].js',
                assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
            }
        }
    }
});
