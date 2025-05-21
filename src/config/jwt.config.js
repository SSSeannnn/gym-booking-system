module.exports = {
  secret: process.env.JWT_SECRET || 'your-secret-key',
  expiresIn: '24h', // 令牌过期时间
  refreshExpiresIn: '7d' // 刷新令牌过期时间
}; 