/**
 * desc: 课程包
 * Date: 2018/8/13
 * Time: 上午9:41
 */

// 课程包类型 @todo在全量测试版本去除页面上的时段产品课程包 以后规划之后再做处理(时段产品课程包 key:0 value:0 name:'时段产品')
const CourseType = [
    {
        key: '1',
        value: 1,
        disabled: false,
        name: '课次产品'
    },{
        key: '3',
        value: 3,
        disabled: true,
        name: '时段产品'
    },
];
// 课程包状态
const CourseStatus = [
    {
        key: 'enum1',
        value: 1,
        name: '启用'
    },{
        key: 'enum2',
        value: 0,
        name: '停用'
    },
];


// 固定合约频次
const CourseFrequency = [
    {
        key: 'enum1',
        value: 1,
        name: '是'
    },{
        key: 'enum2',
        value: 0,
        name: '否'
    },
];


// 有效期单位，总部课程包管理中，没有‘日’
const CourseValidityPeriod_2 = [
    {
        key: 'month',
        value: '51003',
        name: '月'
    },
];

// 适用日
const CourseApplicationDateOption = [
    { label: '周一', value: 'mondayOk' },
    { label: '周二', value: 'tuesdayOk' },
    { label: '周三', value: 'wednesdayOk' },
    { label: '周四', value: 'thursdayOk' },
    { label: '周五', value: 'fridayOk' },
    { label: '周六', value: 'saturdayOk' },
    { label: '周日', value: 'sundayOk' },
];

export {
    CourseType,
    CourseStatus,
    CourseFrequency,
    CourseValidityPeriod_2,
    CourseApplicationDateOption,
}
