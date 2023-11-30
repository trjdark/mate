import {handleActions} from "redux-actions";
import {Events} from "../../../events/events";
/**
*Desc: 分配客户reducer
*User: Debby.Deng
*Date: 2018/9/30,
*Time: 下午2:49
*/

const actions = handleActions({
    [Events.GET_ADVANCED_BUTTON_LIST](state:any, action:any){//获取高级查询按钮组
        return {
            ...state,
            [Events.GET_ADVANCED_BUTTON_LIST]:{
                data: action.data
            }
        }
    },
    [Events.GET_ADVANCED_BUTTON_ID](state:any, action:any){//保存高级查询获取返回按钮ID
        return {
            ...state,
            [Events.GET_ADVANCED_BUTTON_ID]:{
                data: action.data.id
            }
        }
    },
    [Events.CLEAR_ASSIGN_TABLE_LIST](state:any,action:any){//清空分配客户列表
        return {
            ...state,
            [Events.GET_ASSIGN_TABLE_LIST]:{
                data: action.data
            },
        }
    },
    [Events.GET_ASSIGN_TABLE_LIST](state:any, action:any){//获取分配客户列表
        return {
            ...state,
            [Events.GET_ASSIGN_TABLE_LIST]:{
                data: action.data
            },
        }
    },
    [Events.GET_ASSIGN_STATUS](state:any, action:any){//获取状态栏数量
        return {
            ...state,
            [Events.GET_ASSIGN_STATUS]:{
                data: action.data
            }
        }
    },
    [Events.GET_ASSIGN_PACKAGE_LIST](state:any, action:any){//获取高级查询中心课程包
        return {
            ...state,
            [Events.GET_ASSIGN_PACKAGE_LIST]:{
                data: action.data
            }
        }
    },
    [Events.GET_ASSIGN_DISTRICT](state:any, action:any){//高级查询区域列表
        return {
            ...state,
            [Events.GET_ASSIGN_DISTRICT]:{
                data: action.data
            }
        }
    },
    [Events.GET_ASSIGN_INS_LIST](state:any, action:any){//高级查询ins列表
        return {
            ...state,
            [Events.GET_ASSIGN_INS_LIST]:{
                data: action.data
            }
        }
    },
    [Events.GET_ASSIGN_GA_LIST](state:any, action:any){//分配leads,ga list
        return {
            ...state,
            [Events.GET_ASSIGN_GA_LIST]:{
                data: action.data
            }
        }
    },
    [Events.GET_ASSIGN_GA_LEADS_LIST](state:any, action:any){//分配leads,ga leads list
        return {
            ...state,
            [Events.GET_ASSIGN_GA_LEADS_LIST]:{
                data: action.data
            }
        }
    },
    [Events.GET_ASSIGN_GB_LIST](state:any, action:any){//分配leads,gb list
        return {
            ...state,
            [Events.GET_ASSIGN_GB_LIST]:{
                data: action.data
            }
        }
    },
    [Events.GET_ASSIGN_GB_LEADS_LIST](state:any, action:any){//分配leads,gb leads list
        return {
            ...state,
            [Events.GET_ASSIGN_GB_LEADS_LIST]:{
                data: action.data
            }
        }
    },
    [Events.GET_ASSIGN_CENTER_LIST](state:any, action:any){//分配leads到中心 list
        return {
            ...state,
            [Events.GET_ASSIGN_CENTER_LIST]:{
                data: action.data
            }
        }
    },

},{});

let AssignReducer:any={};

AssignReducer["assign"] = actions;

export default AssignReducer
