/**
*Desc: 本中心查询
*User: Debby.Deng
*Date: 2019/1/18,
*Time: 10:50 AM
*/

import {Events} from "../../events/events";
import {ServiceActionEnum} from "@redux-actions/serviceActionsEnum";

/**
 * 存储header大搜索框内容
 * @param {any} params
 * @returns {{type: ServiceActionEnum}}
 */
export const storeHeaderSearch = (params) => {
    return {
        type: Events.GET_HEADER_QUERY_STRING,
        params: params
    }
};

/**
 * 清除header大搜索框内容
 * @param {any}
 * @returns {{type: ServiceActionEnum}}
 */
export const clearHeaderSearch = () => {
    return {
        type: Events.CLEAR_HEADER_QUERY_STRING,
    }
};

 /**
  * 大搜索框本中心查询leads
  * @param {any} params
  * @returns {any}
  */
export const innerHeaderSearch =(params)=>{
     return {
         type: ServiceActionEnum.获取innerSearch列表,
         params
     }
 };
