require('dotenv').config(); // 确保环境变量被加载
const mongoose = require('mongoose');
const User = require('./src/models/userModel'); // 假设您的用户模型在这里
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('错误: .env 文件中未定义 MONGODB_URI。');
    process.exit(1);
}

const runTest = async () => {
    try {
        // 1. 连接数据库
        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB 已连接，准备测试用户模型...');

        // 2. 清理：删除之前可能创建的同名测试用户 (可选)
        await User.deleteMany({ email: 'testuser@example.com' });
        await User.deleteMany({ email: 'adminuser@example.com' });
        console.log('旧的测试用户已清理 (如果存在)。');

        // 3. 测试创建用户 (customer)
        console.log('尝试创建 customer 用户...');
        const customer = new User({
            email: 'testuser@example.com',
            password: 'password123'
            // role 会使用默认值 'customer'
        });
        await customer.save();
        console.log('Customer 用户已创建:', customer);

        // 4. 测试创建用户 (admin)
        console.log('尝试创建 admin 用户...');
        const admin = new User({
            email: 'adminuser@example.com',
            password: 'passwordadmin',
            role: 'admin'
        });
        await admin.save();
        console.log('Admin 用户已创建:', admin);

        // 5. 测试字段验证 - 尝试创建一个不符合要求的用户
        console.log('尝试创建密码过短的用户 (应该会失败)...');
        try {
            const invalidUser = new User({
                email: 'invalid@example.com',
                password: '123' // 密码少于6位
            });
            await invalidUser.save();
            console.error('错误: 密码过短的用户不应该被创建成功！');
        } catch (error) {
            console.log('成功捕获到错误 (密码过短):', error.message);
            // 您可以进一步检查 error.errors['password'].message 来确认是密码验证错误
        }

        console.log('尝试创建重复 email 的用户 (应该会失败)...');
        try {
            const duplicateUser = new User({
                email: 'testuser@example.com', // 这个 email 已经存在
                password: 'anotherpassword'
            });
            await duplicateUser.save();
            console.error('错误: 重复 email 的用户不应该被创建成功！');
        } catch (error) {
            console.log('成功捕获到错误 (email 重复):', error.message);
            // MongoDB 会抛出一个包含 E11000 错误码的错误
        }


        // 6. 测试查询用户
        console.log('查询所有用户...');
        const users = await User.find();
        console.log('所有用户:', users);

        console.log('用户模型测试完成。');

    } catch (error) {
        console.error('测试过程中发生错误:', error);
    } finally {
        // 7. 关闭数据库连接
        await mongoose.disconnect();
        console.log('MongoDB 连接已关闭。');
    }
};

runTest();