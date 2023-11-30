/**
 * Desc: 教学-课程表
 * User: Debby.Deng
 * Date: 2018/12/17,
 * Time: 下午2:53
 */

import {TeachingApi} from "@/api/teachingApi";
import {call, fork, put} from "redux-saga/effects";
import {Fetch} from "@/service/fetch";
import {Events} from "@/events/events";
import {message} from "antd";

/**
 * 获取INS，HI列表
 * @param action
 * @returns {any}
 */

export function* initSchedule(action: any) {
    yield fork(getInsHiList, action);
    yield fork(getTechRooms, action);
    yield fork(getCenterCourseList, action);
}

/**
 * 获取GA,GB列表
 * @param action
 * @returns {any}
 */

export function* teachingGaGbList(action: any) {
    yield fork(getGAHGAlist, action);
    yield fork(getGBHGBlist, action);
}

/**
 * 获取INS，HI列表
 * @param action
 * @returns {any}
 */

export function* getInsHiList(action: any) {
    const insParams = Object.assign({}, action.params, {postNameList: ['INS', 'HI']});
    const params = {
        url: TeachingApi.查询中心INS含HI列表,
        data: insParams
    };
    try {
        const response = yield call(Fetch.post.bind(Fetch), params);
        yield put({
            type: Events.GET_TEACHING_INS_HI,
            data: response
        })
    } catch (e) {

    }
}

/**
 * 查询中心可用教室列表
 * @param action
 * @returns {any}
 */

export function* getTechRooms(action: any) {
    const params = {
        url: TeachingApi.查询中心可用教室列表,
        data: action.params
    };
    try {
        const response = yield call(Fetch.post.bind(Fetch), params);
        if (!response.length) {
            message.error('请先添加教室列表', 2);
        }
        yield put({
            type: Events.GET_TEACHING_ROOM_LIST,
            data: response
        })
    } catch (e) {

    }
}

/**
 * 查询中心课程信息列表
 * @param action
 * @returns {any}
 */

export function* getCenterCourseList(action: any) {
    const params = {
        url: TeachingApi.查询中心课程信息列表,
        data: action.params
    };
    try {
        const response = yield call(Fetch.post.bind(Fetch), params);
        yield put({
            type: Events.GET_TEACHING_COURSE_LIST,
            data: response
        })
    } catch (e) {

    }
}

/**
 * 教学查询GA,HGA列表
 * @param action
 * @returns {any}
 */

export function* getGAHGAlist(action: any) {
    const params = {
        url: TeachingApi.GAHGA列表,
        data: {...action.params, postNameList: [`GA`, `HGA`]}
    };
    try {
        const response = yield call(Fetch.post.bind(Fetch), params);
        yield put({
            type: Events.GET_TEACHING_GA_LIST,
            data: response
        })
    } catch (e) {

    }
}

/**
 * 教学查询GA,HGA列表
 * @param action
 * @returns {any}
 */

export function* getGBHGBlist(action: any) {
    const params = {
        url: TeachingApi.GBHGB列表,
        data: {...action.params, postNameList: [`GB`, `HGB`]}
    };
    try {
        const response = yield call(Fetch.post.bind(Fetch), params);
        yield put({
            type: Events.GET_TEACHING_GB_LIST,
            data: response
        })
    } catch (e) {

    }
}

/**
 * 更新签到时间
 * @param action
 * @returns {IterableIterator<PutEffect<{type: Events; data: {time: any; isBeforeToday: any}}>>}
 */
export function* updateCheckInTime (action:any) {
    const data = {
        lastCheckInTime: action.params.startOf('day').valueOf(),
    };
    yield put({
        type: Events.UPDATE_CHECK_IN_TIME,
        data: data
    })
}
