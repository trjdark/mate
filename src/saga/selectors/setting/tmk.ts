/**
 * desc: 云语音（tmk）选择器
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2019/12/13
 * Time: 下午3:00
 */
import {Events} from "../../../events/events";



/**
 * 获取中心列表（管理员操作）
 * @param state
 * @returns {{}}
 */
export const selectTmkGIList = (state:any) => {
    const GICache = state["setting"];
    return (GICache[Events.GET_GI_LIST_INFO] || {}).data || [];
}
/**
 * 获取技能组列表（云语音）
 * @param state
 * @returns {{}}
 */
export const selectGIDList = (state:any) => {
    const settingCache = state["setting"];
    return ((settingCache[Events.GET_GID_LIST] || {}).data || {}).groups || [];
}
