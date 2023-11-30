/**
*User: Vicky.yu
*Date: 2018/11/27,
*Time: 下午17:40
*/
import {Events} from "../../../events/events";

/**
 * 市场渠道列表
 * @param state
 * @returns {any}
 */
export const marketDataList = (state:any) => {
    const marketCache =state["marketList"];
    return (marketCache[Events.GET_MARKET_LIST]||{}).data || [];
}
