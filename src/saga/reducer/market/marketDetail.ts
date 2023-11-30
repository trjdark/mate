/*
* desc:市场渠道明细
* User: lyon.li@gymboglobal.com
* Date: 2018/11/28
* Time: 上午14:10
* */
import {handleActions} from 'redux-actions';
import {Events} from "@/events/events";
import {Action} from "@/.h/global";

// 定义state的默认值
const defaultState = {
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
    attachmentList:null,            // 附件列表，这个字段是为了兼容老数据，有数据的情况下，是个数据，否则为空
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
    realAveragePackageAmount:0,     // 平均课程包金额实际
    realActivityTotalCost:0,        // 活动总费用真实
    realEachLeadsCost:0,            // 实际每leads成本
    realEachContractCost:0,         // 实际每合同成本
    realMemberTransferRate:0,       // 实际会员转化率
    realSaleExpendsRate:0,          // 实际营销费用占比
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
    marketingActivityCode: '',      // 市场渠道编码
    id:'',                          // 市场渠道Id
    cid: '',
    createBy: '',                   // 创建人
    createDate: '',                 // 创建时间
    lastUpdateBy: '',               // 最后更新人
    lastUpdateDate: '',             // 最后更新日期
};

const reducer = handleActions(
    {
        [Events.SET_ESTIMATEDFIELDCOST](state: any, action: Action) {
            // 设置规划场地费用
            return {
                ...state,
                estimatedFieldCost: action.value
            };
        },
        [Events.SET_ESTIMATEDMATERIALCOST](state: any, action: Action) {
            // 设置规划物料费用
            return {
                ...state,
                estimatedMaterialCost: action.value
            };
        },
        [Events.SET_ESTIMATEDPERSONNELCOST](state: any, action: Action) {
            // 设置规划人员费用
            return {
                ...state,
                estimatedPersonnelCost: action.value
            };
        },
        [Events.SET_ESTIMATEDDAYS](state: any, action: Action) {
            // 设置规划天数
            return {
                ...state,
                estimatedDays: action.value
            };
        },
        [Events.SET_REALFIELDCOST](state: any, action: Action) {
            // 设置实际场地费用
            return {
                ...state,
                realFieldCost: action.value
            };
        },
        [Events.SET_REALMATERIALCOST](state: any, action: Action) {
            // 设置实际物料费用
            return {
                ...state,
                realMaterialCost: action.value
            };
        },
        [Events.SET_REALPERSONCOST](state: any, action: Action) {
            // 设置实际人员费用
            return {
                ...state,
                realPersonCost: action.value
            };
        },
        [Events.SET_REALDAYS](state: any, action: Action) {
            // 设置实际活动天数
            return {
                ...state,
                realDays: action.value
            };
        },
        [Events.SET_REALACTIVITYTOTALCOST](state: any, action: Action) {
            // 设置实际总费用
            return {
                ...state,
                realActivityTotalCost: action.value
            };
        },
        [Events.SET_ESTIMATEDLEADS](state: any, action: Action) {
            // 设置规划收取leads数量
            return {
                ...state,
                estimatedLeads: action.value
            };
        },
        [Events.SET_MEMBERTRANSFERRATE](state: any, action: Action) {
            // 设置leads转化率
            return {
                ...state,
                memberTransferRate: action.value
            };
        },
        [Events.SET_ESTIMATEDMEMBER](state: any, action: Action) {
            // 设置总共收取会员数
            return {
                ...state,
                estimatedMember: action.value
            };
        },
        [Events.SET_AVERAGEPACKAGEAMOUNT](state: any, action: Action) {
            // 设置规划平均每课包金额
            return {
                ...state,
                averagePackageAmount: action.value
            };
        },
        [Events.SET_ATTACHMENT](state: any, action: Action) {
            // 设置上传附件信息
            const {attachmentName, attachmentId} = action;
            return {
                ...state,
                attachmentName,     // 附件名称
                attachmentId,       // 附件url
                attachmentList: null,   // 此处是为了兼容老数据，当上传新附件时，把所有的老附件替换掉
            };
        },
        [Events.SET_MARKET_INFO](state: any, action: Action) {
            // 设置市场信息
            return {
                ...state,
                ...action.data
            };
        },
        [Events.SET_CHANNELTYPE_LIST](state: any, action: Action) {
            // 设置市场渠道列表
            return {
                ...state,
                channelTypeList: action.data
            };
        },
        [Events.RESET_MARKET_DATA](state: any, action: Action) {
            // 重置所有数据
            return {
                ...state,
                ...action.data
            };
        },
    },
    defaultState
);

let marketDetailReducer: any = {};
marketDetailReducer.marketDetail = reducer;
export default marketDetailReducer;
