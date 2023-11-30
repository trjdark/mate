/**
 * desc: 激活码API
 * User: Vicky
 * Date: 2020/7/3
 * Time: 15:20
 */

const PRE = '/mate-basic';

export const AcodeApi = {
    // 教学活动列表
    未消耗兑换码: `${PRE}/exchangeCode/getNoConsume`,
    已消耗兑换码: `${PRE}/exchangeCode/getConsume`,
    总兑换码数: `${PRE}/exchangeCode/getTotal`,
    根据手机号查询中心消耗详情: `${PRE}/exchangeCode/getCenterConsumeDetails`,
    激活码管理列表: `${PRE}/exchangeCode/getCenterConsume`,
    激活码导入模版: `${PRE}/exchangeCode/downloadTemplate`,
    验证激活码: `${PRE}/exchangeCode/check`,
    上传激活码: `${PRE}/exchangeCode/upload`,
};

