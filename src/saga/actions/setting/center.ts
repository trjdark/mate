/**
 * desc: 中心配置业务
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/8/23
 * Time: 上午10:16
 */
import {SetApi} from "../../../api/settingApi";
import {call, fork, put} from "redux-saga/effects";
import {Fetch} from "../../../service/fetch";
import {Events} from "../../../events/events";
import {Message} from "../../../ui/component/message/message";
import {User} from "@/common/beans/user";

/**
 * 更新中心配置信息
 * @param action
 * @returns {IterableIterator<any>}
 */
export function* updateCenterConfig(action:any){
    const params = {
        url: SetApi.更新中心配置信息,
        data: action.params
    };
    try {
        const response = yield call(Fetch.post.bind(Fetch, params));
        response && Message.success("保存成功");
        // 如果非
        if(!User.isHQ){
            yield fork(getApprovalPermission, action);
        }

    }catch (e) {

    }
}

/**
 * 中心相关审批权限
 * @param action
 * @returns {IterableIterator<any>}
 */
function* getApprovalPermission(action:any) {
    const params = {
        url: SetApi.合同审批权限列表,
        data: action.params
    }
    try{
        const response = yield call(Fetch.post.bind(Fetch), params);
        yield put ({
            type: Events.GET_APPROVAL_PERMISSION,
            data: response
        })
    }catch (e) {

    }
}
