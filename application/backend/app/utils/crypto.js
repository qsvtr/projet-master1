// https://gist.github.com/siwalikm/8311cf0a287b98ef67c73c1b03b47154

const crypto = require('crypto');
const config = require("../config/auth.config");

const algorithm = 'aes-256-ctr';
const ENC_KEY = config.secret;

const encrypt = ((val, IV) => {
    let cipher = crypto.createCipheriv(algorithm, ENC_KEY, IV);
    let encrypted = cipher.update(val, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
});

const decrypt = ((encrypted, IV) => {
    let decipher = crypto.createDecipheriv(algorithm, ENC_KEY, IV);
    let decrypted = decipher.update(encrypted.content, 'base64', 'utf8');
    return (decrypted + decipher.final('utf8'));
});

module.exports = {
    encrypt,
    decrypt
};
