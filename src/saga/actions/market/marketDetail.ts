/*
* desc:市场渠道明细
* User: lyon.li@gymboglobal.com
* Date: 2018/11/29
* Time: 上午14:10
* */

import {call, put} from "redux-saga/effects";
import {Fetch} from "@/service/fetch";
import {CustomerApi} from "@/api/customerApi"
import {SetApi} from "@/api/settingApi";
import {Events} from "@/events/events";

// 设置活动规划表单的值
export const setInputValue = (type, value) => {
    return {
        type: Events[type],
        value
    }
};

// 设置上传附件信息
export const setAttachment = (attachmentId, attachmentName) => {
    return {
        type: Events.SET_ATTACHMENT,
        attachmentName,
        attachmentId,
    }
};

// 设置市场渠道信息
const setMarketInfo = data => {
    return {
        type: Events.SET_MARKET_INFO,
        data
    }
};

// 设置渠道来源列表
const setChannelTypeList = data => {
    return {
        type: Events.SET_CHANNELTYPE_LIST,
        data
    }
};

// 重置所有数据
export const resetData = () => {
    return {
        type: Events.RESET_MARKET_DATA,
        data: {
            theme: '',                      // 市场渠道名称
            purpose: undefined,             // 市场渠道目的
            startDate: Date.now(),          // 开始日期
            endDate: Date.now(),            // 结束日期
            channelType: undefined,         // 市场渠道来源
            appearanceType: undefined,      // 市场渠道出现方式
            channelRemark: '',              // 市场渠道备注
            describe: '',                   // 活动详情描述
            attachmentId: '',               // 附件url
            attachmentName: '',             // 附件名称
            attachmentList: null,           // 老数据的附件列表
            estimatedFieldCost: 0,          // 场地费用规划
            realFieldCost: 0,               // 场地费用真实
            estimatedMaterialCost: 0,       // 物料费用规划
            realMaterialCost: 0,            // 物料费用真实
            estimatedPersonnelCost: 0,      // 人员费用规划
            realPersonCost: 0,              // 人员费用真实
            estimatedDays: 0,               // 活动天数规划
            realDays: 0,                    // 活动天数真实
            estimatedLeads: 0,              // leads数量计划
            realTotalLeadsNum: 0,                   // leads数量真实
            memberTransferRate: 0,          // leads转化率规划
            estimatedMember: 0,             // 收取会员数计划
            realTotalMemberNum: 0,                  // 收取会员数真实
            realTotalDiscountAmmount: 0,                  // 总课包金额真实
            averagePackageAmount: 0,        // 平均课程包金额规划
            realAveragePackageAmount: 0,     // 平均课程包金额实际
            realEachLeadsCost: 0,            // 实际每leads成本
            realEachContractCost: 0,         // 实际每合同成本
            realMemberTransferRate: 0,       // 实际会员转化率
            realActivityTotalCost: 0,        // 活动总费用真实
            realSaleExpendsRate: 0,          // 实际营销费用占比
            averageMemberTransferRate: 0,   // leads会员转化率(平均值)
            maxMemberTransferRate: 0,       // leads会员转化率(最大)
            minMemberTransferRate: 0,       // leads会员转化率(最低)
            avgAveragePackageAmount: 0,     // 平均每单课程包金额(平均值)
            maxAveragePackageAmount: 0,     // 平均每单课程包金额(最高)
            minAveragePackageAmount: 0,     // 平均每单课程包金额(最低)
            avgSaleExpendsRate: 0,          // 营销费用占比(平均)
            maxSaleExpendsRate: 0,          // 营销费用占比(最大)
            minSaleExpendsRate: 0,          // 营销费用占比(最小)
            avgEachLeadsCost: 0,            // 每leads成本(平均)
            maxEachLeadsCost: 0,            // 每leads成本(最大)
            minEachLeadsCost: 0,            // 每leads成本(最小)
            avgEachContractCost: 0,         // 每合同成本(平均)
            maxEachContractCost: 0,         // 每合同成本(最大)
            minEachContractCost: 0,         // 每合同成本(最小)
            channelTypeList: [],            // 市场渠道列表
            applyStaffId: '',               // 申请人员ID
            applyTime: '',                  // 申请时间
            approvalStaffId: '',            // 审批人Id
            approvalStatus: '',             // 审批状态
            approvalTime: '',               // 审批时间
            id: '',                          // 市场渠道Id
            marketingActivityCode: '',      // 市场渠道编码
            cid: '',
            createBy: '',                   // 创建人
            createDate: '',                 // 创建时间
            lastUpdateBy: '',               // 最后更新人
            lastUpdateDate: '',             // 最后更新日期
        }
    }
};

// 获取市场渠道的字典数据
export function* getChannelType(action: any) {
    const params = {
        url: SetApi.根据类型获取字典数据,
        data: action.params
    };
    try {
        const res = yield call(Fetch.post.bind(Fetch), params);
        yield put(setChannelTypeList(res));
    } catch (err) {
        console.log(err);
    }
}

// 新增市场渠道
export function* createMarketInfo(action: any) {
    const {data, cb, openNotification} = action.params;
    const params = {
        url: CustomerApi.新增市场渠道信息,
        data: data
    };
    try {
        const res = yield call(Fetch.post.bind(Fetch), params);
        yield cb();
        if (res.hasApprovalStaff === 0) {
            yield openNotification();
        }
    } catch (err) {
        console.log(err);
    }
}

// 更新市场渠道
export function* updateMarketInfo(action: any) {
    const {data, cb} = action.params;
    const params = {
        url: CustomerApi.更新市场渠道信息,
        data: data
    };
    try {
        yield call(Fetch.post.bind(Fetch), params);
        yield cb();
    } catch (err) {
        console.log(err);
    }
}

// 获取非会员活动历史数据
export function* getHistoryData(action: any) {
    const params = {
        url: CustomerApi.获取非会员活动历史数据,
        data: action.params
    };

    try {
        const res = yield call(Fetch.post.bind(Fetch), params);
        if (res) {
            yield put(setMarketInfo(res));
        }
    } catch (e) {
        console.log(e);
    }
}

// 获取市场渠道详细信息
export function* getMarketInfo(action: any) {
    const params = {
        url: CustomerApi.查看市场渠道信息,
        data: action.params
    };

    try {
        const res = yield call(Fetch.post.bind(Fetch), params);
        yield put(setMarketInfo(res));
    } catch (e) {
        console.log(e);
    }
}

// 审批市场渠道
export function* approveMarket(action: any) {
    const {data, cb} = action.params;
    const params = {
        url: CustomerApi.审核市场渠道信息,
        data: data
    };

    try {
        const res = yield call(Fetch.post.bind(Fetch), params);
        if (res) {
            yield cb();
        }
    } catch (e) {
        console.log(e);
    }
}

// 拒绝市场渠道
export function* refuseMarket(action: any) {
    const {data, cb} = action.params;
    const params = {
        url: CustomerApi.拒绝市场渠道信息,
        data: data
    };

    try {
        const res = yield call(Fetch.post.bind(Fetch), params);
        if (res) {
            yield cb();
        }
    } catch (e) {
        console.log(e);
    }
}
