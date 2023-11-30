/*
* desc:教学活动明细
* User: lyon.li@gymboglobal.com
* Date: 2018/12/17
* Time: 上午14:10
* */

import {ServiceActionEnum} from "../serviceActionsEnum";
import {Fetch} from "@/service/fetch";
import {ActivityApi} from "@/api/activityApi";
import {SetApi} from "@/api/settingApi";

// 获取教学活动类型定义数据
export const getActivityTypeDef = (params:any) => {
    return {
        type: ServiceActionEnum.获取教学活动类型数据,
        params
    }
};

// 新建教学活动
export const createActivity = (params: any) => {
    return {
        type: ServiceActionEnum.新建教学活动,
        params
    }
};

// 编辑教学活动
export const editActivity = (params: any) => {
    return {
        type: ServiceActionEnum.编辑教学活动,
        params
    }
};

// 获取教学活动教室列表
export const getClassroomList = (params: any) => {
    return {
        type: ServiceActionEnum.获取活动教室列表,
        params
    }
};

/*
 * 查询所有在职员工
 * @params params 请求参数
 * @return action
 */
export const getStaffListOnWork = (params: any) => {
    return {
        type: ServiceActionEnum.获取所有在岗员工,
        params,
    }
};

// 获取教学活动详情
export const getActivityDetail = (params: any) => {
    return {
        type: ServiceActionEnum.获取教学活动详情,
        params
    }
};

// 获取签到列表
export const getSignList = (params: any) => {
    return {
        type: ServiceActionEnum.获取活动签到列表,
        params
    }
};

// 检查教室可用性
export const checkClassRoom = (params: any) => {
    return {
        type: ServiceActionEnum.检查教室可用性,
        params
    }
};

// 审批
export const approveActivity = (params: any) => {
    const param = {
        url: ActivityApi.审批活动,
        data: params
    };
    return Fetch.post(param);
};

// 报名
export const completeEnroll = (params: any) => {
    const param = {
        url: ActivityApi.报名,
        data: params
    };
    return Fetch.post(param)
};

// 活动签到
export const signIn = (params: any) => {
    const param = {
        url: ActivityApi.活动签到,
        data: params
    };
    return Fetch.post(param);
};

// 取消报名
export const cancelEnroll = (params: any) => {
    const param = {
        url: ActivityApi.取消报名,
        data: params
    };
    return Fetch.post(param);
};

// 查询赠品列表
export const getFreebie = (params: any) => {
    const param = {
        url: SetApi.获取产品列表,
        data: params
    };
    return Fetch.post(param);
};

// 检查员工是否冲突
export const checkStaffsConflict = (params: any) => {
    const param = {
        url: ActivityApi.校验员工是否冲突,
        data: params
    };
    return Fetch.post(param);
};
