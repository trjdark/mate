/**
 * desc: apply枚举
 * User: colin.lu
 * Date: 2019/01/02
 * Time: 上午10:00
 */

//审批状态select
/**
 * 试听审批状态
 * @type {{postCode: string, postName: string}[]}
 */
export const applyStatus = [
    {
        postCode: 44001,
        postName: '待审批'
    }, {
        postCode: 44002,
        postName: '未通过'
    }, {
        postCode: 44003,
        postName: '已通过'
    }
];

//选课情况列表
export const attendanceStatus = [
    {
        postCode: 25001,
        postName: '未上'
    }, {
        postCode: 25002,
        postName: '已上'
    }, {
        postCode: 25003,
        postName: '请假'
    }, {
        postCode: 25004,
        postName: '旷课'
    }, {
        postCode: 25005,
        postName: '删除'
    }
];

//选课情况列表 （不包括删除
export const anotherStatus = [
    {
        postCode: '25001',
        postName: '未上'
    }, {
        postCode: '25002',
        postName: '已上'
    }, {
        postCode: '25003',
        postName: '请假'
    }, {
        postCode: '25004',
        postName: '旷课'
    }
];
