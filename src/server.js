require('dotenv').config();
const http = require('http');
const app = require('./app'); // 确保 ./app.js 正确导出了 express app
const connectDB = require('./config/database');

const PORT = process.env.PORT || 3000;
const HOST = '127.0.0.1'; // 或者尝试 '0.0.0.0'

const startServer = async () => {
    try {
        await connectDB(); // 等待数据库连接

        const server = http.createServer(app);

        server.listen(PORT, HOST, () => { // 明确指定 HOST 和 PORT
            const address = server.address(); // 获取实际监听的地址信息
            console.log(`数据库已连接!`);
            console.log(`服务器正在监听 http://${address.address}:${address.port}`);
            console.log(`您现在可以尝试在浏览器或使用 curl 访问 http://${HOST}:${PORT}/`);
        });

        server.on('error', (error) => { // 监听服务器错误事件
            if (error.syscall !== 'listen') {
                throw error;
            }
            // 处理特定的监听错误
            switch (error.code) {
                case 'EACCES':
                    console.error(`端口 ${PORT} 需要提升的权限`);
                    process.exit(1);
                    break;
                case 'EADDRINUSE':
                    console.error(`端口 ${PORT} 已被占用`);
                    process.exit(1);
                    break;
                default:
                    throw error;
            }
        });

    } catch (dbError) {
        console.error('由于数据库连接错误，无法启动服务器:', dbError);
        process.exit(1);
    }
};

startServer();