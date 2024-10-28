const CryptoJS = require('crypto-js');
const k = "0123456789101112";
const i = "1211109876543210";
const AesUtil = {
    encrypt: function (word, key, iv) {
        word = AesUtil.AES.Base64Encode(word);
        return AesUtil.AES.encrypt(word, key, iv)
    }, decrypt: function (word, key, iv) {
        let base64Str = AesUtil.AES.decrypt(word, key, iv);
        return AesUtil.AES.Base64Decode(base64Str)
    }, AES: {
        Base64Encode: function (str) {
            let src = CryptoJS.enc.Utf8.parse(str);
            return CryptoJS.enc.Base64.stringify(src).toString()
        }, Base64Decode: function (str) {
            return CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(str))
        }, encrypt: function (word, key, iv) {
            let srcs = CryptoJS.enc.Utf8.parse(word);
            if (key == undefined) {
                key = k
            }
            key = CryptoJS.enc.Utf8.parse(key);
            if (iv == undefined) {
                iv = i
            }
            iv = CryptoJS.enc.Utf8.parse(iv);
            let encrypted = CryptoJS.AES.encrypt(srcs, key, {mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7, iv: iv});
            return encrypted.ciphertext.toString()
        }, decrypt: function (word, key, iv) {
            word = CryptoJS.enc.Hex.parse(word);
            word = CryptoJS.enc.Base64.stringify(word);
            if (key == undefined) {
                key = k
            }
            key = CryptoJS.enc.Utf8.parse(key);
            if (iv == undefined) {
                iv = i
            }
            iv = CryptoJS.enc.Utf8.parse(iv);
            let decrypt = CryptoJS.AES.decrypt(word, key, {mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7, iv: iv});
            return this.Base64Decode(decrypt.toString(CryptoJS.enc.Base64))
        }
    }
};
module.exports = {encrypt: AesUtil.encrypt, decrypt: AesUtil.decrypt}
