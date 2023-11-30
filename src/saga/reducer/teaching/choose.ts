/**
 * Desc:
 * User: dave.zhang
 */
import {handleActions} from "redux-actions";
import {Events} from "@/events/events";

const actions = handleActions({
    [Events.SELECTION_TO_RESERVATION](state:any, action:any){
        return {
            ...state,
            [Events.SELECTION_TO_RESERVATION]:{
                data: action.data
            }
        }
    },
},{});

let CourseSelectionReducer:any={};
CourseSelectionReducer["course-selection"] = actions;
export default CourseSelectionReducer;
