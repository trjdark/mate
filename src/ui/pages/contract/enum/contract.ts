/**
 * desc: 合同模块用到的常量枚举
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/11/1
 * Time: 上午9:27
 */

/**
 * 收支状态
 * @type {{postCode: string, postName: string}[]}
 */
const expensesStatus = [
    {
        postCode: 0,
        postName: '未付'
    }, {
        postCode: 1,
        postName: '已付'
    }
];

/**
 * 收支状态
 * @type {{postCode: string, postName: string}[]}
 */
const fincialStatus = [
    {
        postCode: 1,
        postName: '已收'
    }, {
        postCode: 0,
        postName: '未收'
    }
];
/**
 * 收款原由
 * @type {{postCode: string, postName: string}[]}
 */
const receiveReasons = [
    {
        postCode: 33002,
        postName: '合同'
    },{
        postCode: 33008,
        postName: '改包'
    },{
        postCode: 33003,
        postName: '转中心'
    },{
        postCode: 33001,
        postName: '定金'
    },{
        postCode: 33004,
        postName: '材料'
    },{
        postCode: 33005,
        postName: '活动'
    },{
        postCode: 33006,
        postName: '玩具'
    },{
        postCode: 33009,
        postName: '注册费'
    },{
        postCode: 33007,
        postName: '其他'
    }
];

/**
 * 收款原由
 * @type {{postCode: string, postName: string}[]}
 */
const receiveOthersReasons = [
    {
        postCode: 33001,
        postName: '定金'
    },{
        postCode: 33004,
        postName: '材料'
    },{
        postCode: 33005,
        postName: '活动'
    },{
        postCode: 33006,
        postName: '玩具'
    },{
        postCode: 33009,
        postName: '注册费'
    },{
        postCode: 33007,
        postName: '其他'
    }
];

/**
 * 付款原由
 * @type {{postCode: string, postName: string}[]}
 */
const payOthersReasons = [
   {
        postCode: 35001,
        postName: '定金'
    },{
        postCode: 35004,
        postName: '材料'
    },{
        postCode: 35005,
        postName: '活动'
    },{
        postCode: 35006,
        postName: '玩具'
    },{
        postCode: 35010,
        postName: '注册费'
    },{
        postCode: 35007,
        postName: '其他'
    }
];
/**
 * 支付类型
 * @type {{postCode: string; postName: string}[]}
 */
const payTypes = [
    {
        postCode: 34001,
        postName: '现金'
    },{
        postCode: 34002,
        postName: 'POS'
    },{
        postCode: 34003,
        postName: '支票'
    },{
        postCode: 34004,
        postName: '银行转账'
    },{
        postCode: 34005,
        postName: '微信支付'
    },{
        postCode: 34006,
        postName: '支付宝'
    }
];

/**
 * 付款状态类型
 * @type {{postCode: string; postName: string}[]}
 */
const payStatus = [
    {
        postCode: 17002,
        postName: '新合约'
    },{
        postCode: 17003,
        postName: '续约'
    },{
        postCode: 17001 ,
        postName: '赠送'
    }
];

const approveStatus = [
    {
        postCode: "1206001",
        postName: '待中心出纳审批'
    },{
        postCode: "1206001001",
        postName: '中心出纳审批不通过'
    },{
        postCode: "1206002" ,
        postName: '待总部财务审批'
    },{
        postCode: "1206002001" ,
        postName: '总部财务审批不通过'
    },{
        postCode: "1206003" ,
        postName: '审批完成'
    }
];

export {
    expensesStatus, receiveReasons, payTypes, fincialStatus,
    payStatus, receiveOthersReasons, payOthersReasons, approveStatus
}
