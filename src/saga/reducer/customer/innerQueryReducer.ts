/**
*Desc: 表头大搜索框
*User: Debby.Deng
*Date: 2019/1/18,
*Time: 10:57 AM
*/
import {handleActions} from "redux-actions";
import {Events} from "../../../events/events";

/**
 *设置大搜索框搜索内容
 */

const actions = handleActions({
    [Events.GET_HEADER_QUERY_STRING](state: any,action:any) {
        return {
            ...state, [Events.GET_HEADER_QUERY_STRING]: action.params
        }
    },
    [Events.CLEAR_HEADER_QUERY_STRING](state: any) {
        return {
            ...state, [Events.GET_HEADER_QUERY_STRING]: {}
        }
    },
    [Events.GET_HEADER_QUERY_LIST](state:any, action:any){
        return {
            ...state,
            [Events.GET_HEADER_QUERY_LIST]:{
                data: action.data
            }
        }
    },

},{});

let QueryReducer:any={};

QueryReducer["innerQuery"] = actions;

export default QueryReducer
