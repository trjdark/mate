/**
 * Desc: 教学活动列表
 * User: vicky.yu
 * Date: 2018/12/17,
 * Time: 下午17:00
 */

import {call, put} from "redux-saga/effects";
import {Fetch} from "@/service/fetch";
import {ActivityApi} from "@/api/activityApi"
import {Events} from "@/events/events";

/**
 * 设置选中的宝宝
 */
export const selectBaby = data => {
    return {
        type: Events.SELECT_BABY,
        data
    }
};

/**
 * 设置选中的活动
 */
export const selectActivity = data => {
    return {
        type: Events.SELECT_ACTIVITY,
        data
    }
};

// 教学活动列表
export function* getactivityData(action: any) {
    const params = {
        url: ActivityApi.教学活动列表,
        data: action.params
    };
    try {
        const response = yield call(Fetch.post.bind(Fetch), params);
        yield put({
            type: Events.GET_ACTIVITY_LIST,
            data: response
        })
    } catch (err) {

    }
}

// 设置360会员活动列表
export function* getActivityList(action: any) {
    const params = {
        url: ActivityApi.会员教学活动列表,
        data: action.params
    };
    try {
        const response = yield call(Fetch.post.bind(Fetch), params);
        yield put({
            type: Events.SET_VIP_ACTIVITY_LIST,
            data: response
        })
    } catch (err) {

    }
}
