/**
 * desc:
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/11/13
 * Time: 上午10:29
 */
/**
 * 审批状态
 * @type {{postCode: string; postName: string}[]}
 */
const approvalStatus = [
    {
        postCode: 19002,
        postName: '待审批'
    }, {
        postCode: 19005,
        postName: '已通过'
    }, {
        postCode: 19004,
        postName: '驳回'
    }, {
        postCode: 19006,
        postName: '已作废'
    }
];

const changeTypes = [
    {
        code: 1,
        name: '全转'
    }, {
        code: 0,
        name: '临转'
    },
];

export {
    approvalStatus,
    changeTypes
}
