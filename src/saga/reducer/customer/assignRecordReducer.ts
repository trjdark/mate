import {handleActions} from "redux-actions";
import {Events} from "@/events/events";

const actions = handleActions({
    //分配记录 list
    [Events.GET_ASSIGN_RECORD_LIST](state:any, action:any){
        return {
            ...state,
            [Events.GET_ASSIGN_RECORD_LIST]:{
                data: action.data
            }
        }
    },

},{})

let AssignRecordReducer:any={};
AssignRecordReducer["assignRecord"] = actions;
export default AssignRecordReducer;