/**
 * desc: 角色reducer
 * Date: 2018/7/30
 * Time: 下午5:56
 */
import {handleActions} from 'redux-actions';
import {Events} from "../../../events/events";

const actions = handleActions({
    [Events.GET_IDENTIFY_LIST](state:any, action:any){
        (action.data || []).forEach((item:any) => item.key = item.id)
        return {
            ...state,
            [Events.GET_IDENTIFY_LIST]:{
                data: action.data
            }
        }
    },
    [Events.GET_ROLE_LIST](state:any, action:any){
        return {
            ...state,
            [Events.GET_ROLE_LIST]:{
                data: action.data
            },
            [Events.GET_ROLE]:{
                data: {}
            }
        }
    },

    [Events.GET_ROLE](state:any, action:any){
        return {
            ...state,
            [Events.GET_ROLE]:{
                data: action.data
            }
        }
    },
    [Events.GET_DEFAULT_ROLE_LIST](state:any, action:any){
        return {
            ...state,
            [Events.GET_DEFAULT_ROLE_LIST]:{
                data:action.data
            },
            [Events.GET_DEFAULT_ROLE]:{
                data:{}
            }
        }
    },
    [Events.GET_DEFAULT_ROLE](state:any, action:any){
        let funs = action.data.roleFunctions.map((item:any) => item.functionId);
        funs=funs.filter((fun)=>fun!='');
        return {
            ...state,
            [Events.GET_DEFAULT_ROLE]:{
                data:action.data
            }
        }
    }
}, {});

let RoleReducer:any={};

RoleReducer["role"] = actions;

export default RoleReducer;
