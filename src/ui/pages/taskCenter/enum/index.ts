// 快速查询标签
export const convenientSearchTag = [
    {
        type: '0',
        name: '全部'
    },
    {
        type: '1',
        name: '待完成'
    },
    {
        type: '2',
        name: '已完成'
    },
    {
        type: '3',
        name: '今日待完成'
    },
    {
        type: '4',
        name: '明日待完成'
    },
    {
        type: '5',
        name: '未来7天待完成'
    },
    {
        type: '6',
        name: '未来30天待完成'
    },{
        type: '10',
        name: '本月已过期'
    },
    {
        type: '7',
        name: '已过期'
    },
    {
        type: '8',
        name: '今天已完成'
    },{
        type: '9',
        name: '诺访'
    },
];

// 任务主题的枚举值
export const enum taskThemeEnum {
    '联系' = '70001',
    '面谈' = '70002',
    '签约' = '70003',
    '其他' = '70004',
    'TMK' = '70005',
    '云语音' = '70006',
    'TMK转入中心跟进' = '70007',
    'TMK首次转入中心跟进' = '70008',
    '转至TMK跟进' = '70009',
}

// 优先级枚举
export const enum priorityEnum {
    '紧急' = '68002',
    '正常' = '68001',
}

export const enum taskStatusEnum {
    '联系成功' = '61002',
    '联系未果/停机' = '61003',
    '联系未果/无人接听' = '61004',
    '联系未果/错/空号' = '61005',
    '已到访' = '62002',
    '未到访' = '62003',
    '已签约' = '63002',
    '未签约' = '63003',
    '待完成' = '65001',
    '已完成' = '65002',

    '拒绝-没有需求' = '95001',
    '拒绝-已报其他品牌' = '95002',
    '拒绝-孩子太小' = '95003',
    '拒绝-不在所属区域' = '95004',
    '未诺访，待跟进' = '95005',
    '联系未果-错/空号' = '95006',
    '联系未果-停机' = '95007',
    '联系未果-无人接听' = '95008',
    '其他' = '95009',
    '参观' = '96001',
    '试听' = '96002',
    '活动' = '96003',
    '测评' = '96004',
    '已试听' = '97001',
    '定金' = '97002',
    // new
    '接通再跟进-在忙'= '98001',
    '接通再跟进-挂起'= '98002',
    '接通无效-客户拒绝'= '98003',
    '接通无效-不符合目标客户'= '98004',
    '接通无效--已选择其他品牌'= '98005',
    '接通无效--不在所属区域'= '98006',
    '接通无效--虚假信息'= '98007',
    '接通无效--其他'= '98008',
    '接通有效-诺访-参观'= '98101',
    '接通有效-诺访-试听'= '98102',
    '接通有效-诺访-活动'= '98103',
    '接通有效-诺访-测评'= '98104',
    '接通有效-到访-已试听'= '98201',
    '接通有效-到访-定金'= '98202',
    '未接通-未接通再利用'= '99001',
    '未接通-未接通无效'='99002',
    '未接通-空号'='99003',
}

// 任务主题的字典值（用于循环生成列表）
export const taskThemeDict = [
    {
        key: taskThemeEnum.联系,
        value: '联系',
        isCreated: true,
    },
    {
        key: taskThemeEnum.面谈,
        value: '面谈',
        isCreated: true,
    },
    {
        key: taskThemeEnum.签约,
        value: '签约',
        isCreated: true,
    },
    {
        key: taskThemeEnum.其他,
        value: '其他',
        isCreated: true,
    },
    {
        key: taskThemeEnum.云语音,
        value: '云语音',
        isCreated: false
    },
    {
        key: taskThemeEnum.TMK转入中心跟进,
        value: 'TMK转入中心跟进',
        isCreated: false,
    },
    {
        key: taskThemeEnum.TMK首次转入中心跟进,
        value: 'TMK首次转入中心跟进',
        isCreated: false
    },
    {
        key: taskThemeEnum.转至TMK跟进,
        value: '转至TMK跟进',
        isCreated: false
    },
];


// 不同主题对应的不同状态值
export const taskStatusDict = {
    [taskThemeEnum.联系]: [
        {
            key: taskStatusEnum.待完成,
            text: '待完成'
        },
        {
            key: taskStatusEnum.联系成功,
            text: '联系成功'
        },
        {
            key: taskStatusEnum["联系未果/停机"],
            text: '联系未果-停机'
        },
        {
            key: taskStatusEnum["联系未果/无人接听"],
            text: '联系未果-无人接听'
        },
        {
            key: taskStatusEnum["联系未果/错/空号"],
            text: '联系未果-错/空号'
        },
    ],
    [taskThemeEnum.面谈]: [
        {
            key: taskStatusEnum.待完成,
            text: '待完成'
        },
        {
            key: taskStatusEnum.已到访,
            text: '已到访'
        },
        {
            key: taskStatusEnum.未到访,
            text: '未到访'
        },
    ],
    [taskThemeEnum.签约]: [
        {
            key: taskStatusEnum.待完成,
            text: '待完成'
        },
        {
            key: taskStatusEnum.已签约,
            text: '已签约'
        },
        {
            key: taskStatusEnum.未签约,
            text: '未签约'
        },
    ],
    [taskThemeEnum.其他]: [
        {
            key: taskStatusEnum.待完成,
            text: '待完成'
        },
        {
            key: taskStatusEnum.已完成,
            text: '已完成'
        },
    ],
    [taskThemeEnum.云语音]: [
        {
            key: taskStatusEnum["联系未果-停机"],
            text: '联系未果-停机'
        },
        {
            key: taskStatusEnum["联系未果-无人接听"],
            text: '联系未果-无人接听'
        },
        {
            key: taskStatusEnum["联系未果-错/空号"],
            text: '联系未果-错/空号'
        },
        {
            key: taskStatusEnum["拒绝-没有需求"],
            text: '拒绝-没有需求'
        },
        {
            key: taskStatusEnum["拒绝-已报其他品牌"],
            text: '拒绝-已报其他品牌'
        },
        {
            key: taskStatusEnum["拒绝-孩子太小"],
            text: '拒绝-孩子太小'
        },
        {
            key: taskStatusEnum["拒绝-不在所属区域"],
            text: '拒绝-不在所属区域'
        },
        {
            key: taskStatusEnum["未诺访，待跟进"],
            text: '未诺访，待跟进'
        },
        {
            key: taskStatusEnum["其他"],
            text: '其他'
        },
        {
            key: taskStatusEnum["参观"],
            text: '参观'
        },
        {
            key: taskStatusEnum["试听"],
            text: '试听'
        },
        {
            key: taskStatusEnum["活动"],
            text: '活动'
        },
        {
            key: taskStatusEnum["测评"],
            text: '测评'
        },
        {
            key: taskStatusEnum["已试听"],
            text: '已试听'
        },
        {
            key: taskStatusEnum["定金"],
            text: '定金'
        },
        // new
        {
            key: taskStatusEnum["接通再跟进-在忙"],
            text: '接通再跟进-在忙'
        },
        {
            key: taskStatusEnum["接通再跟进-挂起"],
            text: '接通再跟进-挂起'
        },
        {
            key: taskStatusEnum["接通再跟进-挂起"],
            text: '接通再跟进-挂起'
        },
        {
            key: taskStatusEnum["接通无效-不符合目标客户"],
            text: '接通无效-不符合目标客户'
        },
        {
            key: taskStatusEnum["接通无效--已选择其他品牌"],
            text: '接通无效--已选择其他品牌'
        },
        {
            key: taskStatusEnum["接通无效--不在所属区域"],
            text: '接通无效--不在所属区域'
        },
        {
            key: taskStatusEnum["接通无效--虚假信息"],
            text: '接通无效--虚假信息'
        },
        {
            key: taskStatusEnum["接通无效--其他"],
            text: '接通无效--其他'
        },
        {
            key: taskStatusEnum["接通有效-诺访-参观"],
            text: '接通有效-诺访-参观'
        },
        {
            key: taskStatusEnum["接通有效-诺访-试听"],
            text: '接通有效-诺访-试听'
        },
        {
            key: taskStatusEnum["接通有效-诺访-活动"],
            text: '接通有效-诺访-活动'
        },
        {
            key: taskStatusEnum["接通有效-诺访-测评"],
            text: '接通有效-诺访-测评'
        },
        {
            key: taskStatusEnum["接通有效-到访-已试听"],
            text: '接通有效-到访-已试听'
        },
        {
            key: taskStatusEnum["接通有效-到访-定金"],
            text: '接通有效-到访-定金'
        },
        {
            key: taskStatusEnum["未接通-未接通再利用"],
            text: '未接通-未接通再利用'
        },
        {
            key: taskStatusEnum["未接通-未接通无效"],
            text: '未接通-未接通无效'
        },
        {
            key: taskStatusEnum["未接通-空号"],
            text: '未接通-空号'
        },
    ],
    [taskThemeEnum.TMK]: [
        {
            key: taskStatusEnum["联系未果-停机"],
            text: '联系未果-停机'
        },
        {
            key: taskStatusEnum["联系未果-无人接听"],
            text: '联系未果-无人接听'
        },
        {
            key: taskStatusEnum["联系未果-错/空号"],
            text: '联系未果-错/空号'
        },
        {
            key: taskStatusEnum["拒绝-没有需求"],
            text: '拒绝-没有需求'
        },
        {
            key: taskStatusEnum["拒绝-已报其他品牌"],
            text: '拒绝-已报其他品牌'
        },
        {
            key: taskStatusEnum["拒绝-孩子太小"],
            text: '拒绝-孩子太小'
        },
        {
            key: taskStatusEnum["拒绝-不在所属区域"],
            text: '拒绝-不在所属区域'
        },
        {
            key: taskStatusEnum["未诺访，待跟进"],
            text: '未诺访，待跟进'
        },
        {
            key: taskStatusEnum["其他"],
            text: '其他'
        },
        {
            key: taskStatusEnum["参观"],
            text: '参观'
        },
        {
            key: taskStatusEnum["试听"],
            text: '试听'
        },
        {
            key: taskStatusEnum["活动"],
            text: '活动'
        },
        {
            key: taskStatusEnum["测评"],
            text: '测评'
        },
        {
            key: taskStatusEnum["已试听"],
            text: '已试听'
        },
        {
            key: taskStatusEnum["定金"],
            text: '定金'
        },
        // new
        {
            key: taskStatusEnum["接通再跟进-在忙"],
            text: '接通再跟进-在忙'
        },
        {
            key: taskStatusEnum["接通再跟进-挂起"],
            text: '接通再跟进-挂起'
        },
        {
            key: taskStatusEnum["接通再跟进-挂起"],
            text: '接通再跟进-挂起'
        },
        {
            key: taskStatusEnum["接通无效-不符合目标客户"],
            text: '接通无效-不符合目标客户'
        },
        {
            key: taskStatusEnum["接通无效--已选择其他品牌"],
            text: '接通无效--已选择其他品牌'
        },
        {
            key: taskStatusEnum["接通无效--不在所属区域"],
            text: '接通无效--不在所属区域'
        },
        {
            key: taskStatusEnum["接通无效--虚假信息"],
            text: '接通无效--虚假信息'
        },
        {
            key: taskStatusEnum["接通无效--其他"],
            text: '接通无效--其他'
        },
        {
            key: taskStatusEnum["接通有效-诺访-参观"],
            text: '接通有效-诺访-参观'
        },
        {
            key: taskStatusEnum["接通有效-诺访-试听"],
            text: '接通有效-诺访-试听'
        },
        {
            key: taskStatusEnum["接通有效-诺访-活动"],
            text: '接通有效-诺访-活动'
        },
        {
            key: taskStatusEnum["接通有效-诺访-测评"],
            text: '接通有效-诺访-测评'
        },
        {
            key: taskStatusEnum["接通有效-到访-已试听"],
            text: '接通有效-到访-已试听'
        },
        {
            key: taskStatusEnum["接通有效-到访-定金"],
            text: '接通有效-到访-定金'
        },
        {
            key: taskStatusEnum["未接通-未接通再利用"],
            text: '未接通-未接通再利用'
        },
        {
            key: taskStatusEnum["未接通-未接通无效"],
            text: '未接通-未接通无效'
        },
        {
            key: taskStatusEnum["未接通-空号"],
            text: '未接通-空号'
        },
    ],
};

// 优先级字典值
export const priorityDict = {
    [priorityEnum.紧急]: '紧急',
    [priorityEnum.正常]: '正常',
};
