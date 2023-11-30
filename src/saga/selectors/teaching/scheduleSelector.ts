import {Events} from "../../../events/events";

/**
 * 获取ins,hi
 * @param state
 * @returns []
 */
export const selectInsHi = (state:any) => {
    const cache = state["schedule"];
    return (cache[Events.GET_TEACHING_INS_HI] || {}).data || [];
};

/**
 * 获取教室列表
 * @param state
 * @returns []
 */
export const selectScheduleRoom = (state:any) => {
    const cache = state["schedule"];
    return (cache[Events.GET_TEACHING_ROOM_LIST] || {}).data || [];
};

/**
 * 获取教室列表id数组
 * @param state
 * @returns []
 */
export const selectScheduleRoomOnlyId = (state:any) => {
    const cache = state["schedule"];
    const idArr=((cache[Events.GET_TEACHING_ROOM_LIST]||{}).data||[]).map((item)=>(item.id));
    return idArr;
};

/**
 * 获取课程包
 * @param state
 * @returns []
 */
export const selectScheduleCourse = (state:any) => {
    const cache = state["schedule"];
    return (cache[Events.GET_TEACHING_COURSE_LIST] || {}).data || [];
};

/**
 * 获取ga
 * @param state
 * @returns []
 */
export const selectGAlist = (state:any) => {
    const cache = state["schedule"];
    return (cache[Events.GET_TEACHING_GA_LIST] || {}).data || [];
};

/**
 * 获取gb
 * @param state
 * @returns []
 */
export const selectGBlist = (state:any) => {
    const cache = state["schedule"];
    return (cache[Events.GET_TEACHING_GB_LIST] || {}).data || [];
};

/**
 * 获取签到时间
 * @param state
 * @returns {{}}
 */
export const selectChenInTime = (state:any) => {
    const cache = state["schedule"];
    return (cache[Events.UPDATE_CHECK_IN_TIME] || {}).data || {};
}
