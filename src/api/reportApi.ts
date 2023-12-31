/**
 * desc: 报表相关Api
 * User: Lyon
 * Date: 2019/1/18
 * Time: 11:50
 */

const PRE = `/mate-report`;
const DB = `/mate-dashboard`;
const POS = '/mate-pos';    // pos报表接口的前缀

export const reportApi = {
    查询城市列表: `${PRE}/center_performance/cities`,
    查询中心列表: `${PRE}/center_performance/centers`,
    查询中心业绩: `${PRE}/center_performance/list`,
    导出中心业绩: `${PRE}/center_performance/export`,
    市场名单明细: `${PRE}/marketLeadsReport/list`,
    市场名单明细销售向: `${PRE}/marketLeadsReport/salesList`,
    导出市场名单明细: `${PRE}/marketLeadsReport/excel`,
    导出销售向市场名单明细: `${PRE}/marketLeadsReport/salesExcel`,
    消耗负债报表: `${PRE}/consume_liability/list`,
    未消耗负债报表: `${PRE}/consume_liability_financial/list`,
    消耗负债报表总计: `${PRE}/consume_liability/total`,
    导出消耗负债报表: `${PRE}/consume_liability/export`,
    导出未消耗负债报表: `${PRE}/consume_liability_financial/export`,
    市场向市场渠道业绩: `${PRE}/market_channel_anaylsis/market/list`,
    销售向市场渠道业绩: `${PRE}/market_channel_anaylsis/sale/list`,
    导出市场向市场渠道业绩: `${PRE}/market_channel_anaylsis/market/export`,
    导出销售向市场渠道业绩: `${PRE}/market_channel_anaylsis/sale/export`,
    合同到期提醒: `${PRE}/contractExpiredReport/list`,
    导出合同到期提醒: `${PRE}/contractExpiredReport/exportExcel`,
    渠道出现方式业绩: `${PRE}/channelPerformance/findChannelPerformance`,
    渠道出现方式业绩销售向: `${PRE}/channelPerformanceSell/findChannelPerformanceSell`,
    导出渠道出现方式业绩: `${PRE}/channelPerformance/exportExcel`,
    导出渠道出现方式业绩销售向: `${PRE}/channelPerformanceSell/exportExcelSell`,
    到访表查询: `${DB}/visit/query`,
    导出到访表: `${DB}/visit/export`,
    中心收入统计: `${PRE}/centerIncomeReport/findByStatisticsDate`,
    导出中心收入统计: `${PRE}/centerIncomeReport/centerIncomeExcel`,
    会员连续未到提醒: `${PRE}/remindOfAbsentReport/queryList`,
    会员连续未到导出: `${PRE}/remindOfAbsentReport/exportExcel`,
    查询出席报告明细: `${PRE}/attendReport/list`,
    导出出席报告明细: `${PRE}/attendReport/exportExcel`,
    查询出席报告总计: `${PRE}/attendReport/allAttendReport`,
    导出出席报告总计: `${PRE}/attendReport/allExportExcel`,
    耗课统计GA查询: `${PRE}/expendGA/queryPage`,
    耗课统计GA导出: `${PRE}/expendGA/exportExcel`,
    耗课统计GB查询: `${PRE}/expendGB/queryPage`,
    耗课统计GB导出: `${PRE}/expendGB/exportExcel`,
    耗课统计指导师查询: `${PRE}/expendINS/queryPage`,
    耗课统计指导师导出: `${PRE}/expendINS/exportExcel`,
    任务跟进记录查询: `${PRE}/taskRecords/queryTaskRecords`,
    任务跟进记录导出: `${PRE}/taskRecords/exportExcel`,
    会员排课耗课统计报表查询: `${PRE}/memberBookExpend/report/list`,
    会员排课耗课统计报表导出: `${PRE}/memberBookExpend/report/exportExcel`,
    会员升班提醒查询: `${PRE}/memberUpgradeReport/queryList`,
    会员升班提醒导出: `${PRE}/memberUpgradeReport/exportExcel`,
    日常业绩报表查询: `${PRE}/dailyPerformanceReport/findByFinancialDate`,
    日常业绩报表导出: `${PRE}/dailyPerformanceReport/exportExcel`,
    DashboardGB个人业绩: `${PRE}/achievementGBDashboard/query`,
    DashboardGB关键指标: `${DB}/gb-dashboard/key-indicators`, // 新GB个人业绩
    GB工作台已领取待联络leads明细: `${DB}/gb-dashboard/receive/leads`, // 新GB仪表盘
    GB工作台已联络未到访leads明细: `${DB}/gb-dashboard/contact/leads`, // 新GB仪表盘
    Dashboard中心履约: `${PRE}/centerAppointmentDashbord/queryDate`,
    DashBoard中心业绩: `${PRE}/centerPerformanceDashboard/query`,
    DashBoardGA个人业绩: `${PRE}/workbenchGADashboard/query`,
    期初数据修复表: `${PRE}/accountMonthlyRemainingReport/query`,
    期初数据修复表更新时间: `${PRE}/accountMonthlyRemainingReport/queryLastUpdateTime`,
    导出期初数据修复表: `${PRE}/accountMonthlyRemainingReport/export`,
    获取中心星级: `${POS}/mate/getCenterStar`,
    预付款余额明细: `${POS}/mate/getCreditArDetail`,
    下载预付款余额明细: `${POS}/mate/getCreditArDetail/export`,
    对账单: `${POS}/mate/getCreditBillDetail`,
    下载对账单: `${POS}/mate/getCreditBillDetail/export`,
    查询订货额度: `${POS}/mate/getCreditInfo`,
    未到期余额明细: `${POS}/mate/getCreditPreArDetail`,
    下载未到期余额明细: `${POS}/mate/getCreditPreArDetail/export`,
    未发货订单: `${POS}/mate/getCreditUnOrderDetail`,
    下载未发货订单: `${POS}/mate/getCreditUnOrderDetail/export`,
    预警信息: `${POS}/mate/warning/alert`,
    预警日志列表: `${POS}/mate/warning/list`,
    // Todo
    // 获取公司列表: `${POS}/home/monthlyArBillDetail/getCompaniesInfo`,
    活动汇总列表: `${PRE}/activity-consumption/summaryList`,
    活动汇总列表导出: `${PRE}/activity-consumption/summaryList-exportExcel`,
    活动耗课明细: `${PRE}/activity-consumption/consumptionDetail`,
    活动耗课明细导出: `${PRE}/activity-consumption/consumptionDetail-exportExcel`,
    排课耗课列表: `${PRE}/memberBookExpend/report/babyReport/list`,
    待跟进会员报表: `${PRE}/memberBookExpend/report/WaitFollowlist`,
    待跟进会员报表导出: `${PRE}/memberBookExpend/report/WaitFollowlist/exportExcel`,
    排课耗课列表导出: `${PRE}/memberBookExpend/report/babyReport/exportExcel`,
    获取所有课程: `${PRE}/leave/report/courses`,
    请假会员名单列表: `${PRE}/leave/report/detailed`,
    请假会员列表导出: `${PRE}/leave/report/detailed/exportExcel`,
    导出出席会员上课明细: `${PRE}/attendReport/attendanceReport/export`,
    出席会员上课明细: `${PRE}/attendReport/attendanceReport`,
    收付款明细: `${PRE}/financialDetail/financialDetailList`,
    收付款明细导出: `${PRE}/financialDetail/export`,
    换课删课明细: `${PRE}/exchangeAndDeletedRecord/report/list`,
    换课删课明细导出: `${PRE}/exchangeAndDeletedRecord/report/export`,
    特殊操作日志记录查询: `${PRE}/operateLogRecord/report/operateLogRecordList`,
    特殊操作日志记录导出: `${PRE}/operateLogRecord/report/exportExcel`,
    本月业绩: `${DB}/cdwork/month/performances`,
    本月渠道和跟进: `${DB}/cd/month/channelAndFollow`,
    本月课程消耗: `${DB}/cd/month/memberCost`,
    本月待到访明细: `${DB}/cdwork/month/detail/visit`,
    本周待到访明细: `${DB}/cdwork/week/detail/visit`,
    本月已到访明细: `${DB}/cdwork/month/detail/visited`,
    GA关键指标: `${DB}/ga-dashboard/key-indicators`,
    待续会员: `${DB}/ga-dashboard/renewal-member`,
    今日首课宝宝: `${DB}/ga-dashboard/today-first-class-baby`,
    未开课宝宝: `${DB}/ga-dashboard/no-class-baby`,
    未排课宝宝: `${DB}/ga-dashboard/no-arranging-baby`,
    过去14天以上未耗课且未联系宝宝: `${DB}/ga-dashboard/fourteenday-no-attend-contact`,
    过去7天已约未到宝宝: `${DB}/ga-dashboard/sevenday-attend-nosign`,
    未来14天内升班宝宝: `${DB}/ga-dashboard/fourteenday-upgrade-class`,
    今日最后一节课宝宝: `${DB}/ga-dashboard/today-last-class-baby`,
    今日生日宝宝: `${DB}/ga-dashboard/today-birthday-baby`,
    本月生日宝宝: `${DB}/ga-dashboard/month-birthday-baby`,
    到访表多中心导出提交: `${DB}/visit/commitTask`,
    市场名单明细多中心导出提交: `${PRE}/marketLeadsReport/commitTask`,
    市场名单明细销售向多中心导出提交: `${PRE}/marketLeadsReport/commitSaleTask`,
    多中心导出任务查询列表: `${PRE}/multiCenterExportTask/list`,
    多中心导出文件下载: `${PRE}/multiCenterExportTask/getFileTempUrl`,

    查询Ar账单: `${POS}/mate/getMonthlyArBill`,
    查询Ar账单明细: `${POS}/mate/getMonthlyArBillDetail`,
    导出Ar账单明细: `${POS}/mate/monthlyArBillDetail/export`,

    获取政策列表: `${POS}/file/list`,
    pos文件上传: `${POS}/file/save`,
    pos文件删除: `${POS}/file/delete`,

};
