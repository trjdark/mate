import {handleActions} from 'redux-actions';
import {Events} from "../../../events/events";



const actions = handleActions({
    [Events.GET_COURSE_CATEGORY_INFO](state:any, action:any){
        return {
            ...state,
            [Events.GET_COURSE_CATEGORY_INFO]:{
                data: action.data
            }
        }
    },
    [Events.GET_COURSE_CATEGORY_LIST](state:any, action:any){
        return {
            ...state,
            [Events.GET_COURSE_CATEGORY_LIST]:{
                data: action.data
            },
            [Events.GET_COURSE_CATEGORY_INFO]:{
                data: null
            }
        }
    },
    [Events.ADD_COURSE_CATEGORY](state:any, action:any){
        return {
            ...state,
            [Events.ADD_COURSE_CATEGORY]:{
                data: action.data
            }
        }
    },
    [Events.UPDATE_COURSE_CATEGORY](state:any, action:any){
        return {
            ...state,
            [Events.UPDATE_COURSE_CATEGORY]:{
                data: action.data
            }
        }
    }

}, {});

let LessonCategoryReduder:any={};

LessonCategoryReduder["courseCategory"] = actions;

export default LessonCategoryReduder;
