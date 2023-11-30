/**
 * desc: 中心选择器
 * Date: 2018/8/22
 * Time: 上午10:15
 */
import {Events} from "../../../events/events";

/**
 * 获取中心配置参数
 * @param state
 * @returns {any}
 */
export const selectCenterConfig = (state:any) => {
    const CenterCache = state["center"];
    return (CenterCache[Events.GET_CENTER_CONFIG] || {}).data || {};
};

/**
 * 获取中心类别
 * @param state
 * @returns {any}
 */
export const selectCenterType = (state:any) => {
    const CenterCache = state["center"];
    return (((CenterCache[Events.GET_CENTER_BASE_CONFIG] || {}).data || {}).centerType) || [];
}

/**
 * 获取中心区域
 * @param state
 * @returns {any}
 */
export const selectCenterArea = (state:any) => {
    const CenterCache = state["center"];
    return (((CenterCache[Events.GET_CENTER_BASE_CONFIG] || {}).data || {}).area) || [];
}

/**
 * 获取中心城市
 * @param state
 * @returns {any}
 */
export const selectCenterCity = (state:any) => {
    const CenterCache = state["center"];
    return (((CenterCache[Events.GET_CENTER_BASE_CONFIG] || {}).data || {}).city) || [];
}

/**
 * 获取中心城市等级
 * @param state
 * @returns {any}
 */
export const selectCenterCityLevel = (state:any) => {
    const CenterCache = state["center"];
    return (((CenterCache[Events.GET_CENTER_BASE_CONFIG] || {}).data || {}).cityLevel) || [];
}

/**
 * 获取中心省份
 * @param state
 * @returns {any}
 */
export const selectCenterProvince = (state:any) => {
    const CenterCache = state["center"];
    return (((CenterCache[Events.GET_CENTER_BASE_CONFIG] || {}).data || {}).province) || [];
};

