import {handleActions} from 'redux-actions';
import {Events} from "../../../events/events";



const actions = handleActions({
    [Events.GET_PRODUCT_LIST](state:any, action:any){
        return {
            ...state,
            [Events.GET_PRODUCT_LIST]:{
                data: action.data
            },
            [Events.GET_PRODUCT_INFO]:{
                data: {}
            }
        }
    },
    [Events.GET_PRODUCT_INFO](state:any, action:any){
        return {
            ...state,
            [Events.GET_PRODUCT_INFO]:{
                data: action.data
            }
        }
    },
    [Events.ADD_PRODUCT](state:any, action:any){
        return {
            ...state,
            [Events.ADD_PRODUCT]:{
                data: action.data
            }
        }
    },
    [Events.UPDATE_PRODUCT](state:any, action:any){
        return {
            ...state,
            [Events.UPDATE_PRODUCT]:{
                data: action.data
            }
        }
    }
}, {});

let ProductReducer:any={};

ProductReducer["product"] = actions;

export default ProductReducer;
