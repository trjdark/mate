/**
*Desc:
*User: vicky.yu
*Date: 2018/11/27,
*Time: 下午19:30
*/

import {call, put} from "redux-saga/effects";
import {Fetch} from "../../../service/fetch";
import {CustomerApi} from "../../../api/customerApi"
import { Events } from "../../../events/events";

// 市场渠道列表
export function* getMarketData(action:any){
    const params = {
        url: CustomerApi.市场渠道列表,
        data: action.params
    };
    try{
        const response = yield call(Fetch.post.bind(Fetch),params);
        yield put({
            type: Events.GET_MARKET_LIST,
            data: response
        })
    }catch(err){

    }
}
// 删除市场渠道活动
export function* getdeleteMarketPost(action: any) {
    const params = {
        url: CustomerApi.删除市场渠道活动,
        data: action.params
    };
    try{
        const res = yield call(Fetch.post.bind(Fetch), params);
        yield put({type: Events.DELETE_MARKET_INFO, data: res})
    }catch(err){

    }
}
