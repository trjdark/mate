/**
 * desc: post, get 请求
 * Date: 2018/8/1
 * Time: 下午6:32
 */
import {Axios, SyncAxios} from "./axios";
import {message} from 'antd';
import {StatusCode} from "@/common/enum/statusCode";
import {Storage} from "@/common/utils/storage";
import history from "../router/history";
import {CommonUtils} from "@/common/utils/commonUtils";
import {Routes} from "@/router/enum/routes";
import {User} from "@/common/beans/user";
import {Cookie} from "@/service/cookie";
import {SetApi} from "@/api/settingApi";

declare interface AxiosParams {
    url: string;
    data?: any;
    header?: object;
    slience?: boolean;
    responseType?: string,
    onProgress?: () => void;
}

export class Fetch {
    static _key = '_token';
    static UNCHECK_VERSION_API_LIST = [SetApi.登录,  SetApi.发送验证码, SetApi.重置密码];

    // 用户token 保存在localstorage
    static get token(): any {
        return Storage.exist(this._key) ? {token: Storage.get(this._key)} : null;
    };

    static set token(data: any) {
        Storage.set(this._key, data)
    };

    static get userName(): any {
        return User.userName ? {userName: User.userName} : null;
    };

    static get centerCode(): any {
        return User.centerCode ? {centerCode: User.centerCode} : null;
    };

    static get requestURL() {
        return location.protocol + '//' + location.host + '/api';
    };

    static get userId(): any {
        return User.userId ? {userId: User.userId} : null;
    }
    static get flash(): any {
        return Cookie.getCookie('flash') ? {flash: true} : null;
    }
    static getUrl(url: string) {
        // Todo 测试
        if (url.indexOf("http") >= 0) {
            return `${url}`;
        }
        return `${this.requestURL}${url}`;
    }

    /**
     * 检测version是否改变
     * @param version
     * @returns {any}
     */
    static checkVersion(version: string) {
        if (!version) {
            return
        }
        if(!Cookie.getCookie('flash')){
            Cookie.setCookie("flash", 'true', 2*60);
        }
        const originalVersion = Cookie.getCookie('webVersionControl');
        if (!originalVersion || originalVersion !== version) {
            Cookie.setCookie("webVersionControl", version, 30*60*60*24);
            window.location.reload();
        }
    }

    /**
     * 发送方法
     * @param params
     * @param {string} url
     * @param {boolean} slience
     * @returns {Promise<any>}
     */
    static post(params: AxiosParams, timeout = 0): Promise<any> {
        // Todo 如参过滤
        if (Object.prototype.toString.call(params) === '[object Object]') {
            params.data = CommonUtils.filterParams(params.data);
        }
        const body: AxiosParams = {
            url: this.getUrl(params.url),
            data: params.data || {},
            slience: params.slience,
            header: Object.assign(
                {},
                this.token,
                this.centerCode,
                this.userName,
                this.userId,
                this.flash,
                params.header
            ),
            responseType: params.responseType
        };
        return Axios.post(body, timeout).then(
            (res: any) => {
                if (params.responseType === 'arraybuffer' || params.responseType === 'blob') {
                    if (res.code && res.code === StatusCode.错误) {
                        return Promise.reject(res);
                    }
                    return res;
                }
                if (params.responseType === "mapping") {
                    return res
                }
                if (res.code === StatusCode.成功) {
                    if (!this.UNCHECK_VERSION_API_LIST.includes(params.url)) {
                        this.checkVersion(res.webVersionControl);
                    }
                    Promise.resolve(res.data);
                    return res.data || true;
                }else if (res.code === StatusCode.用户过期) {
                    message.warning(res.msg);
                    // 跳转到登录页面，地址在环境变量里配置
                    setTimeout( () => {
                        window.location.href = process.env.home_Url;
                    }, 500)
                }else {
                    // 登录的 code0,过期合同确认 不要用 message
                    if ( params.url !== '/mate-basic/mate/login' &&
                         params.url !== '/mate-basic/basic/holiday/check' &&
                        params.url !== '/mate-basic/home/mate/home-mate-login'
                    ) {
                        message.error(res.msg, 3);
                    }
                    return Promise.reject(res);
                }
            }, (err: any) => {
                const errData = (err.response || {}).data;
                if (!errData) {
                    const errMsg = err.message.includes('timeout') ? '网络请求超时，请稍后再试~' : err.message;
                    message.error(errMsg);
                    return Promise.reject(err)
                } else {
                    const errMsg = errData.code === 0 ? errData.msg : 'Sorry,服务端小异常,请稍后再试~';
                    message.error(errMsg);
                    return Promise.reject(err.response)
                }
            }
        )
    }

    /**
     * 获取方法
     * @param {string} url
     * @param {object} header
     * @param {boolean} slience
     * @returns {Promise<any>}
     */
    static get(params: AxiosParams): Promise<any> {
        const body: AxiosParams = {
            url: this.getUrl(params.url),
            slience: params.slience,
            header: Object.assign(
                {},
                this.token,
                this.centerCode,
                this.userName,
                this.userId,
                this.flash,
                params.header)
        };
        return Axios.get(body).then(
            (res: any) => {
                if (res.code === StatusCode.错误) {
                    message.error(res.msg);
                    Promise.reject(res);
                }
                if (res.code === StatusCode.成功) {
                    if (!this.UNCHECK_VERSION_API_LIST.includes(params.url)) {
                        this.checkVersion(res.webVersionControl);
                    }
                    Promise.resolve(res.data);
                    return res.data || true;
                }
                if (res.code === StatusCode.用户过期) {
                    message.warning(res.msg);
                    // 跳转到登录页面，地址在环境变量里配置
                    history.push(Routes.登录.path);
                    window.location.href = process.env.home_Url;
                }
            },
            (err: any) => {
                const errData = (err.response || {}).data;
                if (!errData) {
                    const errMsg = err.message.includes('timeout') ? '网络请求超时，请稍后再试~' : err.message;
                    message.error(errMsg);
                } else {
                    const errMsg = errData.code === 0 ? errData.msg : 'Sorry,服务端小异常,请稍后再试~';
                    message.error(errMsg);
                }
                return Promise.reject(err);
            }
        )
    }

    /**
     * post 同步方法
     * @param {AxiosParams} params
     * @param {(res: any) => void} callback
     */
    static syncPost(params:AxiosParams, callback:(res:any) => void) {
        const body: AxiosParams = {
            url: this.getUrl(params.url),
            data: params.data,
            slience: params.slience,
            header: Object.assign({},
                Fetch.token,
                Fetch.centerCode,
                Fetch.userName,
                Fetch.userId,
                params.header)
        };
        return SyncAxios.post(body, (res) => {
            if(res.code === StatusCode.错误){
                message.error(res.msg);
                Promise.reject(res);
            }
            if(res.code === StatusCode.成功){
                callback(res.data)
            }
        })
    }
    public static postBinary(params: AxiosParams): void {
        const body: AxiosParams = {
            url: this.getUrl(params.url),
            data: params.data || {},
            slience: params.slience,
            header: Object.assign({},
                this.token,
                this.userName,
                this.userId,
                params.header),
        };
        Axios.postBinary(body);
    }
}
