/**
 * desc: 首页业务
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/8/22
 * Time: 上午9:21
 */
import {call, put, fork, select} from "redux-saga/effects";
import {Fetch} from "@/service/fetch";
import {SetApi} from "@/api/settingApi";
import {Events} from "@/events/events";
import {User} from "@/common/beans/user";
import {reportApi} from "@/api/reportApi";
import {ContractApi} from "@/api/contractApi";
import {Cookie} from "@/service/cookie";
import {CustomerApi} from "@/api/customerApi";
import {TelephoneApi} from "@/api/telephoneApi";
import {selectNoReadNotice} from "@/saga/selectors/home";

/**
 * 通用模块初始化
 * @param param
 * @returns {IterableIterator<any>}
 */
export function* commonInit(action:any) {
    yield fork(getPermissionList, action);
    yield fork(getCodeInfoList,action);
    yield fork(getNoReadNotice,action);
    yield fork(getBusinessSourceList, action);
    // 如果非总部中心
    if(!User.isHQ){
        yield fork(getApprovalPermission, action);
        yield fork(getCenterTotalEmployeeList, action);
        // 如果CD或GI，在非总部中心需要获取预警信息
        if(User.role.includes("CD") || User.role.includes("GI")){
            yield fork(getEarlyWarningInfo,action);
        }

    }
}

/**
 * 获取中心基本配置（v2.0）
 * @param action
 * @returns {IterableIterator<ForkEffect>}
 */
export function* getBasicConfig(action:any) {
    yield call(setCookieInfo);
    yield fork(getUserPostPermission, action) || [];
    yield fork(getStaffCenterList, action);
    yield fork(isIncludeTmkCenter, action);
    if(!User.isHQ){
        yield fork(hasPaymentCenter, action);
        yield fork(hasSigmaCenter,action);

    }
}

/**
 * 设置cookie信息
 * @returns {IterableIterator<any>}
 */
function* setCookieInfo(){
    Cookie.setCookie('centerCode', User.centerCode, 2*60*60*24);
    Cookie.setCookie('userName', User.userName, 2*60*60*24)
}
/**
 * 页面初始化
 * 1.获取当前员工中心列表
 * @returns {IterableIterator<CallEffect>}
 */
export function* getStaffCenterList(action:any) {
    const params = {
        url:SetApi.获取员工中心列表,
        data: action.params
    };
    try{
        const response = yield call(Fetch.post.bind(Fetch),params);
        yield put({
            type:Events.GET_STAFF_CENTER_LIST,
            data:response
        })
    }catch(e){

    }
}

/**
 * 获取所有权限列表
 * @returns {IterableIterator<CallEffect>}
 */
function* getPermissionList(action:any) {
    const params = {
        url: SetApi.查询所有权限列表,
        data:{currentCenterId: action.params.currentCenterId},
    };
    try{
        const response = yield call(Fetch.post.bind(Fetch), params);
        yield put({
            type: Events.GET_ALL_PERMISSION_LIST,
            data: response
        })
    }catch (e) {

    }
}

/**
 * 获取code配置列表（中心列表，城市等级，）
 * @param action
 * @returns {IterableIterator<any>}
 */
export function* getCodeInfoList(action:any){
    const params = {
        url: SetApi.获取中心基本配置,
        data:{currentCenterId: User.currentCenterId}
    };
    try {
        const response = yield call(Fetch.post.bind(Fetch, params));
        yield put({
            type: Events.GET_CENTER_BASE_CONFIG,
            data: response
        })
    }catch (e) {

    }
}

/**
 * 获取员工各个中心的岗位，角色信息
 * @returns {IterableIterator<any>}
 */
function* getUserPostPermission(action:any) {
    const {staffId, currentCenterId} = action.params;
    const params = {
        url: SetApi.获取用户各个中心岗位角色信息,
        data: {
            staffId: staffId,
            currentCenterId: currentCenterId
        }
    };
    try{
        const response = yield call(Fetch.post.bind(Fetch), params);
        const roles = (response.staffRole || []).map((item:any) => item.defaultRoleName);
        yield put({
            type: Events.GET_USER_POST_ROLE_INFO,
            data: response
        });
        return roles;
    }catch (e) {

    }
}

/**
 * 中心相关审批权限
 * @param action
 * @returns {IterableIterator<any>}
 */
export function* getApprovalPermission(action:any) {
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
/**
 * 获取预警信息
 * @param params
 */
function* getEarlyWarningInfo (action) {
    const body = {
        userId: action.params.staffId,
        currentCenterId: action.params.currentCenterId
    }
    const params = {
        url: reportApi.预警信息,
        data: body
    }
    try{
        const response = yield call(Fetch.post.bind(Fetch), params);
        yield put ({
            type: Events.GET_EARLY_WARNING_ALERT,
            data: response
        })
    }catch (e) {

    }
}

/**
 *
 * @returns {IterableIterator<PutEffect<{type: Events; data: any[]}>>}
 */
export function* emptyEarlyWarningAlert() {
    yield put ({
        type: Events.GET_EARLY_WARNING_ALERT,
        data: []
    })
}

/**
 * 是否还有tmk中心
 * @param action
 * @returns {IterableIterator<any>}
 */
function* isIncludeTmkCenter (action:any) {
    const params = {
        url: SetApi.是否包含TMK中心,
        data:{
            id: action.params.currentCenterId,
            currentCenterId: action.params.currentCenterId
        },
    };
    try{
        const response = yield call(Fetch.post.bind(Fetch), params);
        yield put ({
            type: Events.INCLUDE_TMK_CENTER,
            data: response
        })
    }catch (e) {

    }
}

/**
 * 是否开通中心移动支付
 * @param action
 * @returns {IterableIterator<any>}
 */
function* hasPaymentCenter (action:any) {
    const params = {
        url: ContractApi.中心是否开通移动支付,
        data: action.params
    }
    try{
        const response = yield call(Fetch.post.bind(Fetch), params);
        yield put ({
            type: Events.INCLUDE_PAYMENT_CENTER,
            data: response
        })
    }catch (e) {

    }
}
/**
 * 中心是否有西格玛权限
 * @param action
 * @returns {IterableIterator<any>}
 */
function* hasSigmaCenter (action:any) {
    const params = {
        url: ContractApi.中心是否有西格玛权限,
        data: action.params
    }
    try{
        const response = yield call(Fetch.post.bind(Fetch), params);
        yield put ({
            type: Events.INCLUDE_SIGMA_CENTER,
            data: response
        })
    }catch (e) {

    }
}

/**
 * 获取中心所有员工列表（在职，离职，离职几个月内的员工，非总部中心）
 * @returns {IterableIterator<any>}
 */
export function* getCenterTotalEmployeeList(action:any) {
    const params = {
        url: CustomerApi.员工列表,
        data: action.params
    }
    try{
        const response = yield call(Fetch.post.bind(Fetch), params);
        yield put ({
            type: Events.GET_TOTAL_STAFF_LIST,
            data: response
        })
    }catch (e) {

    }
}

/**
 * 获取全部未读消息
 * @returns {IterableIterator<any>}
 */
function* getNoReadNotice(action:any) {
    const params = {
        url: TelephoneApi.未读消息列表,
        data: action.params
    }
    try{
        const response = yield call(Fetch.post.bind(Fetch), params);
        yield put ({
            type: Events.GET_NO_NOTICE,
            data: response
        })
    }catch (e) {

    }
}

/**
 * 读取未读消息
 * @param action
 * @returns {IterableIterator<any>}
 */
export function* readNoNotice(action:any) {
    const mainId = action.data;
    const noReadNoticeList = yield select((state:any) => selectNoReadNotice(state));
    const response = noReadNoticeList.filter((item:any) => item.mainId !== mainId);
    yield put ({
        type: Events.GET_NO_NOTICE,
        data: response
    })
}

/**
 * 接受消息
 * @param action
 * @returns {IterableIterator<any>}
 */
export function* acceptNoNotice(action:any) {
    const notice = action.data;
    const noReadNoticeList = yield select((state:any) => selectNoReadNotice(state));
    // 避免重复推送
    if(noReadNoticeList.map((item) => item.mainId).includes(notice.mainId)){
        return;
    }
    const response = [notice, ...noReadNoticeList];
    yield put ({
        type: Events.GET_NO_NOTICE,
        data: response
    })
}

/**
 * 记录用户名
 * @param action
 * @returns {IterableIterator<PutEffect<{type: Events; data: *}>>}
 */
export function* saveUserName(action:any) {
    yield put ({
        type: Events.USERNAME,
        data: action.params
    })
}

/**
 * 关闭绑定信息提示框
 * @param action
 * @returns {IterableIterator<PutEffect<{type: Events; data: *}>>}
 */
export function* closeAlertBingMsg() {
    yield put ({
        type: Events.ALERT_FLAG,
    })
}

/**
 * 获取业务来源
 * @param action
 * @returns {IterableIterator<any>}
 */
function* getBusinessSourceList(action:any){
    const body = {
        currentCenterId: action.params.currentCenterId
    }
    const params = {
        url: SetApi.业务来源配置列表,
        data: body
    }
    try{
        const response = yield call(Fetch.post.bind(Fetch), params);
        yield put ({
            type: Events.GET_BUSINESS_SOURCE_LIST,
            data: response
        })
    }catch (e) {

    }
}

