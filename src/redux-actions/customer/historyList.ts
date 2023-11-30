/**
*Desc: 历史名单异步请求数据
*User: Debby.Deng
*Date: 2018/11/13,
*Time: 上午9:43
*/

import {CustomerApi} from "../../api/customerApi";
import {Fetch} from "../../service/fetch";
import {Storage} from "@/common/utils/storage";
import {Loading} from "@/ui/component/loading";
import {CommonUtils} from "@/common/utils/commonUtils";
import axios from "axios";
import {Message} from "@/ui/component/message/message";
import {User} from "@/common/beans/user";
/**
 * 课程包结束
 * @param {any} params
 * @returns {any}
 */
export const packageClose=(params) => {
    const data={
        url: CustomerApi.课程包结束,
        data: params
    };
    return Fetch.post(data);
};

/**
 * 长期未联系回收
 * @param {any} params
 * @returns {any}
 */
export const longTimeNoContact=(params) => {
    const data={
        url: CustomerApi.长期未联系回收,
        data: params
    };
    return Fetch.post(data);
};

/**
 * 长期未签约回收
 * @param {any} params
 * @returns {any}
 */
export const longTimeNoSign=(params) => {
    const data={
        url: CustomerApi.长期未签约回收,
        data: params
    };
    return Fetch.post(data);
};


/**
 * leads流失
 * @param {any} params
 * @returns {any}
 */
export const looseLeads=(params) => {
    const data={
        url: CustomerApi.leads流失,
        data: params
    };
    return Fetch.post(data);
};

/**
 * 手动回收站
 * @param {any} params
 * @returns {any}
 */
export const manualRecycle=(params) => {
    const data={
        url: CustomerApi.手动回收站,
        data: params
    };
    return Fetch.post(data);
};
/**
 * leads转移
 * @param {any} params
 * @returns {any}
 */
export const leadsTransfer=(params) => {
    const data={
        url: CustomerApi.leads转移,
        data: params
    };
    return Fetch.post(data);
};

/**
 * 会员转移
 * @param {any} params
 * @returns {any}
 */
export const vipTransfer=(params) => {
    const data={
        url: CustomerApi.会员转中心,
        data: params
    };
    return Fetch.post(data);
};

/**
 * 未联系回收
 * @param {any} params
 * @returns {any}
 */
export const noContact=(params) => {
    const data={
        url: CustomerApi.未联系回收,
        data: params
    };
    return Fetch.post(data);
};

/**
 * 待领取回收
 * @param {any} params
 * @returns {any}
 */
export const unReceiveList=(params) => {
    const data={
        url: CustomerApi.待领取回收,
        data: params
    };
    return Fetch.post(data);
};

/**
 * 转移至待分配
 * @param {any} params
 * @returns {any}
 */
export const toUnassign=(params) => {
    const data={
        url: CustomerApi.转移至待分配,
        data: params
    };
    return Fetch.post(data);
};
/**
 * 转移至TMK
 * @param params
 * @returns {Promise<any>}
 */
export const transferToTmk = (params) => {
    const data={
        url: CustomerApi.转移至TMK,
        data: params
    };
    return Fetch.post(data);
};

 /**历史名单导出
  * @param {any} params
  * @returns {any}
  */
 export const historyDownload=(params) => {
     const config = {
         headers: {
             token: Storage.get('_token'),
             userName: User.userName,
             centerCode: User.centerCode,
             userId: User.userId
         },
         responseType :'blob',
     };
     Loading.add();
     //将null过滤掉
     params=CommonUtils.filterParams(params);
     return axios.post(`/api${CustomerApi.历史名单导出}`,params, config).then(res => {
         const fr = new FileReader();
         fr.onload = function () {
             try {//导出失败(若成功res.data为string类型，JSON.parse会报错)
                 const data = JSON.parse(this.result);
                 Message.error(data.msg);
             } catch (err) {//导出成功
                 const type = res.headers[`content-type`];
                 const filename = res.headers[`content-disposition`].split('=')[1];
                 let link = document.createElement('a');
                 link.download = filename;
                 link.style.display = 'none';
                 let blob = typeof File === 'function'
                     ? new File([res.data], filename, {type: type})
                     : new Blob([res.data], {type: type});
                 link.href = URL.createObjectURL(blob);
                 document.body.appendChild(link);
                 link.click();
                 document.body.removeChild(link);
             }
         };
         fr.readAsText(res.data);
         //移除遮罩
         Loading.remove();
     },err=>{
         Loading.remove();
     }).catch((err)=>{
         Message.error(err);
         Loading.remove();
     });
 };
