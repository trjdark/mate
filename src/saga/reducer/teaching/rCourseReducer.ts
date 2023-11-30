import {handleActions} from "redux-actions";
import {Events} from "@/events/events";

const actions = handleActions({
    [Events.CRM_VIDEO_LIST](state:any, action:any){
        return {
            ...state,
            [Events.CRM_VIDEO_LIST]:{
                data: action.data
            }
        }
    },
    [Events.CRM_AUDIO_LIST](state:any, action:any){
        return {
            ...state,
            [Events.CRM_AUDIO_LIST]:{
                data: action.data
            }
        }
    },
    [Events.CRM_IMAGE_LIST](state:any, action:any){
        return {
            ...state,
            [Events.CRM_IMAGE_LIST]:{
                data: action.data
            }
        }
    },
},{});

let RCourseReducer:any={};
RCourseReducer["rSource"] = actions;
export default RCourseReducer;
