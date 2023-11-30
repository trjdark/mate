/**
 * desc: 封装axios
 * Date: 2018/8/1
 * Time: 下午3:30
 */
import axios from 'axios';
import {Loading} from "@/ui/component/loading";

declare interface AxiosParams {
    url: string;
    data?: object;
    header?: any;
    slience?: boolean;
    onProgress?: () => void;
    responseType?: string        // 返回值
}

class Axios {
    static timeout: number = 15000;
    static get = (params: AxiosParams) => {
        const {url, data, header, slience, onProgress} = params;
        if (!slience) {
            Loading.add();
        }
        let headers = {
            'Content-Type': "application/json"
        };
        return axios.get(url, {
            params: data || {},
            responseType: 'json',
            timeout: Axios.timeout,
            withCredentials: false,
            headers: Object.assign({}, headers, header),
            onUploadProgress: onProgress
        }).then(
            (res: any) => {
                if (!slience) {
                    Loading.remove();
                }
                return Promise.resolve(res.data)
            },
            (err: any) => {
                if (!slience) {
                    Loading.remove();
                }
                return Promise.reject(err)
            }
        );
    };
    static post = (params: AxiosParams, timeout) => {
        let {url, data, header, responseType, slience, onProgress} = params;
        if (!slience) {
            Loading.add();
        }
        // Todo 传递文件
        let headers = {
            'Content-Type': "application/json"
        };

        if (data) {
            if ("file" in data) {
                let formData = new FormData();
                for (let key in data) {
                    if (data.hasOwnProperty(key)) {
                        formData.append(key, data[key]);
                    }
                }
                formData.append('name', data["file"].filename);
                data = formData;
                headers = {
                    'Content-Type': "application/x-www-form-urlencoded"
                }
            }
        }
        return axios.post(url, data || {}, {
            responseType: responseType || 'json',
            timeout: timeout || Axios.timeout,
            withCredentials: false,
            headers: Object.assign({}, headers, header),
            onUploadProgress: onProgress
        }).then(
            (res: any) => {
                if (!slience) {
                    Loading.remove();
                }
                return Promise.resolve(res.data)
            },
            (err: any) => {
                if (!slience) {
                    Loading.remove();
                }
                return Promise.reject(err)
            }
        );
    };
    /**
     * @todo 改进需求
     * 提交formdata
     * @param {AxiosParams} params
     * @returns {Promise<AxiosResponse<any>>}
     */
    static postFormData = (params: AxiosParams) => {
        let {url, data, header, slience, onProgress} = params;
        if (!slience) {
            Loading.add();
        }

        let headers = {};
        return axios.post(url, data || {}, {
            responseType: 'blob',
            timeout: Axios.timeout,
            withCredentials: false,
            headers: Object.assign({}, headers, header),
            onUploadProgress: onProgress,
            transformRequest: [function (data) {
                let ret = '';
                for (let it in data) {
                    if (data.hasOwnProperty(it)) {
                        ret += `${encodeURIComponent(it)}=${encodeURIComponent(data[it])}&`
                    }
                }
                return ret
            }],
        }).then(
            (res: any) => {
                if (!slience) {
                    Loading.remove();
                }
                return Promise.resolve(res.data)
            },
            (err: any) => {
                if (!slience) {
                    Loading.remove();
                }
                return Promise.reject(err)
            }
        );
    };
    /**
     * post 返回二进制柳文件
     * @param {AxiosParams} params
     * @returns {any}
     */
    public static postBinary = (params:AxiosParams) => {
        const {url, data, header, slience, onProgress} = params;
        if(!slience) {
            Loading.add();
        }
        const headers = {};
        return axios.post(url, data || {}, {
            responseType: 'blob',
            timeout:Axios.timeout,
            withCredentials:false,
            headers: Object.assign({}, headers, header),
            onUploadProgress:onProgress,
        }).then((res:any) => {
            if(!slience) {
                Loading.remove();
            }
            const blob = new Blob([res.data]);
            if ('download' in document.createElement('a')) {
                const elink = document.createElement('a');
                const key:string = 'file';
                const fileName = res.headers[key];
                elink.style.display = 'none';
                elink.setAttribute('target', '_blank');
                elink.href = window.URL.createObjectURL(blob);
                elink.download = decodeURI(fileName);
                document.body.appendChild(elink);
                elink.click();
                window.URL.revokeObjectURL(elink.href); // 释放URL 对象
                document.body.removeChild(elink);
            }
        },(err:any) => {
            if(!slience) {
                Loading.remove();
            }
        });
    }
}

class SyncAxios {
    static post = (params:AxiosParams, callback:(res:any) => void) => {
        const {url, data, header, slience} = params;
        if(!slience){
            Loading.add();
        }
        let request = new XMLHttpRequest();
        let loadEvent = 'onreadystatechange';
        request.open("POST", url, false);
        request.setRequestHeader("Content-Type","application/json");
        request.setRequestHeader("Accept","application/json, text/plain, */*");
        request.setRequestHeader("token",header.token);
        request.setRequestHeader("userId",header.userId);
        request.setRequestHeader("centerCode",header.centerCode);
        request.setRequestHeader("userName",header.userName);

        request[loadEvent] = function () {
            if(!slience){
                Loading.remove();
            }

            const res = JSON.parse(request.response);
            callback(res);
        };
        request.onerror = function handleError() {
            if(!slience){
                Loading.remove();
            }
            request = null;
        };
        request.send(JSON.stringify(data));
    }
}

export {Axios, SyncAxios}
