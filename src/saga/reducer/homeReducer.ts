import {Events} from "@/events/events";
import {handleActions} from "redux-actions";
import {User} from "@/common/beans/user";
const actions = handleActions({

    [Events.GET_STAFF_CENTER_LIST](state:any, action:any){//获取员工中心列表
        // Todo 从内存储存改为本地储存
        User.user = Object.assign({}, User.user, {
            staffCenterList: action.data
        });
        return {
            ...state,
            [Events.GET_STAFF_CENTER_LIST]:{
                data: action.data
            }
        }
    },
    /**
     * 解析权限
     * @param state
     * @param action
     * @returns {{}}
     */
    [Events.GET_ALL_PERMISSION_LIST](state: any, action: any) {//获取当前员工权限列表
        const oldData = action.data || {};
        // 数据封装目前只支持4级
        const thirdData = {}, secondData = {}, firstData = {}, data = [], defaultPermission = [];
        let dataLevelArr=[[],[],[],[]];
        (oldData.thirdlevel || []).forEach((item: any) => {
            defaultPermission.push(item.id);
            dataLevelArr[3].push(item.id);
            if (thirdData[item.parentId]) {
                thirdData[item.parentId].push({key: item.id, title: item.functionName})
            } else {
                thirdData[item.parentId] = [{key: item.id, title: item.functionName}]
            }
        });
        (oldData.secondlevel || []).forEach((item: any) => {
            defaultPermission.push(item.id);
            dataLevelArr[2].push(item.id);
            if (secondData[item.parentId]) {
                secondData[item.parentId].push(thirdData[item.id] ? {
                    key: item.id,
                    title: item.functionName,
                    children: thirdData[item.id]
                } : {
                    key: item.id,
                    title: item.functionName,
                })
            } else {
                secondData[item.parentId] = thirdData[item.id]
                    ? [{key: item.id, title: item.functionName, children: thirdData[item.id]}]
                    : [{key: item.id, title: item.functionName}]
            }
        });
        (oldData.firstlevel || []).forEach((item: any) => {
            defaultPermission.push(item.id);
            dataLevelArr[1].push(item.id);
            if (firstData[item.parentId]) {
                firstData[item.parentId].push(secondData[item.id] ?
                    {key: item.id, title: item.functionName, children: secondData[item.id]}
                    : {key: item.id, title: item.functionName})
            } else {
                firstData[item.parentId] = secondData[item.id]
                    ? [{key: item.id, title: item.functionName, children: secondData[item.id]}]
                    : [{key: item.id, title: item.functionName}]
            }
        });
        (oldData.zerolevel || []).forEach((item: any) => {
            defaultPermission.push(item.id);
            dataLevelArr[0].push(item.id);
            data.push({key: item.id, title: item.functionName, children: firstData[item.id]})
        });
        return {
            ...state,
            [Events.GET_ALL_PERMISSION_LIST]: {
                data: data,
                permissionLevel:dataLevelArr
            },
            // 默认添加的权限key
            [Events.DEFAULT_ADD_PERMISSION]: {
                data: defaultPermission
            }
        }
    },
    /**
     * 岗位信息，角色信息，中英文
     * @param state
     * @param action
     * @returns {{}}
     */
    [Events.GET_USER_POST_ROLE_INFO](state:any, action:any){
        const result = action.data || {};
        const data = {
            permissionList: (result.functions || []).map((item:any) => item.id),
            staffRole:(result.staffRole||[]).map((item:any) => {
                if(item.roleId==='R_HQ001_BMS'){//总部的BMS才有BMS权限
                   return  item.centerId==='C_HQ001'? 'BMS' : '';
                }else if(item.roleId==='R_HQ001'){
                    return item.centerId==='C_HQ001'? 'ADMIN' : '';
                } else{
                    return item.defaultRoleName;
                }
            })
        };
        // Todo 从内存储存改为本地储存
        User.user = Object.assign({}, User.user, {
            role:data.staffRole.filter((role)=>(!!role && role)),
            permissionList:data.permissionList
        });
        return {
            ...state,
            [Events.GET_USER_POST_ROLE_INFO]: {
                data: data
            }
        }
    },
    /**
     * 中心审批权限
     * @param state
     * @param action
     * @returns {{}}
     */
    [Events.GET_APPROVAL_PERMISSION](state:any, action:any){
        return {
            ...state,
            [Events.GET_APPROVAL_PERMISSION]:{
                data: action.data
            }
        }
    },
    [Events.SET_STUFF_LIST_ON_JOB](state:any, action:any){//获取在职员工中心列表
        return {
            ...state,
            [Events.SET_STUFF_LIST_ON_JOB]:{
                data: action.stuffListOnJob
            }
        }
    },
    [Events.GET_EARLY_WARNING_ALERT](state:any, action:any){//获取预警信息列表
        return {
            ...state,
            [Events.GET_EARLY_WARNING_ALERT]:{
                data: action.data
            }
        }
    },
    // 是否包含tmk配置中心
    [Events.INCLUDE_TMK_CENTER](state:any, action:any){//获取预警信息列表
        // Todo 从内存储存改为本地储存
        User.user = Object.assign({}, User.user, {
            tmkStatus: action.data
        });
        return {
            ...state,
            [Events.INCLUDE_TMK_CENTER]:{
                data: action.data
            }
        }
    },
    // 是否包含移动支付中心
    [Events.INCLUDE_PAYMENT_CENTER](state:any, action:any){//获取预警信息列表
        // Todo 从内存储存改为本地储存
        User.user = Object.assign({}, User.user, {
            hasPayment: action.data
        });
        return {
            ...state,
            [Events.INCLUDE_PAYMENT_CENTER]:{
                data: action.data
            }
        }
    },
    // 中心是否包含西格玛权限
    [Events.INCLUDE_SIGMA_CENTER](state:any, action:any){//获取预警信息列表
        // Todo 从内存储存改为本地储存
        User.user = Object.assign({}, User.user, {
            isSigmaCenter: action.data
        });
        return {
            ...state,
            [Events.INCLUDE_SIGMA_CENTER]:{
                data: action.data
            }
        }
    },
    // 中心所有员工列表（在职，离职）
    [Events.GET_TOTAL_STAFF_LIST](state:any, action:any){//获取预警信息列表
        return {
            ...state,
            [Events.GET_TOTAL_STAFF_LIST]:{
                data: action.data
            }
        }
    },
    // 提示信息
    [Events.GET_NO_NOTICE](state:any, action:any){//获取预警信息列表
        return {
            ...state,
            [Events.GET_NO_NOTICE]:{
                data: action.data
            }
        }
    },
    // 关闭绑定gymboId提示信息
    [Events.ALERT_FLAG](state:any, action:any){
        return {
            ...state,
            [Events.ALERT_FLAG]:{
                data: 1
            }
        }
    },
    // 关闭绑定gymboId提示信息
    [Events.GET_BUSINESS_SOURCE_LIST](state:any, action:any){
        return {
            ...state,
            [Events.GET_BUSINESS_SOURCE_LIST]:{
                data: action.data
            }
        }
    },
},{});

let homeReducer:any={};

homeReducer["init"] = actions;

export default homeReducer;

