/**
 * Desc: 分配客户
 * User: Debby.Deng
 * Date: 2018/9/30,
 * Time: 下午2:44
 */

import {CustomerApi} from "@/api/customerApi";
import {call, fork, put} from "redux-saga/effects";
import {Fetch} from "@/service/fetch";
import {Events} from "@/events/events";
import {User} from "@/common/beans/user";
import {Message} from "@/ui/component/message/message";

export function* getAdvanceButtons(action:any){
    const params = {
        url: CustomerApi.获取高级查询按钮组,
        data: action.params
    };
    try {
        const response = yield call(Fetch.post.bind(Fetch), params);
        yield put({
            type: Events.GET_ADVANCED_BUTTON_LIST,
            data: response
        })
    }catch (e) {

    }
}
// 获取导航栏状态的数量
export function* getNavNum(action:any){
    const params = {
        url: CustomerApi.获取状态列表,
        data: action.params
    };
    try {
        if(action.params===null){// 清空数据
            yield put({
                type: Events.GET_ASSIGN_STATUS,
                data: {allocate: 0,
                    contact: 0,
                    expiredMember: 0,
                    newMember: 0,
                    oldMember: 0,
                    promise: 0,
                    receive: 0,
                    toAllocate: 0,
                    visit: 0}
            })
        }else{
            const response = yield call(Fetch.post.bind(Fetch), params);
            yield put({
                type: Events.GET_ASSIGN_STATUS,
                data: response
            })
        }

    }catch (e) {

    }
}
// 获取查询出的分配客户列表
export function* getAssignCustomerList(action:any){
    const params = {
        url: CustomerApi.获取分配客户列表,
        data: action.params
    };
    try {
        if(action.params===null){// 清空数据
            yield put({
                type: Events.CLEAR_ASSIGN_TABLE_LIST,
                data: {}
            });
        }else{
            yield put({
                type: Events.CLEAR_ASSIGN_TABLE_LIST,
                data: {}
            });
            let response = yield call(Fetch.post.bind(Fetch), params);
            const {pageNo=0,pageSize=10,totalSize=0}=response;
            // 如果后台返回当前pageNo大于实际总页数，说明当前pageNo下已无数据，有必要pageNo-1，再请求一次
            if(pageNo>Math.ceil(totalSize/pageSize) && totalSize>0){
                const newQuery=Object.assign({},params.data,{pageNo:pageNo-1>0? pageNo-1 : 1});
                response = yield call(Fetch.post.bind(Fetch), { url: CustomerApi.获取分配客户列表,
                    data: newQuery});
            }
            yield put({
                type: Events.GET_ASSIGN_TABLE_LIST,
                data: response
            })
        }
    }catch (e) {

    }
}
// 删除某个高级查询按钮
export function* deleteAdvanceButton(action:any){
    const params = {
        url: CustomerApi.删除自定义查询,
        data: action.params
    };
    try {
        const response = yield call(Fetch.post.bind(Fetch), params);
        response && Message.success('删除成功');
        yield fork(getAdvanceButtons,{params:{currentCenterId:User.currentCenterId}})
        /*yield put({
            type: Events.GET_ADVANCED_BUTTON_LIST,
            data: response
        })*/
    }catch (e) {

    }
}

// 保存某个高级查询按钮
export function* saveAdvanceButton(action:any){
    const params = {
        url: CustomerApi.保存自定义查询,
        data: action.params
    };
    try {
        const response = yield call(Fetch.post.bind(Fetch), params);
        response && Message.success('保存成功');
        yield put({
            type: Events.GET_ADVANCED_BUTTON_ID,
            data: response
        });
        yield call(getAdvanceButtons,{params:{currentCenterId:User.currentCenterId}});
        action.callback && action.callback();
    }catch (e) {

    }
}

// 获取高级查询区域列表
export function* getDistrictList(action:any){
    const params = {
        url: CustomerApi.获取区域列表,
        data: action.params
    };
    try {
        const response = yield call(Fetch.post.bind(Fetch), params);
        yield put({
            type: Events.GET_ASSIGN_DISTRICT,
            data: response
        })
    }catch (e) {

    }
}

// 获取高级查询课程包列表
export function* getAssignCenterCourse(action:any){
    const params = {
        url: CustomerApi.获取高级查询中心课程包,
        data: action.params
    };
    try {
        const response = yield call(Fetch.post.bind(Fetch), params);
        yield put({
            type: Events.GET_ASSIGN_PACKAGE_LIST,
            data: response
        })
    }catch (e) {

    }
}

// 获取ga列表
export function* getAssignGaList(action:any){
    const params = {
        url: CustomerApi.查询GAHGA在职离职半年,
        data: action.params
    };
    try {
        const response = yield call(Fetch.post.bind(Fetch), params);
        yield put({
            type: Events.GET_ASSIGN_GA_LIST,
            data: response
        })
    }catch (e) {

    }
}

// 获取gb列表
export function* getAssignGbList(action:any){
    const params = {
        url: CustomerApi.查询GBHGB在职离职半年,
        data: action.params
    };
    try {
        const response = yield call(Fetch.post.bind(Fetch), params);
        yield put({
            type: Events.GET_ASSIGN_GB_LIST,
            data: response
        })
    }catch (e) {

    }
}

// 获取分配中心列表
export function* getAssignCenterList(action:any){
    const params = {
        url: CustomerApi.获取分配所有中心列表,
        data: action.params
    };
    try {
        const response = yield call(Fetch.post.bind(Fetch), params);
        const list = response.filter(item=>item.centerCode !== 'HQ001');    // 过滤掉总部中心
        yield put({
            type: Events.GET_ASSIGN_CENTER_LIST,
            data: list
        })
    }catch (e) {

    }
}

// 获取高级查询INS列表
export function* getAssignINSList(action:any){
    const params = {
        url: CustomerApi.获取高级查询INS列表,
        data: action.params
    };
    try {
        const response = yield call(Fetch.post.bind(Fetch), params);
        yield put({
            type: Events.GET_ASSIGN_INS_LIST,
            data: response
        })
    }catch (e) {

    }
}
