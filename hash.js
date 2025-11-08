const crypto = require('crypto');
module.exports = {
  hashPassword(password, salt=null) {
    salt = salt || crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 310000, 32, 'sha256').toString('hex');
    return salt + '$' + hash;
  },
  verifyPassword(password, stored) {
    const [salt, key] = stored.split('$');
    const hash = crypto.pbkdf2Sync(password, salt, 310000, 32, 'sha256').toString('hex');
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(key, 'hex'));
  }
};
