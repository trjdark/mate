/**
*User: Vicky.yu
*Date: 2018/12/17,
*Time: 下午17:40
*/
import {Events} from "../../../events/events";

/**
 * 活动列表
 * @param state
 * @returns {any}
 */
export const activityList = (state:any) => {
    const activityCache =state["activityList"];
    return (activityCache[Events.GET_ACTIVITY_LIST]||{}).data || [];
}
// 360活动列表
export const activityVIPList = (state:any) => {
    const activityCache =state["activityVIPList"];
    return (activityCache[Events.SET_VIP_ACTIVITY_LIST]||{}).data || [];
}

