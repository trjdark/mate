/**
 * desc:
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/8/1
 * Time: 下午7:43
 */
import {put} from "redux-saga/effects";
import {Storage} from "@/common/utils/storage";
import {Events} from "@/events/events";
import {User} from "@/common/beans/user";
import {Routes} from "@/router/enum/routes";
import history from "../../router/history";
/**
 * 登录
 * @param code<string>
 * @returns {IterableIterator<CallEffect>}
 */
export function* login(action: any) {
    // 登录成功
    try {
        const response = action.params;
        Storage.multSet({
            '_token': response.token,
        });
        User.user = {
            chineseName: response.chineseName,
            englishName: response.englishName,
            userName: response.username,
            userId: response.userId,
            currentCenterId: response.primaryCenterId,
            currentCenterName: response.primaryCenterName,
            centerCode: response.primaryCenterCode,
            // C_HQ001 总部中心
            isHQ: (response.primaryCenterId === 'C_HQ001'),
            // 是否是admin
            isAdmin: response.adminUser,
            firstDayOfMonth: response.firstDayOfMonth
        };
        yield put({
            type: Events.GET_TOKEN_INFO,
            data: response
        });
        history.push(Routes.首页.path);
    } catch (err) {

    }
}
