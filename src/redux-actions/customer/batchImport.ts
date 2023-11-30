/**
 * Desc:
 * User: dave.zhang
 * Date: 2018/10/8,
 * Time: 下午1:31
 */

import {SetApi} from '@/api/settingApi';
import axios from "axios";
import {message} from 'antd';
import {Storage} from "@/common/utils/storage";
import {CustomerApi} from "@/api/customerApi";
import {Fetch} from "@/service/fetch";
import {User} from "@/common/beans/user";
import moment from 'moment';

export const fileDownload = (data, url = SetApi.文件下载, fileName = 'leads_load_template.xlsx') => {
    const config = {
        headers: {
            token: Storage.get('_token'),
            Accept: '*/*',
            centerCode: User.centerCode,
            userId: User.userId,
            userName: User.userName
        },
        responseType: 'blob',
        transformRequest: [function (data) {
            let ret = '';
            for (let it in data) {
                if (data[it]) {
                    ret += `${encodeURIComponent(it)}=${encodeURIComponent(data[it])}&`
                }
            }
            return ret.slice(0, -1);
        }]
    };
    return axios.post(`/api${url}`, data, config)
        .then(
            res => {
                let blob = new Blob([res.data]);
                let link = document.createElement('a');
                link.download = fileName;
                link.target = '_self';
                link.style.display = 'none';
                link.href = URL.createObjectURL(blob);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link)
                return Promise.resolve() // 异步返回Promise 使外部遮罩生效
            },
            err => {
                message.error(err.message);
                return Promise.reject()
            })
};

export const importConfirm = (params) => {
    const data = {
        url: CustomerApi.确认导入,
        data: params
    };
    return Fetch.post(data, 30000);
}
/**
 * 倒出例子
 * @param params
 * @param type
 * @returns {Promise<any>}
 */
export const downloadLeads = (params,type='导入') => {
    let url;
    if(type==='导入'){
        url=CustomerApi.导出leads
    }else{
        url=CustomerApi.导出重复leads
    }
    const data = {
        url,
        data: params,
        responseType: 'arraybuffer'
    };
    return Fetch.post(data).then((res:any) => {
        let link = document.createElement('a');
        link.download = `${moment().format('YYYY-MM-DD')}${type}leads.csv`;
        link.style.display = 'none';
        link.href = URL.createObjectURL(new Blob([res]));
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link)
    });
}
/**
 * 浏览excel
 * @param params
 * @returns {Promise<any>}
 */
export const browseExcel = (params) => {
    const data = {
        url: CustomerApi.导入excelJson,
        data: params
    };
    return Fetch.post(data, 30000);
}
