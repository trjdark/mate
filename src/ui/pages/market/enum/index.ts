// 审批状态枚举值（用于取值）
export const enum approvalStatusEnumValue {
    '待审批'='12001',
    '未通过'='12002',
    '已通过'='12003',
}

// 审批状态枚举值
export const approvalStatusEnum = [
    {
        postCode: 12001,
        postName: '待审批'
    },
    {
        postCode: 12002,
        postName: '未通过'
    },
    {
        postCode: 12003,
        postName: '已通过'
    }
];
// 市场渠道出现方式枚举值
export const enum appearanceTypeEnum {
    'net-in' = '02001',
    'call-in' = '02002',
    'walk-in' = '02003',
    'call-out' = '02004'
}

// 市场渠道目的枚举值
const enum purposeEnum {
    '获取资源' = '45001',
    '品牌推广' = '45002',
    '其他' = '45003'
}

// 市场渠道出现方式(用于生成列表)
export const appearanceTypeList = [
    {
        key: appearanceTypeEnum['net-in'],
        value: 'net-in'
    },
    {
        key: appearanceTypeEnum['call-out'],
        value: 'call-out'
    }
];

// 市场渠道目的(用于生成列表)
export const purposeList = [
    {
        key: purposeEnum.获取资源,
        value: '获取资源'
    },
    {
        key:purposeEnum.品牌推广,
        value: '品牌推广'
    },
    {
        key:purposeEnum.其他,
        value: '其他'
    }
];
