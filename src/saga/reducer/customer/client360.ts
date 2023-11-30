import {handleActions} from "redux-actions";
import {Events} from "@/events/events";

const actions = handleActions({
    [Events.GET_CLIENT_360_BASIC_INFO](state: any, action: any) {
        return {
            ...state,
            [Events.GET_CLIENT_360_BASIC_INFO]: {
                data: action.data
            }
        }
    },
    [Events.GET_CLIENT_360_BABY_INFO](state: any, action: any) {
        return {
            ...state,
            [Events.GET_CLIENT_360_BABY_INFO]: {
                data: action.data
            }
        }
    },
    [Events.GET_CODE_INFO_BY_TYPE](state: any, action: any) {
        return {
            ...state,
            [Events.GET_CODE_INFO_BY_TYPE]: {
                data: action.data
            }
        }
    },
    [Events.GET_EDIT_PERMISSION](state: any, action: any) {
        return {
            ...state,
            [Events.GET_EDIT_PERMISSION]: {
                data: action.data
            }
        }
    }

}, {})

let Client360Reducer: any = {};
Client360Reducer["client360"] = actions;
export default Client360Reducer;
