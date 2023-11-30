/**
 * desc: cookie 操作，本地localstorage保存一个唯一的guid,加密保存cookie
 * Date: 2018/8/2
 * Time: 下午2:20
 */
import {Storage} from "../common/utils/storage";

class Cookie {
    /**
     *
     * @returns {string}
     * @constructor
     */
    static S4(){
        return (((1 + Math.random()) * 0x10000)|0).toString(16).substring(1);
    }
    /**
     * 生成一个随机数
     */
    static generateGuid (){
        const key = 'gym_signature';
        if(Storage.exist(key)){
            return Storage.get(key);
        }else{
            const sign = `${this.S4()}${this.S4()}-${this.S4()}${this.S4()}-${this.S4()}${this.S4()}-${this.S4()}${this.S4()}-${this.S4()}${this.S4()}`;
            Storage.set(key, sign);
            return sign;
        }
    }

    /**
     * 读取cookie
     * @param {string} name
     * @returns {any}
     */
    static getCookie(name:string){
        let arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg)){
            return (arr[2]);
        }else {
            return null;
        }
    }

    /**
     * 设置cookie
     * @param {string} name
     * @param {string} val
     * @param {number} exseconds 秒
     */
    static setCookie(name:string, val:string, exseconds?:number){
        Cookie.delCookie(name);
        let expires="";
        if(exseconds){
            let d = new Date();
            d.setTime(d.getTime() + (exseconds*1000));
            expires = "expires="+d.toUTCString();
        }else{
            expires="expires=Session";
        }
        document.cookie = `${name}=${val};${expires}; path=/`;
    }

    /**
     * 删除cookie
     * @param {string} name
     */
    static delCookie(name:string){
        const exp:any = new Date();
        exp.setTime(exp.getTime() - 1);
        let cval = this.getCookie(name);
        if(cval != null) {
            document.cookie = `${name}=${cval};expires=${exp.toGMTString()}`;
        }
    }
}

export {Cookie}
