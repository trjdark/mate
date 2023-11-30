  /**
*Desc: saga返回data
*User: Debby.Deng
*Date: 2018/8/17,
*Time: 下午3:56
*/

import {call, put} from "redux-saga/effects";
import {Fetch} from "../../../service/fetch";
import {SetApi} from "../../../api/settingApi";
import {Events} from "../../../events/events";


/**
 * 获取课程资料分类
 * @param action
 * @returns {IterableIterator<CallEffect>}
 */
export function* getLessonMatType(action) {
    const params = {
        url: SetApi.课程资料分类,
        data:action.params
    };
    try{
        const response = yield call(Fetch.post.bind(Fetch),params);
        yield put({
            type: Events.LESSON_MATERIAL_TYPE,
            data: response
        })
    }catch(err){

    }
}
