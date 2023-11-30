import {Events} from "../../events/events";
import {CommonUtils} from "@/common/utils/commonUtils";


/**
 * 获取所有角色权限列表
 * @param state
 * @returns {any[]}
 */
export const selectPerissionList = (state:any) => {
    const roleCache = state["init"];
    return {
        permissionTree:(roleCache[Events.GET_ALL_PERMISSION_LIST]||{}).data || [],
        permissionLevel:(roleCache[Events.GET_ALL_PERMISSION_LIST]||{}).permissionLevel || [],
    };
};
/**
 * 中心相关审批权限
 * @param state
 * @returns {{}}
 */
export const selectApprovalPermission = (state:any) => {
    const homeCache = state['init'];
    return (homeCache[Events.GET_APPROVAL_PERMISSION] || {}).data || {}
};

/**
 * 预警信息
 * @param state
 * @returns {{}}
 */
export const selectEarlyWarningAlert= (state:any) => {
    const homeCache = state['init'];
    return (homeCache[Events.GET_EARLY_WARNING_ALERT] || {}).data || []
};

/**
 * 中心是否包含西格玛权限
 * @param state
 * @returns {any[]}
 */
export const selectSigmaAuth= (state:any) => {
    const homeCache = state['init'];
    return (homeCache[Events.INCLUDE_SIGMA_CENTER] || {}).data || {};
};

/**
 * 中心所有员工列表（排除总部员工）
 * @param state
 * @returns {any[]}
 */
export const selectTotalEmployeeList = (state:any, option:any) => {
    const homeCache = state['init'];
    const totalEmployeeList = (homeCache[Events.GET_TOTAL_STAFF_LIST] || {}).data || [];
    let res = [...totalEmployeeList];
    for(let key in option){
        // 岗位选择可能为多选
        if(key === "postName"){
            let result = [];
            for(let len = option[key].length, i = 0; i < len; i++){
                result = [...result, ...res.filter((item:any) => option[key][i] === item[key])]
            }
            res = result
        } else if (key === "leaveDate"){
            res = res.filter((item: any) => {
                return option[key] < item[key] || item.workingStatus === "1"|| item.workingStatus === "2"
            })
        } else if(key === "roleList" && (option[key] instanceof Array)){
            res = res.filter((item: any) => CommonUtils.hasEqualElement(option[key], item[key]))
        } else if (key === "workingStatus" && option[key] == '1'){
            res = res.filter((item:any) => item[key] === '1' || item[key] === '2')
        } else{
            res = res.filter((item:any) => item[key] === option[key])
        }
    }
    return res;
};
/**
 * 中心未读通知信息（GA,INS）
 * @param state
 * @returns {any[]}
 */
export const selectNoReadNotice= (state:any) => {
    const homeCache = state['init'];
    return (homeCache[Events.GET_NO_NOTICE] || {}).data || [];
};


/**
 * 绑定gymboId提示框信息
 * @param state
 * @returns {any[]}
 */
export const selectBingGymIdMsgFlag= (state:any) => {
    const homeCache = state['init'];
    return (homeCache[Events.ALERT_FLAG] || {}).data || null;
};

/**
 * @param state
 * @returns {any[]}
 */
export const selectBusinessSourceList= (state:any) => {
    const homeCache = state['init'];
    return (homeCache[Events.GET_BUSINESS_SOURCE_LIST] || {}).data || [];
};
