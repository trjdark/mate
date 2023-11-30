import {handleActions} from 'redux-actions';
import {Events} from "../../../events/events";



const actions = handleActions({
    [Events.GET_ROOM_LIST](state:any, action:any){//教室列表
        return {
            ...state,
            [Events.GET_ROOM_LIST]:{
                data: action.data
            },
            [Events.GET_ROOM_INFO]:{
                data: {}
            }
        }
    },
    [Events.GET_ROOM_INFO](state:any, action:any){//教室详情
        return {
            ...state,
            [Events.GET_ROOM_INFO]:{
                data: action.data
            }
        }
    },
    [Events.ADD_ROOM](state:any, action:any){//新增教室
        return {
            ...state,
            [Events.ADD_ROOM]:{
                data: action.data
            }
        }
    },
    [Events.UPDATE_ROOM](state:any, action:any){//编辑教室
        return {
            ...state,
            [Events.UPDATE_ROOM]:{
                data: action.data
            }
        }
    },

}, {});

let RoomReducer:any={};

RoomReducer["room"] = actions;

export default RoomReducer;
