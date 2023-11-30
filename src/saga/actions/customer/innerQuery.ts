
/**
 *Desc: 大搜索框点击搜索
 *User: Debby.Deng
 *Date: 2019/4/28,
 *Time: 10:38 AM
 */
import {call, put} from "redux-saga/effects";
import {Fetch} from "@/service/fetch";
import {Events} from "@/events/events";
import {CustomerApi} from "@/api/customerApi";


export function* innerSearch(action: any) {
    const params = {
        url: CustomerApi.本中心查询,
        data: action.params
    };
    try {
        const response = yield call(Fetch.post.bind(Fetch), params);
        yield put({
            type: Events.GET_HEADER_QUERY_LIST,
            data: response
        })
    } catch (err) {

    }
}
