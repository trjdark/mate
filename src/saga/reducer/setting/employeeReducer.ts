/**
 * desc:
 * Date: 2018/8/25
 * Time: 上午11:00
 */
import {handleActions} from 'redux-actions';
import {Events} from "../../../events/events";

const actions = handleActions({
    [Events.GET_EMPLOYEE_LIST](state:any, action:any){
        return {
            ...state,
            [Events.GET_EMPLOYEE_LIST]:{
                data: action.data
            },
            [Events.GET_EMPLOYEE_INFO]:{
                data: {}
            },
            [Events.GET_EMPLOYEE_POST_INFO]:{
                data: []
            },
            [Events.GET_EMPLOYEE_ROLE_INFO]:{
                data: []
            }
        }
    },
    [Events.GET_EMPLOYEE_POST_LIST](state:any, action:any){
        return {
            ...state,
            [Events.GET_EMPLOYEE_POST_LIST]:{
                data: action.data
            }
        }
    },
    [Events.GET_EMPLOYEE_ROLE_LIST](state:any, action:any){
        return {
            ...state,
            [Events.GET_EMPLOYEE_ROLE_LIST]:{
                data: action.data
            }
        }
    },
    [Events.GET_EMPLOYEE_INFO](state:any, action:any){
        return {
            ...state,
            [Events.GET_EMPLOYEE_INFO]:{
                data: action.data
            }
        }
    },
    [Events.GET_EMPLOYEE_POST_INFO](state:any, action:any){
        return {
            ...state,
            [Events.GET_EMPLOYEE_POST_INFO]:{
                data: action.data
            }
        }
    },
    [Events.GET_EMPLOYEE_ROLE_INFO](state:any, action:any){
        return {
            ...state,
            [Events.GET_EMPLOYEE_ROLE_INFO]:{
                data: action.data
            }
        }
    },
    /**
     * 获取中心信息，admin获取所有中心信息，cd,gb获取一条信息
     * @param state
     * @param action
     * @returns {{}}
     */
    [Events.GET_ALL_CENTER_LIST](state:any, action:any){
        let centerInfo = action.data instanceof Array? action.data : [];
        return {
            ...state,
            [Events.GET_ALL_CENTER_LIST]:{
                data: centerInfo
            }
        }
    },

}, {});

let EmployeeReducer:any={};

EmployeeReducer["employee"] = actions;

export default EmployeeReducer;
