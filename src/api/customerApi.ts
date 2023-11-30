/**
 * desc: 客户中心api
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/10/23
 * Time: 下午3:08
 */

const PRE = `/mate-customer`;

const CustomerApi = {
    // 新建客户
    创建Leads信息: `${PRE}/customer/createleads`,
    获取月龄: `${PRE}/customer/createleads/monthValue`,
    获取分配记录列表: `${PRE}/distribute/list`,
    查询推荐人列表信息: `${PRE}/customer/createleads/findRecommendList`,
    获取当前中心有效promotor列表: `${PRE}/customer/main/getValidPromotorInCurrentCenter`,
    获取当前中心有效市场活动列表: `${PRE}/customer/main/getValidMarketingActivityInCurrentCenter`,
    请求所属中心GA员工列表: `${PRE}/leadsStatus/ga/list`,
    请求所属中心GB员工列表: `${PRE}/leadsStatus/gb/list`,
    员工列表: `${PRE}/post/staff/info/list`,

    // 客户360
    客户360基本信息: `${PRE}/customer/main/getCustomerBasicInfo`,
    客户360宝宝信息: `${PRE}/customer/main/getCustomerBabyInfo`,
    更新宝宝信息: `${PRE}/customer/main/updateCustomerBabyInfo`,
    删除宝宝信息: `${PRE}/customer/main/deleteCustomerBabyInfo`,
    查询联系人信息: `${PRE}/customer/main/getCustomerContactInfo`,
    删除联系人信息: `${PRE}/customer/main/deleteCustomerContactInfo`,
    更新联系人信息: `${PRE}/customer/main/updateCustomerContactInfo`,
    查询住址信息: `${PRE}/customer/main/getCustomerAddressInfo`,
    更新住址信息: `${PRE}/customer/main/updateCustomerAddressInfo`,
    检测联系人手机号是否已被占用: `${PRE}/customer/createleads/checkPrimaryContactTel`,
    根据手机号码查询跨中心信息: `${PRE}/customer/createleads/getLeadsInOtherCenterByTel`,
    leads状态变更: `${PRE}/leadsStatus/leads/modify`,
    leads状态及合同: `${PRE}/customer/main/getLeadsInfoAboutContract`,
    基本信息是否可编辑: `${PRE}/customer/main/getCustomrBasicPermission`,
    分配当前leads: `${PRE}/leadsStatus/main/distribute`,
    检测手动回收站状态: `${PRE}/customer/main/getCustomerLeadsRecycleInfo`,
    获取leads通话记录: `${PRE}/call/record/leads/list`,
    // 其他信息
    查询收支记录信息: `${PRE}/customer/main/getFinancialRecordInfo`,
    查询会籍信息: `${PRE}/customer/main/getMemberInfo`,
    跟新会籍信息: `${PRE}/customer/main/updateMemberInfo`,
    查询Leads最新获取信息: `${PRE}/customer/main/getCustomerLastLeadsInfo`,

    // 转中心记录
    转中心列表: `${PRE}/distribute/transfer/center/list`,
    leads转中心记录: `${PRE}/distribute/transfer/center/leads/list`,
    会员转中心记录: `${PRE}/distribute/transfer/center/member/list`,

    // 批量导入
    导入excel: `${PRE}/import/leads`,
    导入excelJson: `${PRE}/import/leadsInfo`,
    确认导入: `${PRE}/import/leads/confirm`,
    导出leads: `${PRE}/import/record`,
    导出重复leads: `${PRE}/import/exportErrorInfo`,
    // 高级查询模块
    获取高级查询按钮组: `${PRE}/userDefinedQuery/define/list`,
    删除自定义查询: `${PRE}/userDefinedQuery/define/remove`,
    保存自定义查询: `${PRE}/userDefinedQuery/define/save`,

    // leads流转模块
    获取状态列表: `${PRE}/advancedQuery/phase/num`,
    获取分配客户列表: `${PRE}/advancedQuery/info/list`,
    获取区域列表: `${PRE}/advancedQuery/district/list`,
    获取高级查询INS列表: `${PRE}/advancedQuery/ins/list`,
    获取高级查询中心课程包: `${PRE}/advancedQuery/center/packageId/list`,

    // 根据岗位获取员工通用接口
    查询GAHGA在职离职: `${PRE}/post/staff/ga/hga/allLeave/list`,
    // todo 废弃
    // 查询GAHGA在职leads:`${PRE}/post/staff/ga/hga/leadsNum/list`,
    查询GAHGA在职和所有离职: `${PRE}/post/staff/ga/hga/allLeave/list`,
    查询GAHGA在职离职半年: `${PRE}/post/staff/ga/hga/leaveHalfYear/list`,
    查询GAHGA在职: `${PRE}/post/staff/ga/hga/list`,
    查询GBHGB在职离职: `${PRE}/post/staff/gb/hgb/allLeave/list`,
    // todo 废弃
    // 查询GBHGB在职leads:`${PRE}/post/staff/gb/hgb/leadsNum/list`,
    查询GBHGB在职和所有离职: `${PRE}/post/staff/gb/hgb/allLeave/list`,
    查询GBHGB在职离职半年: `${PRE}/post/staff/gb/hgb/leaveHalfYear/list`,
    查询GBHGB在职: `${PRE}/post/staff/gb/hgb/list`,
    查询INS在职离职半年: `${PRE}/post/staff/getStaffINS`,
    查询中心所有在职人员: `${PRE}/post/staff/onwork/list`,

    // leads分配模块
    获取GA角色列表: `${PRE}/leadsStatus/ga/list`, // 通过gb获取ga
    获取分配所有中心列表: `${PRE}/leadsStatus/center/list`,
    分配leads至GA: `${PRE}/leadsStatus/leads/distribute/ga`,
    分配leads至GB: `${PRE}/leadsStatus/leads/distribute/gb`,
    重新分配leads至GAGB: `${PRE}/leadsStatus/leads/reDistribute`,
    分配会员至GA: `${PRE}/leadsStatus/vip/distribute`,
    分配会员至GB: `${PRE}/leadsStatus/vip/distribute/gb`,
    历史名单分配会员至GB: `${PRE}/leadsStatus/coursePackage/redistribute/gb`,
    重新分配会员至GA: `${PRE}/leadsStatus/vip/redistribute/ga`,
    重新分配会员至GB: `${PRE}/leadsStatus/vip/redistribute/gb`,
    是否有leads导入: `${PRE}/advancedQuery/receive/leads`,
    获取GAGB列表含leads数: `${PRE}/post/staff/list`,
    获取GAGB角色列表含leads数: `${PRE}/role/staff/list`,

    // 客户管理leads导出
    leads导出: `${PRE}/advancedQuery/mate/export`,
    历史名单导出: `${PRE}/leads/history/record/mate/export`,

    leads转中心: `${PRE}/leadsStatus/leads/transfer/center`,
    领取leads: `${PRE}/leadsStatus/leads/receive`,
    leads加入回收站: `${PRE}/leadsStatus/leads/recycle`,
    leads交还主管: `${PRE}/leadsStatus/leads/back`,
    获取服务对象列表: `${PRE}/leads/customerName/list`,
    查询leads客户名称信息: `${PRE}/leads/customer/info`,

    // 历史名单
    获取历史名单GA角色列表: `${PRE}/leads/history/record/list/ga`,
    获取历史名单GB角色列表: `${PRE}/leads/history/record/list/gb`,

    leads流失: `${PRE}/leads/history/record/lose/list`,
    leads转移: `${PRE}/leads/history/record/transfer/list`,
    长期未联系回收: `${PRE}/leads/history/record/longtime/uncontact/list`,
    长期未签约回收: `${PRE}/leads/history/record/longtime/unsign/list`,
    待领取回收: `${PRE}/leads/history/record/unreceive/list`,
    会员转中心: `${PRE}/leads/history/record/transfervip/list`,
    课程包结束: `${PRE}/leads/history/record/coursepakege/list`,
    未联系回收: `${PRE}/leads/history/record/uncontact/list`,
    手动回收站: `${PRE}/leads/history/record/recycle/list`,
    转移至待分配: `${PRE}/leadsStatus/leads/transfer/undistribute`,
    转移至TMK: `${PRE}/leads/history/record/mateToTmk`,
    回收时间类型: `${PRE}/leads/history/record/recycle/constTimeType`,

    // 任务中心
    查询任务列表: `${PRE}/task/list`,
    查询任务详情: `${PRE}/task/get`,
    删除选中的任务: `${PRE}/taskCenter/gettasklist`,
    设置任务状态: `${PRE}/taskCenter/gettasklist`,
    编辑任务: `${PRE}/task/edit`,
    新建任务: `${PRE}/task/add`,
    获取GA列表: `${PRE}/leadsStatus/ga/list`,
    获取GB列表: `${PRE}/leadsStatus/gb/list`,

    // 客户获取
    客户leads信息: `${PRE}/customer/main/getCustomerLeadsInfo`,
    更新leads信息: `${PRE}/customer/main/updateCustomerLeadsInfo`,
    获取跟进信息: `${PRE}/customer/main/getCustomerTrackInfo`,
    更新跟进信息: `${PRE}/customer/main/updateCustomerTrackInfo`,
    获取合同信息: `${PRE}/customer/main/getCustomerContractInfo`,
    获取状态变更: `${PRE}/customer/main/getLeadsPhaseRecord`,
    客户promotor列表: `${PRE}/customer/main/getValidPromotorInCurrentCenter`,
    获取活动列表: `${PRE}/customer/main/getValidMarketingActivityInCurrentCenter`,
    查询法定监护人标识: `${PRE}/customer/main/getCustomerLegalInfo`,
    渠道编辑记录: `${PRE}/customer/main/getLeadsChannelInfoRecord`,

    // 客户成长
    交接记录列表: `${PRE}/customer/main/getDistributeListInfo`,
    关键事件列表: `${PRE}/customer/main/getKeyEventListInfo`,
    创建关键事件: `${PRE}/customer/main/createKeyEventInfo`,
    续约跟进列表: `${PRE}/customer/main/renew/follow/list`,
    创建续约跟进: `${PRE}/customer/main/renew/follow/save`,
    续约意向列表: `${PRE}/customer/main/intention/list`,
    热心推荐列表: `${PRE}/customer/main/hotrecommend/list`,
    客户成长课程包结束: `${PRE}/customer/main/getCustomerPackageInfo`,
    // 活动记录

    // 市场渠道
    获取非会员活动历史数据: `${PRE}/mkt/getHistoryDataByChannelType`,
    市场渠道列表: `${PRE}/mkt`,
    新增市场渠道信息: `${PRE}/mkt/createMarketingActivityInfo`,
    查看市场渠道信息: `${PRE}/mkt/findMarketingActivityInfo`,
    更新市场渠道信息: `${PRE}/mkt/updateMarketingActivityInfo`,
    拒绝市场渠道信息: `${PRE}/mkt/refuseMarketingActivity`,
    审核市场渠道信息: `${PRE}/mkt/approveMarketingActivity`,
    删除市场渠道活动: `${PRE}/mkt/deleteMarketingActivity`,
    // 审批权限
    市场活动审批权限: `${PRE}/basic/common/getApprovalPermission`,

    // 跨中心查询,本中心查询
    跨中心查询: `${PRE}/customer/createleads/findLeadsAcrossCenterByTel`,
    本中心查询: `${PRE}/leads/bigSearch`,
    // 合同中用到
    获取中心所有在职GA: `${PRE}/post/staff/ga/hga/list`,
    获取中心所有在职GB: `${PRE}/post/staff/gb/hgb/list`,
    // 渠道日志
    获取渠道日志: `${PRE}/customer/main/getCustomerChannelLogInfo`,
    批量建任务: `${PRE}/task/batchAdd`,
    获取GB三天内批量建任务提信息: `${PRE}/task/queryTaskInfo`,

    //RRP绑定查询
    rrp绑定查询: "/mate-rrp/forMate/queryRrpBind",
    //
    获取修改日志信息: `${PRE}/customer/main/getLeadsOperatedLogInfo`,
    // todo 云语音
    根据中心id获取tmk的leads: `${PRE}/call/leads/info/list`,
    获取云语音分机号: `${PRE}/seat/findExNum`,
    新增坐席: `${PRE}/seat/add`,
    获取坐席信息: `${PRE}/seat/findById`,
    更新坐席: `${PRE}/seat/edit`,
    获取坐席记录: `${PRE}/seat/listPage`,
    分配leads给TMK: `${PRE}/call/leads/distribute/tmk`,
    转移leads给新中心: `${PRE}/call/leads/transfer/center`,
    校验坐席: `${PRE}/seat/edit/check`,

    保存联系人备注: `${PRE}/customer/main/updateContactRemark`,
    获取中心通话记录: `${PRE}/call/record/center/statistics`,
    中心通话记录列表: `${PRE}/call/record/center/listPage`,
    // 云语音3.0
    根据id获取leads信息: `${PRE}/leads/listByIds`,
    修改联系人信息: `${PRE}/contact/update`,
    添加联系人信息: `${PRE}/contact/add`,
    修改宝宝信息: `${PRE}/baby/updateBabyInfo`,
    保存通话记录任务: `${PRE}/call/record/task/save`,
    编辑通话记录任务描述: `${PRE}/call/record/task/updateDesc`,
    查询leads通话记录: `${PRE}/call/record/leads/callMateTaskList`,
    通话记录列表: `${PRE}/call/record/center/listPage`,
    // 云语音4.0
    tmk转中心leads: `${PRE}/leads/tmkLeads`,
    获取手机号码: `${PRE}/contact/phone`,
    // 云语音4.1
    tmkleads市场名单明细: `${PRE}/leads/findGbMarketLeadsList`,
    云语音导出市场明细: `${PRE}/leads/findGbMarketLeadsList/export`,
    云语音任务跟进记录: `${PRE}/task/queryTaskRecords`,
    云语音任务跟进记录导出: `${PRE}/task/queryTaskRecords/export`,
    是否含有TMK中心: `${PRE}/leads/history/record/recycle/list/hasTMK`,

    客户360重复leads详情列表: `${PRE}/customer/main/getCustomerLeadsTelRepeatList`,

    查询客户中心leads列表:`${PRE}/advancedQuery/list/new`,
    快速查询客户中心leads列表: `${PRE}/advancedQuery/list/quick`,
    导出客户中心leads列表: `/mate-basic/basic/export/apply/add`,
    获取当前中心的TMK中心的所有TMK和HTMK名单: '/mate-basic/basic/tmkCenter/bindingCurrentCenterTmkAndHtmk',

    获取任务跟进记录: `${PRE}/advancedQuery/task/info`,
    获取阶段leads数量_快速查询: `${PRE}/newDistribute/phase/quickLeadsNum`,
    获取阶段leads数量: `${PRE}/newDistribute/phase/leadsNum`,

    分配leads给GBGA_新: `${PRE}/newDistribute/leads/toStaff`,
    领取leads_新: `${PRE}/newDistribute/leads/receive`,
    leads返回待分配_新: `${PRE}/newDistribute/leads/back`,
    leads转中心_新: `${PRE}/newDistribute/leads/transferCenter`,
    leads加入回收站_新: `${PRE}/newDistribute/leads/recycle`,
    leads转入TMK_新: `${PRE}/newDistribute/leads/transToTmk`
};

export {CustomerApi}
