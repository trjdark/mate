/**
*Desc: 大搜索框selector
*User: Debby.Deng
*Date: 2019/1/18,
*Time: 11:26 AM
*/

import {Events} from "../../../events/events";

/**
 * 搜索框内容字段
 * @param state
 * @returns {any}
 */
export const innerQuerySelector = (state:any) => {
    const cache =state["innerQuery"];
    return (cache[Events.GET_HEADER_QUERY_STRING]||{});
};


/**
 * 搜索框结果
 * @param state
 * @returns {any}
 */
export const innerQueryListSelector = (state:any) => {
    const cache =state["innerQuery"];
    return (cache[Events.GET_HEADER_QUERY_LIST]||{}).data || {};
};
