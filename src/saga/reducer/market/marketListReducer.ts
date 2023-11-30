/**
 * desc: 
 * User: vicky.yu
 * Date: 2018/11/23
 * Time: 下午20:00
 */
import {handleActions} from 'redux-actions';
import {Events} from "../../../events/events";

const actions = handleActions({
    [Events.GET_MARKET_LIST](state:any, action:any){
        return {
            ...state,
            [Events.GET_MARKET_LIST]:{
                data: action.data
            }
        }
    },
    [Events.DELETE_MARKET_INFO](state:any, action:any){
        return {
            ...state,
            [Events.DELETE_MARKET_INFO]:{
                data: action.data
            }
        }
    },
    [Events.GET_MARKET_PERMISSION](state:any, action:any) {
        return {
            ...state,
            [Events.GET_MARKET_PERMISSION]: {
                data: action.data
            }
        }
    }
}, {});


let marketListReducer:any={};
marketListReducer["marketList"] = actions;
export default marketListReducer;


