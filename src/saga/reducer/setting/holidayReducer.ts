/**
 * desc: 节假日reducer
 * Date: 2018/8/22
 * Time: 下午7:20
 */
import {handleActions} from 'redux-actions';
import {Events} from "../../../events/events";

const actions = handleActions({
    [Events.GET_HOLIDAY_LIST](state:any, action:any){
        return {
            ...state,
            [Events.GET_HOLIDAY_LIST]:{
                data: action.data
            }
        }
    },
    [Events.GET_HOLIDAY](state:any, action:any){
        return {
            ...state,
            [Events.GET_HOLIDAY]:{
                data: action.data
            }
        }
    }
}, {});

let HolidayReducer:any={};

HolidayReducer["holiday"] = actions;

export default HolidayReducer;
