/**
 * desc: 数据枚举值
 * User: Lyon.li@gymboglobal.com
 * Date: 2019/1/17
 * Time: 上午10:38
 */

/*高级搜索操作类型*/
export const enum selectType {
    选取城市 = 'selectedCity',
    选取中心 = 'selectedCenter',
    选取数据项 = 'selectedData',
    选取渠道来源 = 'selectedChannelType',
}

/*时间数据类型*/
export const timeType = {
    '1': 'MTD',
    '2': 'YTD',
    '3': '月结数据',
    '4': '历史数据',
    '11': 'Last MTD',
    '22': 'Last YTD',
};

/*中心业绩数据列表枚举值*/
export const dataOptionList = [
    {
        value: 'leadNum',
        label: 'leads数',
    },
    {
        value: 'activeLeadNum',
        label: '有效leads数',
    },
    {
        value: 'promiseLeadNum',
        label: '诺访数',
    },
    {
        value: 'visitedLeadNum',
        label: '到访数',
    },
    {
        value: 'auditionLeadNum',
        label: '试听数',
    },
    {
        value: 'freshMemberNum',
        label: '新会员数',
    },
    {
        value: 'extendMemberNum',
        label: '续约会员数',
    },
    {
        value: 'cancelMemberNum',
        label: '退单会员数',
    },
    {
        value: 'activeLeadPresentExport',
        label: '有效Leads/Leads(%)',
    },
    {
        value: 'promiseLeadPresentExport',
        label: '诺访/有效Leads(%)',
    },
    {
        value: 'visitedLeadPresentExport',
        label: '到访/诺访(%)',
    }, {
        value: 'auditionLeadPresentExport',
        label: '试听/到访(%)',
    }, {
        value: 'freshAuditionPresentExport',
        label: '新会员/试听(%)',
    },
    {
        value: 'freshVisitedPresentExport',
        label: '新会员/到访(%)',
    },
    {
        value: 'freshLeadPresentExport',
        label: '新会员/Leads(%)',
    },
    {
        value: 'contractAmount',
        label: '业绩收入',
        remark: '新会员业绩收入+续约会员业绩收入',
    },
    {
        value: 'discountAmount',
        label: '折扣金额',
        remark: '已付清的新约及续约合同课程包总额-实收价总额',
    },
    {
        value: 'freshIncomeAmount',
        label: '新会员业绩收入额',
        remark: '已付清的新约合同实收价总额',
    },
    {
        value: 'extendIncomeAmount',
        label: '续约会员业绩收入',
        remark: '已付清的续约合同实收价总额',
    },
    {
        value: 'changedIncomeAmount',
        label: '改包金额',
    },
    {
        value: 'transferIncomeAmount',
        label: '转中心金额',
    },
    {
        value: 'cancelIncomeAmount',
        label: '退单金额',
    },
    {
        value: 'otherIncomeAmount',
        label: '其他收入',
        remark: '材料、活动、玩具、其他、注册费的收款总额',
    },
    {
        value: 'netIncomeAmount',
        label: '净收入额',
    },
    {
        value: 'centerSaleAmount',
        label: '中心销售额',
    },
    {
        value: 'classHourNum',
        label: '合约总课时数',
        remark: '已付清的新约及续约合同课时总数（不含赠课）',
    },
    {
        value: 'avgClassHourPrice',
        label: '平均课时单价',
        remark: '业绩收入/合约总课时数',
    },
    {
        value: 'totalCostAmount',
        label: '总耗课金额',
        remark: '课程耗课金额+活动耗课金额+其他耗课金额',
    },
    {
        value: 'courseCostAmount',
        label: '课程耗课金额',
    },
    {
        value: 'activityCostAmount',
        label: '活动耗课金额',
    },
    {
        value: 'otherCostAmount',
        label: '其他耗课金额',
    },
    {
        value: 'totalCostNum',
        label: '总耗课数',
        remark: '课程耗课数+活动耗课数+其他耗课数',
    },
    {
        value: 'courseCostNum',
        label: '课程耗课数',
    },
    {
        value: 'activityCostNum',
        label: '活动耗课数',
    },
    {
        value: 'otherCostNum',
        label: '其他耗课数',
    },
    {
        value: 'activityMemberNum',
        label: '活跃会员数',
        remark: '有上课记录（已上且非试听课）的会员数',
    },
    {
        value: 'unsignFreshMemberNum',
        label: '未开卡会员数',
    },
    {
        value: 'centerCourseNum',
        label: '中心开班数',
    },
    {
        value: 'avgOpenClassPresent',
        label: '月教室平均开班数',
        remark: '中心开班数/启用的教室总数',
    },
    {
        value: 'avgTeacherSignPresent',
        label: '月指导师人均上课数',
        remark: '指导师上课数/中心在职INS人数',
    },
    {
        value: 'avgClassAttendPresent',
        label: '平均每班出席人次',
        remark: '当月签到总人次/当月中心开班数',
    },
    {
        value: 'avgMemberCostPresent',
        label: '会员人均月耗课',
        remark: '当月课程耗课数/总会员数',
    },
    {
        value: 'attendancePresentExport',
        label: '出席率(%)',
    },
    {
        value: 'absentPresentExport',
        label: '旷课率(%)',
    },
    {
        value: 'vacatePresentExport',
        label: '请假率(%)',
    },
    {
        value: 'presentedCourseNum',
        label: '月度赠课数量',
    },
    {
        value: 'adjustCourseNum',
        label: '调整课时',
    },{
        value: 'adjustCoursePrice',
        label: '调整金额',
    },
];

/*市场名单明细出现方式*/
export const appearanceTypeList = [
    {
        postCode: '02001',
        postName: 'net-in',
    },
    {
        postCode: '02002',
        postName: 'call-in',
    },
    {
        postCode: '02003',
        postName: 'walk-in',
    },
    {
        postCode: '02004',
        postName: 'call-out',
    },
];

/*是否再次获取类型*/
export const reacquireTypeList = [
    {postName: '再次获取Leads', postCode: '1'},
    {postName: '新Leads', postCode: '0'},
    {postName: '合计', postCode: null}
]

/*市场名单明细渠道来源*/
export const channelTypeList = [
    {
        postCode: '72001',
        postName: '地推',
    },
    {
        postCode: '72002',
        postName: '小区活动',
    },
    {
        postCode: '72003',
        postName: '网络推广',
    },
    {
        postCode: '72004',
        postName: '户外广告',
    },
    {
        postCode: '72005',
        postName: '市场合作',
    },
    {
        postCode: '72006',
        postName: '会员推荐',
    },
    {
        postCode: '72007',
        postName: '口碑介绍',
    },
    {
        postCode: '72008',
        postName: '其他',
    },
];

/*市场渠道业绩数据列表枚举值*/
export const marketDataOptionList = [
    {
        value: 'leadNum',
        label: 'Leads量',
        remark: '获取时间在查询时间内的数据',
    },
    {
        value: 'activeLeadNum',
        label: '有效Leads量',
    },
    {
        value: 'promiseLeadNum',
        label: '诺访量',
    },
    {
        value: 'visitedLeadNum',
        label: '到访量',
    },
    {
        value: 'auditionLeadNum',
        label: '试听量',
    },
    {
        value: 'freshMemberNum',
        label: '新会员量',
    },
    {
        value: 'activeLeadPresentExport',
        label: '有效Leads/Leads(%)',
    },
    {
        value: 'promiseLeadPresentExport',
        label: '诺访/有效Leads(%)',
    },
    {
        value: 'visitedLeadPresentExport',
        label: '到访/诺访(%)',
    },
    {
        value: 'auditionLeadPresentExport',
        label: '试听/到访(%)',
    },
    {
        value: 'freshAuditionPresentExport',
        label: '新会员/试听(%)',
    },
    {
        value: 'freshVisitedPresentExport',
        label: '新会员/到访(%)',
    },
    {
        value: 'freshLeadsPresentExport',
        label: '新会员/Leads数(%)',
    },
    {
        value: 'totalCostAmount',
        label: '总成本',
        remark: '实际场地费+实际人员费+实际材料费',
    },
    {
        value: 'avgLeadCostAmount',
        label: '平均Leads成本',
        remark: '总成本/Leads量',
    },
    {
        value: 'avgMemberCostAmount',
        label: '平均新会员成本',
        remark: '总成本/新会员量',
    },
];

/*渠道出现方式业绩数据列表枚举值*/
export const marketStyleDataOptionList = [
    {
        value: 'leadsNum',
        label: 'Leads数',
    },
    {
        value: 'validLeadsNum',
        label: '有效Leads数',
    },
    {
        value: 'nuoVisitNum',
        label: '诺访数',
    },
    {
        value: 'arriveVisitNum',
        label: '到访数',
    },
    {
        value: 'auditionNum',
        label: '试听数',
    },
    {
        value: 'newVipNum',
        label: '新会员数',
    },
    {
        value: 'validLeadsDivisionLeads',
        label: '有效Leads/Leads(%)',
    },
    {
        value: 'nuoVositDivisionValidLeads',
        label: '诺访/有效Leads(%)',
    },
    {
        value: 'arriveVisitDivisionNuo',
        label: '到访/诺访(%)',
    },
    {
        value: 'auditionDivisionArriveVisit',
        label: '试听/到访(%)',
    },
    {
        value: 'newVipDivisionAudition',
        label: '新会员/试听(%)',
    },
    {
        value: 'newVipDivisionArrive',
        label: '新会员/到访(%)',
    },
];

/*leads阶段枚举值*/
export const leadsPhase = [
    {postCode: '0', postName: '回收站'},
    {postCode: '1', postName: '待分配'},
    {postCode: '2', postName: '已分配'},
    {postCode: '3', postName: '已领取'},
    {postCode: '4', postName: '已联络'},
    {postCode: '5', postName: '诺访'},
    {postCode: '6', postName: '已到访'},
    {postCode: '7', postName: '新会员'},
    {postCode: '8', postName: '老会员'},
    // {postCode: '9', postName: '待续会员'},  报表不查询待续会员
    {postCode: '10', postName: '历史会员'},
];
