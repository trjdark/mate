import {handleActions} from 'redux-actions';
import {Events} from "../../events/events";



const actions = handleActions({
    [Events.GET_TOKEN_INFO](state:any, action:any){
        return {
            ...state,
            [Events.GET_TOKEN_INFO]:{
                data: action.data
            }
        }
    },
    [Events.USERNAME](state:any, action:any){
        return {
            ...state,
            [Events.USERNAME]:{
                data: action.data
            }
        }
    },
}, {});

let LoginReducer:any={};

LoginReducer["user"] = actions;

export default LoginReducer;
