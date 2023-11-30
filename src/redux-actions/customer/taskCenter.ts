/*
* desc:跟进预约到访，任务中心异步action
* User: lyon.li@gymboglobal.com
* Date: 2018/11/6
* Time: 上午14:10
* */

import {ServiceActionEnum} from "@redux-actions/serviceActionsEnum";

// 获取任务列表
export const getTaskCenterList = (data: any) => {
    return {
        type: ServiceActionEnum.查询任务列表,
        data
    }
};

// 删除选中的任务
export const deleteSelectedTask = (params: any) => ({
    type: ServiceActionEnum.删除选中的任务,
    params
});

// 设置选中的任务状态
export const setSelectedTask = (params: any) => ({
    type: ServiceActionEnum.设置选中任务的状态,
    params
});

// 新建任务
export const addTask = (params: any) => ({
    type: ServiceActionEnum.新建任务,
    params
});

// 编辑任务
export const editTask = (params: any) => ({
    type: ServiceActionEnum.编辑任务,
    params
});

// 获取GA
export const getGA = (params: any) => ({
    type: ServiceActionEnum.获取GA列表,
    params
});

// 获取GB
export const getGB = (params: any) => ({
    type: ServiceActionEnum.获取GB列表,
    params
});

// 获取员工列表(在职加离职半年)
export const getStuffList = (params: any) => ({
    type: ServiceActionEnum.获取中心员工列表,
    params
});

// 获取员工列表（在职）
export const getStuffListOnJob = (params: any) => ({
    type: ServiceActionEnum.获取中心在岗员工列表,
    params
});

// 获取服务对象列表
export const getCustomerList = (params: any) => ({
    type: ServiceActionEnum.获取服务对象列表,
    params
});
