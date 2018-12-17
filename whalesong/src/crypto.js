import { decode } from "base-64";
import { crypto } from "libsignal";

import { CRYPT_KEYS, EMPTY_SALT } from "./constants";
import { DecryptionError } from "./error";

function hdkf(key, type, size) {
    try {
        return Buffer.concat(crypto.deriveSecrets(
            Buffer.from(key, "base64"),
            EMPTY_SALT,
            Buffer.from(CRYPT_KEYS[type], "hex"),
            3,
        )).slice(0, size);
    } catch (error) {
        throw new DecryptionError(`Error while generating composed token: ${error}`);
    }
}


export const isEncrypted = model => model.mediaKey
    && model.clientUrl
    && model.clientUrl.endsWith(".enc");

export const decrypt = (dataBuffer, model) => {
    let { mediaKey } = model;
    let composedToken = "";

    try {
        decode(mediaKey);
    } catch (error) {
        try {
            mediaKey += ("=" * (mediaKey.length % 3));
            decode(mediaKey);
        } catch (e) {
            throw new DecryptionError(`Error in media key: ${e}`);
        }
    }

    composedToken = hdkf(mediaKey, model.type);

    const iv = composedToken.slice(0, 16);
    const cipherKey = composedToken.slice(16, 48);
    const data = dataBuffer.slice(0, dataBuffer.length - 10);

    try {
        return crypto.decrypt(cipherKey, data, iv);
    } catch (error) {
        throw error;
    }
};
