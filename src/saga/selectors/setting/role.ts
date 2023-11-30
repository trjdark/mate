/**
 * desc: 权限选择器
 * Date: 2018/8/8
 * Time: 下午7:55
 */
import {Events} from "../../../events/events";

/**
 * 添加角色权限时候，默认勾选权限
 * @param state
 * @returns {any[]}
 */
export const selectDefaultAddPermission = (state:any) => {
    const roleCache = state["init"];
    return (roleCache[Events.DEFAULT_ADD_PERMISSION]||{}).data || [];
};
