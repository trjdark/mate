/**
 * desc:
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2020/10/29
 * Time: 下午2:50
 */
import {Events} from "@/events/events";

/**
 * 重置密码获取用户名
 * @param state
 * @returns {{}}
 */
export const selectUsername = (state:any) => {
    const homeCache = state['user'];
    return (homeCache[Events.USERNAME] || {}).data || {};
};
