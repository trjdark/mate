/**
 * desc:
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2020/3/26
 * Time: 下午3:17
 */
import {TelephoneApi} from "@/api/telephoneApi";
import {Fetch} from "@/service/fetch";
import {call, put} from "redux-saga/effects";
import {Events} from "@/events/events";

/**
 * 获取技能组列表
 * @param action
 * @returns {IterableIterator<CallEffect>}
 */
export function* queryGidList(action:any) {
    const params = {
        url: TelephoneApi.获取技能组列表,
        data:action.params
    };
    try{
        const response = yield call(Fetch.post.bind(Fetch),params);
        yield put({
            type: Events.GET_GID_LIST,
            data: response
        })
    }catch(err){

    }
}
