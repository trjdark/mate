/**
 * desc: 云语音
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2019/12/13
 * Time: 下午2:57
 */

import {handleActions} from 'redux-actions';
import {Events} from "../../../events/events";



const actions = handleActions({

    [Events.GET_GI_LIST_INFO](state:any, action:any){
        return {
            ...state,
            [Events.GET_GI_LIST_INFO]:{
                data: action.data
            }
        }
    },
    [Events.GET_GID_LIST](state:any, action:any){
        return {
            ...state,
            [Events.GET_GID_LIST]:{
                data: action.data
            }
        }
    },
}, {});

let TmkReducer:any={};

TmkReducer["setting"] = actions;

export default TmkReducer;
