import {handleActions} from 'redux-actions';
import {Events} from "../../../events/events";



const actions = handleActions({
    [Events.GET_LESSON_MATERIAL_INFO](state:any, action:any){
        return {
            ...state,
            [Events.GET_LESSON_MATERIAL_INFO]:{
                data: action.data
            }
        }
    },
    [Events.GET_LESSON_MATERIAL_LIST](state:any, action:any){
        return {
            ...state,
            [Events.GET_LESSON_MATERIAL_LIST]:{
                data: action.data
            },
            [Events.GET_LESSON_MATERIAL_INFO]:{
                data: {}
            }
        }
    },
    [Events.LESSON_MATERIAL_TYPE](state:any, action:any){
        return {
            ...state,
            [Events.LESSON_MATERIAL_TYPE]:{
                data: action.data
            }
        }
    },
    [Events.UPGRADE_LESSON_LIST](state:any, action:any){
        return {
            ...state,
            [Events.UPGRADE_LESSON_LIST]:{
                data: action.data
            }
        }
    },
    [Events.CREATE_LESSON_MATERIAL](state:any, action:any){
        return {
            ...state,
            [Events.CREATE_LESSON_MATERIAL]:{
                data: action.data
            }
        }
    },
    [Events.EDIT_LESSON_MATERIAL](state:any, action:any){
        return {
            ...state,
            [Events.EDIT_LESSON_MATERIAL]:{
                data: action.data
            }
        }
    },
    [Events.CLOSE_OPEN_LESSON_MATERIAL](state:any, action:any){
        const sourceDataObj={...state[Events.GET_LESSON_MATERIAL_LIST].data};
        sourceDataObj.list[action.data].isStorage=parseInt(sourceDataObj.list[action.data].isStorage)? 0 : 1;
        return {
            ...state,
            [Events.CLOSE_OPEN_LESSON_MATERIAL]:{
                data: action.data
            },
            [Events.GET_LESSON_MATERIAL_LIST]:{
                data: sourceDataObj
            },

        }
    },
}, {});

let LessonMatReduder:any={};

LessonMatReduder["lessonMaterial"] = actions;

export default LessonMatReduder;
