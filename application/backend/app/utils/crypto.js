const crypto = require('crypto');
const config = require("../config/auth.config");
const { Crypto } = require("@peculiar/webcrypto");
const cryptoweb = new Crypto();
const atob = require('atob');

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
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    return (decrypted + decipher.final('utf8'));
});

// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/importKey
// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt
// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/decrypt
function str2ab(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}
function importPublicKey(pem) {
    const pemHeader = "-----BEGIN PUBLIC KEY-----";
    const pemFooter = "-----END PUBLIC KEY-----";
    const pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length);
    const binaryDerString = atob(pemContents);
    const binaryDer = str2ab(binaryDerString);
    return cryptoweb.subtle.importKey("spki", binaryDer, {name: "RSASSA-PKCS1-v1_5", hash: "SHA-256",}, true, ["verify"]);
}

const getDataEncoding = (data) => {
    const enc = new TextEncoder()
    return enc.encode(data)
}
function _base64ToArrayBuffer(base64) {
    var binary_string = atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}
const verify = async (publicKeyText, signature) => {
    const data =  getDataEncoding('test')
    const publicKey = await importPublicKey(publicKeyText)
    return cryptoweb.subtle.verify({name: 'RSASSA-PKCS1-v1_5'}, publicKey, _base64ToArrayBuffer(signature), data);
}

module.exports = {
    encrypt,
    decrypt,
    verify
};
