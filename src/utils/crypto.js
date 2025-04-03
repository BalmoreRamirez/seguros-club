import CryptoJS from 'crypto-js';
const secretKey = 'your-secret-key';
export const encrypt = (data) => {
    if (typeof data !== 'string') {
        data = JSON.stringify(data);
    }
    return CryptoJS.AES.encrypt(data, secretKey).toString();
};

export const decrypt = (ciphertext) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};