/**
 * desc: 合同Reducer
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/11/13
 * Time: 上午10:09
 */
import {handleActions} from 'redux-actions';
import {Events} from "../../events/events";

const actions = handleActions({
    [Events.GET_CONTRACT_LIST](state:any, action:any){
        return {
            ...state,
            [Events.GET_CONTRACT_LIST]:{
                data: action.data
            }
        }
    },
    /**
     * 合同模块基础配置信息
     * @param state
     * @param action
     * @returns {{}}
     */
    [Events.GET_CONTRACT_BASIC_CONFIG](state:any, action:any){
        return {
            ...state,
            [Events.GET_CONTRACT_BASIC_CONFIG]:{
                data: action.data
            }
        }
    },
    /**
     * 收付款管理模块
     */
    //收付款列表
    [Events.GET_CONTRACT_PAYANDRECEIVE_LIST](state:any, action:any){
        return {
            ...state,
            [Events.GET_CONTRACT_PAYANDRECEIVE_LIST]:{
                data: action.data
            }
        }
    },
}, {});

let ContractReducer:any={};

ContractReducer["contract"] = actions;

export default ContractReducer;
