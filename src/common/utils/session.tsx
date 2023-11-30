/**
 * desc: sessionStorage 管理
 * Date: 2018/7/30
 * Time: 下午4:38
 */
import {Crypto} from "./crypto";
import MD5 from 'crypto-js/md5';

class Session {
    /**
     * 获取
     * @param {string} key
     * @returns {any}
     */
    static get(key: string) {
        const _key = MD5(key).toString();
        const ciphertext = sessionStorage.getItem(_key);
        return JSON.parse(!!ciphertext ? Crypto.decrypt(ciphertext) : "{}");
    }

    /**
     * 设置
     * @param {string} key
     * @param {object | string} data
     */
    static set(key: string, data: object | string){
        const _key = MD5(key).toString();
        sessionStorage.setItem(_key, Crypto.encrypt(JSON.stringify(data)));
    }

    /**
     * 删除
     * @param {string} key
     */
    static remove(key: string){
        const _key = MD5(key).toString();
        sessionStorage.removeItem(_key);
    }

    /**
     * 清除
     */
    static clear(){
        sessionStorage.clear();
    }

    /**
     * 是否存在
     * @param {string} key
     * @returns {boolean}
     */
    static exist(key: string){
        const _key = MD5(key).toString();
        return !!sessionStorage.getItem(_key);
    }

    /**
     * 修改
     * @param {string} key
     * @param {object} data
     */
    static assign(key:string, data: object){
        const beforeDate = this.get(key);
        const afterDate = Object.assign({}, beforeDate, data);
        this.set(key, afterDate);
    }
}

export {Session};
