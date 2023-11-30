/**
 * desc: 中心基本信息
 * Date: 2018/8/13
 * Time: 下午7:24
 */
// const CenterType = [
//     {
//         key: 'centerType_1',
//         value: '47001',
//         name: '直营店'
//     },{
//         key: `centerType_2`,
//         value: '47002',
//         name: '加盟店'
//     },
// ];
//
// const CityLevel = [
//     {
//         key: 'centerLevel_1',
//         value: "46001",
//         name: '一线城市'
//     },{
//         key: 'centerLevel_2',
//         value: "46002",
//         name: '二线城市'
//     },{
//         key: 'centerLevel_3',
//         value: "46003",
//         name: '三线城市'
//     },{
//         key: 'centerLevel_4',
//         value: "46004",
//         name: '四线城市'
//     },{
//         key: 'centerLevel_5',
//         value: "46005",
//         name: '五线城市'
//     },{
//         key: 'centerLevel_6',
//         value: "46006",
//         name: '六线城市'
//     },{
//         key: 'centerLevel_7',
//         value: "46007",
//         name: '七线城市'
//     },{
//         key: 'centerLevel_8',
//         value: "46008",
//         name: '八线城市'
//     },{
//         key: 'centerLevel_9',
//         value: "46009",
//         name: '九线城市'
//     }
// ];

const CenterStatus = [
    {
        id:1,
        code: 1,
        codeValue: '启用'
    },{
        id:0,
        code: 0,
        codeValue: '停用'
    }
];
// 财务状态
const FinancialAdjust = [
    {
        id:1,
        code: 1,
        codeValue: '是'
    },{
        id:0,
        code: 0,
        codeValue: '否'
    }
];
// 默认中心启用状态
const DefaultCenterStatus = 1;
// 默认财务调整
const DefaultFinancialAdjust = 0;
//
// const CenterPost = [
//     { label: 'GB/HGB', value: 'POST_001' },
//     { label: 'INS/HI', value: 'POST_002' },
//     { label: 'MK', value: 'POST_003' },
//     { label: 'CS', value: 'POST_004' },
//     { label: 'CD/GI', value: 'POST_005' },
//     { label: 'FOC', value: 'POST_006' },
//     { label: 'SA/HS', value: 'POST_007' }
// ]
//
// const ExpiredTime = [
//     { label: '过期当天自动确认', value: 0 },
//     { label: '过期当月底自动确认', value: 1 },
// ]
//
// const businessTypeOption = [
//     {label:'金宝贝早教', value: '0',},
//     {label:'西格玛', value: '1'}
// ]

const validPeriodList = [
    {
        id: 1,
        name: '30',
        value: 30,
    },{
        id: 2,
        name: '60',
        value: 60,
    },{
        id: 3,
        name: '90',
        value: 90,
    },{
        id: 4,
        name: '180',
        value: 180,
    },{
        id: 5,
        name: '360',
        value: 360,
    },{
        id: 6,
        name: '无限',
        value: 9999,
    },
];

const businessStatusList = [
    {
        id: 1,
        name: '默认',
        value: 0,
    },{
        id: 2,
        name: '非销售中心',
        value: 1,
    },
];

export {
    // CenterType, CityLevel,
    // CenterPost, ExpiredTime, businessTypeOption,
    CenterStatus, DefaultCenterStatus,
    FinancialAdjust, DefaultFinancialAdjust, validPeriodList,
    businessStatusList
}
