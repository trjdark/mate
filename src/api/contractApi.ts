/**
 * desc: 合同相关Api
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/11/12
 * Time: 下午4:43
 */
const PRE = `/mate-contract`;
const common = `/mate-customer/post`;

const ContractApi = {
    //basic基础接口
    分类定义: `${PRE}/settings/queryIntent`,
    类型定义: `${PRE}/settings/queryTypeDef`,

    //合同管理
    创建合同: `${PRE}/contract/contractManage/create`,
    合同列表: `${PRE}/contract/contractManage/query`,
    合同详情: `${PRE}/contract/contractManage/detail`,
    修改合同: `${PRE}/contract/contractManage/update`,
    删除合同: `${PRE}/contract/contractManage/delete`,
    审批合同: `${PRE}/contract/contractManage/approve`,
    作废合同: `${PRE}/contract/contractManage/cancel`,
    合同使用情况: `${PRE}/contract/contractManage/usage`,
    检查合同是否存在未完成操作: `${PRE}/contract/contractManage/checkContractOper`,
    查询合同实际价格: `${PRE}/contract/modifyPackageManage/getPackageInfo`,
    查看合同保存附件: `${PRE}/contract/contractManage/saveContractRecord`,
    // 转入合同详情: `${PRE}/contract/transCenterManage/queryOutContract`,
    合同详情有效期长度: `${PRE}/base/getTimeDiff`,
    新建合同校验信息:`${PRE}/contract/contractManage/exitsBabyInfo`,
    新建合同获取leads下宝宝个数: `${PRE}/contract/contractManage/getCountBabyNum`,
    中心可否选择电子合同: `${PRE}/contract/contractManage/checkElectCenter`,
    //请假次数申请
    申请请假: `${PRE}/leaveTimesManage/create`,
    // 改包
    申请改课程包: `${PRE}/contract/modifyPackageManage/createModifyPackage`,
    //赠课
    申请赠课: `${PRE}/freeCourseRecord/create`,
    // 延期
    申请延期: `${PRE}/contract/contractExtention/create`,
    //收付款管理
    新建收付款: `${PRE}/contract/paymentManagement/createPayment`,
    查询宝宝: `${PRE}/base/findCustomerList`,
    通过leadsId查询合同: `${PRE}/contract/contractManage/queryForPaymentSearch`,
    查找leads相对应的合同原由: `${PRE}/contract/paymentManagement/queryFinByLeadsId`,
    查询收付款列表: `${PRE}/contract/paymentManagement/queryList`,
    查询合同类收付款详情: `${PRE}/contract/paymentManagement/queryConPayment`,
    查询非合同类收付款详情: `${PRE}/contract/paymentManagement/detail`,
    新增付款搜索原由: `${PRE}/contract/paymentManagement/queryFinByLeadsId`,
    删除非合同收付款: `${PRE}/contract/paymentManagement/delete`,
    确认合同收款: `${PRE}/contract/paymentManagement/updateConDeposit`,
    确认合同付款: `${PRE}/contract/paymentManagement/updateConRefund`,
    确认非合同收款: `${PRE}/contract/paymentManagement/updateNormal`,
    收付款退款: `${PRE}/contract/paymentManagement/returnToApproval`,
    // 合同操作
    过期合同列表: `${PRE}/expireContractManage/query`,
    导出过期合同列表: `${PRE}/expireContractManage/export`,
    确认合同收入: `${PRE}/expireContractManage/confirm`,

    合同请假次数列表: `${PRE}/leaveTimesManage/query`,
    获取退课申请基本信息: `${PRE}/leaveTimesManage/queryBasicInfoForCreate`,
    删除请假申请: `${PRE}/leaveTimesManage/delete`,
    获取请假申请: `${PRE}/leaveTimesManage/detail`,
    审批请假申请: `${PRE}/leaveTimesManage/approval`,
    修改请假申请: `${PRE}/leaveTimesManage/update`,

    转中心列表: `${PRE}/contract/transCenterManage/queryList`,
    转中心列表精确查找: `${PRE}/contract/transCenterManage/queryListByUsage`,

    创建转中心申请: `${PRE}/contract/transCenterManage/createTransCenter`,
    删除转中心申请: `${PRE}/contract/transCenterManage/delete`,
    获取转中心申请: `${PRE}/contract/transCenterManage/detail`,
    修改转中心申请: `${PRE}/contract/transCenterManage/updateTransCenter`,
    审批转中心申请: `${PRE}/contract/transCenterManage/auditTransCenter`,
    撤出转中心申请: `${PRE}/contract/paymentManagement/withdrawRollOutPayment`,
    撤出转中心申请2: `${PRE}/contract/transCenterManage/withdrawRollOutAudit`,
    撤入转中心申请: `${PRE}/contract/transCenterManage/withdrawRollInAudit`,

    退课列表: `${PRE}/contract/refundManage/queryList`,
    申请退课: `${PRE}/contract/refundManage/createRefund`,
    删除退课申请: `${PRE}/contract/refundManage/delete`,
    获取退课申请: `${PRE}/contract/refundManage/detail`,
    修改退课申请: `${PRE}/contract/refundManage/updateRefund`,
    审批退课申请: `${PRE}/contract/refundManage/auditRefund`,

    改包申请列表: `${PRE}/contract/modifyPackageManage/queryList`,
    获取改包申请: `${PRE}/contract/modifyPackageManage/detail`,
    修改改包申请: `${PRE}/contract/modifyPackageManage/update`,
    删除改包申请: `${PRE}/contract/modifyPackageManage/delete`,
    审批改包申请: `${PRE}/contract/modifyPackageManage/audit`,

    合同延期申请列表: `${PRE}/contract/contractExtention/query`,
    获取延期申请: `${PRE}/contract/contractExtention/detail`,
    审批延期申请: `${PRE}/contract/contractExtention/approval`,
    删除合同延期申请: `${PRE}/contract/contractExtention/delete`,
    修改合同延期申请: `${PRE}/contract/contractExtention/update`,

    赠课列表: `${PRE}/freeCourseRecord/query`,
    赠课详情: `${PRE}/freeCourseRecord/detail`,
    删除赠课: `${PRE}/freeCourseRecord/delete`,
    作废赠课: `${PRE}/freeCourseRecord/cancel`,
    审批赠课: `${PRE}/freeCourseRecord/approval`,
    修改赠课: `${PRE}/freeCourseRecord/update`,
    创建赠课获取基本: `${PRE}/freeCourseRecord/queryBasicInfoForCreate`,
    创建延期获取基本: `${PRE}/contract/contractExtention/queryBasicInfoForCreate`,

    // 选课中获取课程包下拉列表
    获取教学Leads下的所有合同:`${PRE}/contract/getContractByLeads`,
    获取Leads下的所有合同: `/mate-activity/activity/getContractByLeads`,
    // todo 没有用到
    获取中心所有在职HGAGAHGBGB列表:`${common}/staff/gaGb/hgaHgb/list`,
    获取leads下合同: `${PRE}/contract/getContractByLeadsUserChooseLesson`,
    // 合同优化api
    查询退课剩余课时不包含赠课课时:`${PRE}/contract/refundManage/getRefundCourseNum`,
    // 查询转入的申请是否能操作:`${PRE}/contract/transCenterManage/checkContractStatus`,
    检查临转中心列表:`${PRE}/contract/transCenterManage/getRollInCenter`,

    中心是否开通移动支付: `${PRE}/contract/getHasPaymentCenter`,
    获取用户课包详情: `${PRE}/contract/getPackageCourse`,
    获取支付流水列表: `${PRE}/payment-record/details`,
    导出支付流水 : `${PRE}/payment-record/details/export`,
    // 西格玛
    获取关联合同: `${PRE}/contract/refundManage/getRefundContractByleads`,
    中心是否有西格玛权限:`${PRE}/contract/isSigmaCenter`,
    获取宝宝是否存在优先级合同:`${PRE}/contract/contractManage/getPriority`,
    设置合同优先级:`${PRE}/contract/contractManage/settingPriority`,
    获取西格玛转中心列表: `${PRE}/contract/sigmaCenter`,

    申请特殊调整: `${PRE}/contract/accountAdjustment/createAccountAdjustment`,
    查询合同调整列表: `${PRE}/contract/accountAdjustment/queryListForContract`,
    查询中心合同调整列表: `${PRE}/contract/accountAdjustment/queryListForCenter`,
    总部获取合同特殊调整列表: `${PRE}/contract/accountAdjustment/queryList`,
    查询中心合同调整详情: `${PRE}/contract/accountAdjustment/detail`,
    审批合同调整详情: `${PRE}/contract/accountAdjustment/audit`,
    导出中心合同调整列表: `${PRE}/contract/accountAdjustment/queryListForCenterExport`,
    取消合同调整详情: `${PRE}/contract/accountAdjustment/cancel`,
    合同调整导出: `${PRE}/contract/accountAdjustment/queryListForExport`,
    // 中心费率
    中心费率查询: `${PRE}/centerRate/list`,
    中心费率导入: `${PRE}/centerRate/import?currentCenterId=`,
    中心费率导出: `${PRE}/centerRate/export`,
    中心费率编辑: `${PRE}/centerRate/edit`,

    查询部分退费列表: `${PRE}/contract/partRefund/centerPartRefundList`,
    新增部分退费 : `${PRE}/contract/partRefund/createPartRefund`,
    查询合同新增部分退费列表: `${PRE}/contract/partRefund/contractPartRefundList`,
    查询合同部分退费详情: `${PRE}/contract/partRefund/detailPartRefund`,
    审批部分退费: `${PRE}/contract/partRefund/approvePartRefund`,
    总部获取部分退费列表: `${PRE}/contract/partRefund/hqPartRefundList`,
    部分退费列表导出: `${PRE}/contract/partRefund/hqExportPartRefundList`,
    退回部分退费付款: `${PRE}/contract/partRefund/cancelPartRefund`,
    付款部分退费: `${PRE}/contract/partRefund/payPartRefund`,
    导出中心部分退费列表: `${PRE}/contract/partRefund/centerExportPartRefundList`,

};

export {ContractApi}
