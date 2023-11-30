/**
 * desc: 中心Reducer
 * Date: 2018/8/22
 * Time: 上午10:04
 */
import {handleActions} from 'redux-actions';
import {Events} from "../../../events/events";



const actions = handleActions({

    [Events.GET_CENTER_LIST](state:any, action:any){
        return {
            ...state,
            [Events.GET_CENTER_LIST]:{
                data: action.data
            }
        }
    },
    [Events.GET_CENTER_BASE_CONFIG](state:any, action:any){
        return {
            ...state,
            [Events.GET_CENTER_BASE_CONFIG]:{
                data: action.data
            }
        }
    },
    [Events.GET_CENTER](state:any, action:any){
        return {
            ...state,
            [Events.GET_CENTER]:{
                data:action.data
            }
        }
    },
    [Events.GET_CENTER_CONFIG](state:any, action:any){
        return {
            ...state,
            [Events.GET_CENTER_CONFIG]:{
                data: action.data
            }
        }
    },
    [Events.GET_CENTER_STAFFS](state:any, action:any){
        return {
            ...state,
            [Events.GET_CENTER_STAFFS]:{
                data: action.data
            }
        }
    },
    // 中心（在职 + 离职半年）员工列表
    [Events.SET_STUFF_LIST](state:any, action:any){//获取预警信息列表
        return {
            ...state,
            [Events.SET_STUFF_LIST]:{
                data: action.stuffList
            }
        }
    },
}, {});

let CenterReducer:any={};

CenterReducer["center"] = actions;

export default CenterReducer;
