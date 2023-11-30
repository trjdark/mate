/**
 * desc:
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/11/12
 * Time: 下午8:10
 */
import {ContractApi} from "../../api/contractApi";
import {call, put} from "redux-saga/effects";
import {Events} from "../../events/events";
import {Fetch} from "../../service/fetch";

/**
 * 获取收付款列表
 * @param action
 * @returns {IterableIterator<any>}
 */
export function* getPayAndReceiveManagement(action:any){
    const params = {
        url: ContractApi.查询收付款列表,
        data: action.params
    };
    try{
        const response = yield call(Fetch.post.bind(Fetch), params);
        yield put({
            type: Events.GET_CONTRACT_PAYANDRECEIVE_LIST,
            data: response
        })
    }catch (e) {

    }
}

/**
 * 合同基本配置
 * @returns {IterableIterator<any>}
 */
export function* contractInit(){
    let intent = yield call(Fetch.post.bind(Fetch),{url: ContractApi.分类定义});
    const params = {
        url: ContractApi.类型定义,
        data: {intent: (intent || []).map((item:any) => item.code)}
    };
    try{
        let response = yield call(Fetch.post.bind(Fetch), params);
        let data = {};
        let res = [];
        intent.forEach((item:any) => {
            data[item.code] = {code:item.code, name: item.codeValue};
        });
        response.forEach(item => {
            res.push(Object.assign({}, data[item.code], item));
        });
        yield put({
            type: Events.GET_CONTRACT_BASIC_CONFIG,
            data: res
        })
    }catch (e) {

    }
}



