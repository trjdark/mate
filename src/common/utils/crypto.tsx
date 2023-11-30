/**
 * desc: 加密
 * Date: 2018/7/30
 * Time: 下午4:02
 */

import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import ModeECB from 'crypto-js/mode-ecb';
import ZeroPadding from 'crypto-js/pad-zeropadding';
import MD5 from 'crypto-js/md5';
import CryptoBase64 from 'crypto-js/enc-base64';

class Crypto {
    static key = Utf8.parse('www.gymbostudy.com').toString();
    static get config(){
        return {
            mode : ModeECB,
            padding : ZeroPadding,
            iv:Utf8.parse(MD5(this.key).toString()),
        }
    };
    static encrypt(data:string){
        return AES.encrypt(data, this.key, this.config).toString();
    };
    static decrypt(ciphertext:string){
        return AES.decrypt(ciphertext, this.key, this.config).toString(Utf8);
    };
}

class Base64Util{
    static stringify(word:string){
        return  encodeURIComponent(CryptoBase64.stringify(Utf8.parse(word)));
    }
    static parse(base64:string){
        return  CryptoBase64.parse(decodeURIComponent(base64)).toString(Utf8);
    }
}

export {Crypto, Base64Util}
