/*
* desc:教学活动明细
* User: lyon.li@gymboglobal.com
* Date: 2018/12/17
* Time: 上午14:10
* */

import {call, put} from "redux-saga/effects";
import {Fetch} from "@/service/fetch";
import {ActivityApi} from "@/api/activityApi";
import {CustomerApi} from "@/api/customerApi";
import {SetApi} from "@/api/settingApi";
import {Events} from "@/events/events";
import {Action} from "@/.h/global";
import { User } from '@/common/beans/user';

// 设置教学活动类型数据
export const setTypeDef = data => {
    return {
        type: Events.SET_ACTIVITY_TYPE_DEF,
        data
    }
};

// 设置教学活动的各字段值
export const setActivityData = (type: string, data) => {
    return {
        type: Events[`SET_${type}`],
        data
    }
};

// 设置教学活动的教师列表
export const setClassroomList = (list) => {
    return {
        type: Events.SET_CLASSROOMLIST,
        list
    }
};

// 设置中心所有在职人员
export const setStaffListOnWork = list=>{
    return {
        type: Events.SET_STAFFLISTONWORK,
        list,
    }
};

// 查看详情/查看审批时设置所有数据
export const setAllActivityData = data => {
    return {
        type: Events.SET_ALL_ACTIVITY_DATA,
        data
    }
};

// 签到时，设置选中的宝宝
export const setSelectedBabyId = data => {
    return {
        type: Events.SET_SELECTED_BABY_ID,
        data
    }
};

// 报名时，设置选中的宝宝
export const setSelectedBaby = data => {
    return {
        type: Events.SET_SELECTED_BABY,
        data
    }
};

// 报名时，设置选中的宝宝
export const setSelectedCourse = data => {
    return {
        type: Events.SET_SELECTED_COURSE,
        data
    }
};

// 设置活动签到列表
export const setSignList = data => {
    return {
        type: Events.SET_SIGN_LIST,
        data
    }
};

// 重置报名流程的数据
export const resetCheckinData = () => {
    return {
        type: Events.RESET_CHECKIN_DATA,
        data: {
            selectedActivity: [],  // 客户360报名选中的活动
            selectedBaby360: {},   // 客户360报名时选中的宝宝
            selectedBaby: [],     // 报名时选中的宝宝
            selectedCourse: {},   // 课程包
        }
    }
};

// 设置教师的可用性
export const setClassroomUsable = (bool) => {
    return {
        type: Events.SET_CLASSROOM_USABLE,
        data: bool,
    }
};

// 重置所有数据
export const resetActivityData = () => {
    return {
        type: Events.RESET_ACTIVITY_DATA,
        data: {
            activityField: undefined,           // 活动地点
            attachments: [],                    // 附件
            describe: '',                       // 活动详情
            estimateActivityCost: 0,            // 规划的活动费用
            estimateParticipantNum: 0,          // 规划的宝宝数
            estimateTotalCourse: [],             // 规划的总扣课数
            estimateTotalFee: '',                // 规划的总付费金额
            fieldType: undefined,               // 地点类型
            estimateFreeGifts: [],              // 规划的活动赠品
            purpose: undefined,                 // 活动目的
            staffs: [],                         // 参与员工
            staffsName: [],                     // 参与员工姓名
            staffList:[],                       // 在职员工列表
            babys: [],                           // 参与会员
            startDateTime: Date.now(),          // 活动时间
            theme: '',                          // 活动名称
            type: undefined,                    // 活动类型
            payMode: '',                         // 扣费方式
            classRoomId: undefined,             // 教室Id
            classroomName: '',                  // 教室名称
            duration: undefined,                // 时长
            approvalStatus: '',                 // 审批状态
            classroomList: [],                  // 教室列表,
            applicationConsumption: '',         // 扣课数
            applicationFee: '',                  // 付费金额
            selectedBaby: [],                   // 报名时选中的宝宝
            selectedBabyId: [],                 // 签到时选中的宝宝
            selectedCourse: [],                 // 选中的课程包
            signList: [],                       // 签到列表,
            actualActivityCost: '',             // 实际活动费用
            actualFreeGifts: [],                // 实际活动赠品
            actualParticipantNum: [],           // 实际宝宝数
            actualTotalCourse: '',              // 实际总扣课数
            actualTotalFee: '',                 // 实际总付费金额
            classroomUsable: true,              // 教室的可用性
        }
    }
};

// 获取教学活动类型数据
export function* getActivityTypeDef(action: Action) {
    const params = {
        url: ActivityApi.分类定义,
        data: { currentCenterId: action.params.currentCenterId}
    }
    // 查询分类
    try {
        const intent = yield call(Fetch.post.bind(Fetch),params);
        let typeArr = [];   // 储存类型code
        if (Array.isArray(intent)) {
            intent.forEach(function (item) {
                const {codeValue} = item;
                if (codeValue === '活动类型' || codeValue === '教学活动目的' || codeValue === '活动地点类型' || codeValue === '会员活动付费方式' || codeValue === '教学活动-审批状态' || codeValue === '会员活动参与状态' || codeValue === '会员活动时长' || codeValue === '家庭关系') {
                    typeArr.push(item.code);
                }
            });
        }

        // 查询定义类型
        const types = yield call(Fetch.post.bind(Fetch), {
            url: ActivityApi.类型定义,
            data: {
                intent: typeArr,
                currentCenterId: User.currentCenterId
            }
        });

        if (Array.isArray(types)) {
            yield put(setTypeDef(types));
        }
    } catch (e) {

    }
}

// 获取所有在岗员工
export const getStaffListOnWork = function* (action:Action) {
    // 获取本中心可用教室列表
    const params = {
        url: CustomerApi.查询中心所有在职人员,
        data: action.params,
    };
    try {
        const list = yield call(Fetch.post.bind(Fetch), params);
        if (Array.isArray(list) && list.length > 0) {
            yield put(setStaffListOnWork(list));
        }
    } catch (e) {

    }
};

// 获取教室列表
export const getClassroomList = function* (action: Action) {
    // 获取本中心可用教室列表
    const params = {
        url: SetApi.获取中心可用教室,
        data: {
            currentCenterId: action.params
        }
    };
    try {
        const list = yield call(Fetch.post.bind(Fetch), params);
        if (Array.isArray(list) && list.length > 0) {
            yield put(setClassroomList(list));
        }
    } catch (e) {

    }
};

// 新建教学活动
export function* createActivity(action) {
    const {data, cb} = action.params;
    const params = {
        url: ActivityApi.创建活动,
        data
    };

    try {
        const res = yield call(Fetch.post.bind(Fetch), params);
        if (res && typeof cb === 'function') {
            cb();
        }
    } catch (e) {

    }
}

// 编辑教学活动
export function* editActivity(action) {
    const {data, cb} = action.params;
    const params = {
        url: ActivityApi.编辑教学活动,
        data,
    };

    try {
        const res = yield call(Fetch.post.bind(Fetch), params);
        if (res && typeof cb === 'function') {
            cb();
        }
    } catch (e) {

    }
}

// 获取教学活动的详情
export function* getActivityDetail(action) {
    const params = {
        url: ActivityApi.获取活动详情,
        data: action.params
    };

    try {
        const res = yield call(Fetch.post.bind(Fetch), params);
        // 后台返回的参与员工列表，转换成一个id列表和一个名字列表，分别用于在新建和查看状态下显示
        const staffs = res.staffs;
        res.staffs = staffs.map(item=>item.id);
        res.staffsName = staffs.map(item=>item.name);
        yield put(setAllActivityData(res));

    } catch (e) {

    }
}

// 获取签到列表
export function* getSignList(action) {
    const {data, cb} = action.params;
    const params = {
        url: ActivityApi.签到列表,
        data
    };

    try {
        const res = yield call(Fetch.post.bind(Fetch), params);
        yield put(setSignList(res.list));
        if (typeof cb === 'function') {
            cb(res)
        }
    } catch (e) {

    }
}

// 检查教室可用性
export function* checkClassRoom(action) {
    const params = {
        url: SetApi.校验教室是否可用,
        data: action.params,
    };

    try {
        const res = yield call(Fetch.post.bind(Fetch), params);
        if (res) {
            // 设置当前教室可用
            yield put(setClassroomUsable(true));
        }
    } catch (e) {
        // 设置当前教室不可用
        yield put(setClassroomUsable(false));
    }
}

