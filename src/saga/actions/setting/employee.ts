/**
 * desc: 员工信息
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/8/25
 * Time: 上午10:14
 */
import {SetApi} from "../../../api/settingApi";
import {call, put} from "redux-saga/effects";
import {Fetch} from "../../../service/fetch";
import {Events} from "../../../events/events";
import {User} from "../../../common/beans/user";

export function* getEmployeePostList(action:any){
    const params = {
        url: SetApi.获取中心员工岗位列表,
        data: {
            currentCenterId: User.currentCenterId,
        }
    }
    try{
        const response = yield call(Fetch.post.bind(Fetch), params);
        yield put({
            type: Events.GET_EMPLOYEE_POST_LIST,
            data: response
        })
    }catch (e) {

    }
}

/**
 * 获取所有中心列表，总部管理员能查询多条记录
 * @returns {IterableIterator<any>}
 */
export function* getCommonCenterList(action) {
    const params = {
        url: SetApi.获取所有中心列表,
        data:action.params
    };
    try{
        // Todo 返回值结构多余 centerList 键
        const response = yield call(Fetch.post.bind(Fetch), params);
        yield put({
            type: Events.GET_ALL_CENTER_LIST,
            data: response
        })
    }catch (e) {
        yield put({
            type: Events.GET_ALL_CENTER_LIST,
            data: {}
        })
    }
}
