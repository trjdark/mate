/*
* desc:教学活动明细
* User: Vicky.Yu
* Date: 2018/12/17
* Time: 下午16:30
* */

import {ServiceActionEnum} from "../serviceActionsEnum";
import {ActivityApi} from "../../api/activityApi";
import {Fetch} from "../../service/fetch";

// 活动列表数据
export const getActivityData = (params: any) => {
    return {
        type: ServiceActionEnum.获取教学活动列表,
        params
    }
};

// 删除活动
export const getdeleteActivity = (params: any): Promise<any> => {
    const param = {
        url: ActivityApi.删除教学活动,
        data: params
    };
    return Fetch.post(param)
        .then((res: any) => {
            return Promise.resolve(res)
        }, (err: any) => {
            return Promise.reject(err)
        })
};

// 360活动列表
export const getActivityList = (params: any) => {
    return {
        type: ServiceActionEnum.获取360会员教学活动列表,
        params
    }
};

// 查看360会员活动详情
export const getActivityDetails = (params: any) => {
    const param = {
        url: ActivityApi.查看会员活动详情,
        data: params
    };
    return Fetch.post(param)
        .then((res: any) => {
            return Promise.resolve(res)
        }, (err: any) => {
            return Promise.reject(err)
        })
}
