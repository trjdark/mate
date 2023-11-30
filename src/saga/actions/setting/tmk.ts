/**
 * desc:
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2019/12/13
 * Time: 下午2:39
 */
import {call, put} from "redux-saga/effects";
import {SetApi} from "@/api/settingApi";
import {Events} from "@/events/events";
import {Fetch} from "@/service/fetch";

/**
 * 获取GI人员列表
 * @param action
 * @returns {IterableIterator<CallEffect>}
 */
export function* queryGIList(action:any) {
    const params = {
        url: SetApi.获取GI列表,
        data:{
            currentCenterId: action.params.currentCenterId
        }
    };
    try{
        const response = yield call(Fetch.post.bind(Fetch),params);
        yield put({
            type: Events.GET_GI_LIST_INFO,
            data: response
        })
    }catch(err){

    }
}
