/**
*Desc: promotor reducer
*User: Debby.Deng
*Date: 2018/8/21,
*Time: 下午12:43
*/

import {handleActions} from 'redux-actions';
import {Events} from "../../../events/events";

const actions = handleActions({
    [Events.GET_PROMOTOR_LIST](state:any, action:any){
        return {
            ...state,
            [Events.GET_PROMOTOR_LIST]:{
                data: action.data
            },
            [Events.GET_PROMOTOR_INFO]:{
                data:null
            }
        }
    },

    [Events.ADD_PROMOTOR](state:any, action:any){
        return {
            ...state,
            [Events.ADD_PROMOTOR]:{
                data: action.data
            }
        }
    },

    [Events.GET_PROMOTOR_INFO](state:any, action:any){
        return {
            ...state,
            [Events.GET_PROMOTOR_INFO]:{
                data: action.data
            }
        }
    },

    [Events.UPDATE_PROMOTOR_INFO](state:any, action:any){
        return {
            ...state,
            [Events.UPDATE_PROMOTOR_INFO]:{
                data: action.data
            }
        }
    }
}, {});

let PromotorReducer:any={};

PromotorReducer["promotor"] = actions;

export default PromotorReducer;
