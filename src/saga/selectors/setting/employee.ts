/**
 * desc: 员工管理选择器
 * Date: 2018/8/25
 * Time: 上午11:04
 */
import {Events} from "../../../events/events";

export const selectEmployee = (state:any) => {
    const EmployeeCache = state['employee'];
    return (EmployeeCache[Events.GET_EMPLOYEE_LIST] || {}).data || {};
};

export const selectEmployeePost = (state:any) => {
    const EmployeeCache = state['employee'];
    return (EmployeeCache[Events.GET_EMPLOYEE_POST_LIST] || {}).data || [];
};

/**
 * 获取所有中心列表（超级管理员）
 * @param state
 * @returns {{}}
 */
export const selectAllCenterList = (state:any) => {
    const CenterCache = state["employee"];
    return (CenterCache[Events.GET_ALL_CENTER_LIST] || {}).data || [];
}
