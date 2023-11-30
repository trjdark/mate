/**
 * desc: 原由过滤器
 * User: colin.lu
 * Date: 2018/11/21
 * Time: 上午10:00
 */

/**
 * 收支状态
 * @type
 */
//原由值过滤器
const reason_format = (reason) => {
    if(reason && reason !== ''){
        const actions = new Map([
            ["33001","定金"],
            ["33002","新建合同"],
            ["33003","转中心"],
            ["33004","材料"],
            ["33005","活动"],
            ["33006","玩具"],
            ["33007","其他"],
            ["33008","改包"],
            ["33009","注册费"],
            [null,"--"]
        ]);
        return actions.get(reason) || actions.get(null);
    }else {
        return ''
    }
};

/**
 * 付款方式
 * @type
 */
//原由值过滤器
const moneyType_format = (reason) => {
    if(reason && reason !== ''){
        const actions = new Map([
            [34001,"现金"],
            [34002,"POS"],
            [34003,"支票"],
            [34004,"银行转账"],
            [34005,"微信支付"],
            [34006,"支付宝"],
            [34007,"线上收款"],
            [null,"--"]
        ]);
        return actions.get(reason) || actions.get(null);
    }else {
        return ''
    }
};

/**
 * 付款原由
 * @type
 */
//原由值过滤器
const pay_reason_format = (reason) => {
    if(reason && reason !== ''){
        const actions = new Map([
            ["35001","定金"],
            ["35002","新建合同"],
            ["35003","转中心"],
            ["35004","材料"],
            ["35005","活动"],
            ["35006","玩具"],
            ["35007","其他"],
            ["35008","改包"],
            ["35009","退课"],
            ["35010","注册费"],
            [null,"--"]
        ]);
        return actions.get(reason) || actions.get(null);
    }else {
        return ''
    }
};

/**
 * 付款原由
 * @type
 */
//原由值过滤器
const contract_type__format = (reason) => {
    if(reason && reason !== ''){
        const actions = new Map([
            ['17001',"赠送"],
            ['17002',"新合约"],
            ['17003',"续约"],
            ['17004',"转入"],
            [null,"--"]
        ]);
        return actions.get(reason) || actions.get(null);
    }else {
        return ''
    }
};


export {
    reason_format, moneyType_format, pay_reason_format, contract_type__format,
}
