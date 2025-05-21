const bcrypt = require('bcryptjs');

/**
 * 对密码进行哈希处理
 * @param {string} password - 原始密码
 * @returns {Promise<string>} - 返回哈希后的密码
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * 验证密码是否匹配
 * @param {string} password - 原始密码
 * @param {string} hashedPassword - 哈希后的密码
 * @returns {Promise<boolean>} - 返回密码是否匹配
 */
const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword
}; 