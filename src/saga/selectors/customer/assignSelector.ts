import {Events} from "../../../events/events";


/**
 * 获取高级查询按钮组
 * @param state
 * @returns {{}}
 */
export const selectAdvanceButtons = (state:any) => {
    const CenterCache = state["assign"];
    return (CenterCache[Events.GET_ADVANCED_BUTTON_LIST] || {}).data || [];
};

/**
 * 保存自定义查询返回的ID
 * @param state
 * @returns {{}}
 */
export const selectAdvanceButtonId = (state:any) => {
    const CenterCache = state["assign"];
    return (CenterCache[Events.GET_ADVANCED_BUTTON_ID] || {}).data;
};

/**
 * 获取分配客户列表
 * @param state
 * @returns {{}}
 */
export const selectAssignList = (state:any) => {
    const CenterCache = state["assign"];
    return (CenterCache[Events.GET_ASSIGN_TABLE_LIST] || {}).data || {};
};


/**
 * 获取状态栏数量
 * @param state
 * @returns {{}}
 */
export const selectNavNum = (state:any) => {
    const CenterCache = state["assign"];
    return (CenterCache[Events.GET_ASSIGN_STATUS] || {}).data || [];
};

/**
 * 获取高级查询区域列表
 * @param state
 * @returns {{}}
 */
export const selectAdvanceDistrict = (state:any) => {
    const CenterCache = state["assign"];
    return (CenterCache[Events.GET_ASSIGN_DISTRICT] || {}).data || [];
};

/**
 * 获取高级查询INS
 * @param state
 * @returns {{}}
 */
export const selectAdvanceINS = (state:any) => {
    const CenterCache = state["assign"];
    return (CenterCache[Events.GET_ASSIGN_INS_LIST] || {}).data || [];
};

/**
 * 获取高级查询中心课程包
 * @param state
 * @returns {{}}
 */
export const selectAdvanceCenterCourse = (state:any) => {
    const CenterCache = state["assign"];
    return (CenterCache[Events.GET_ASSIGN_PACKAGE_LIST] || {}).data || [];
};

/**
 * 获取分配leads,ga list
 * @param state
 * @returns {{}}
 */
export const selectGaList= (state:any) => {
    const CenterCache = state["assign"];
    return (CenterCache[Events.GET_ASSIGN_GA_LIST] || {}).data || [];
};
/**
 * 获取分配leads,gb list
 * @param state
 * @returns {{}}
 */
export const selectGbList= (state:any) => {
    const CenterCache = state["assign"];
    return (CenterCache[Events.GET_ASSIGN_GB_LIST] || {}).data || [];
};

/**
 * 获取分配leads 到中心
 * @param state
 * @returns {{}}
 */
export const selectAssignCenterList= (state:any) => {
    const CenterCache = state["assign"];
    return (CenterCache[Events.GET_ASSIGN_CENTER_LIST] || {}).data || [];
};
