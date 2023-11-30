/**
 * desc:
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2020/3/25
 * Time: 下午4:28
 */

const PRE = "/mate-live";

export const TelephoneApi = {
    // 教学活动列表
    获取三天未接已接记录: `${PRE}/call/findCallInContactList`,
    账户缴费记录: `${PRE}/terminal/getPayHistoryInfo`,
    服务账单: `${PRE}/terminal/getCusReportInfo`,
    通话记录统计:`${PRE}/call/findStatisticsCallMate`,
    坐席统计: `${PRE}/emicloud/searchEpMembersForDt`,
    技能组统计: `${PRE}/emicloud/searchEpGroupsForDt`,
    获取技能组列表: `${PRE}/emicloud/searchGroups`,
    导出统计: `${PRE}/emicloud/emiCloudExport`,

    未读消息列表: `${PRE}/notice/getNoReadNotice`,
    获取消息通知列表: `${PRE}/notice/getNoticeList`,
    查看消息通知设置: `${PRE}/notice/getNoticeSetting`,
    修改消息通知设置: `${PRE}/notice/alterNoticeSetting`,
    查看消息提醒模版: `${PRE}/notice/getNoticeTemplate`,
    更新消息提醒模版: `${PRE}/notice/alterNoticeTemplate`,
    查看消息详情: `${PRE}/notice/getNoticeDetail`,
    获取系统通知消息: `${PRE}/sysNotice/getNoReadSysNotice`,
    修改系统通知已读状态:`${PRE}/sysNotice/changeReadStatus`,
    //消息通知
    获取黑名单列表: `${PRE}/black/getNoticeBlackList`,
    黑名单添加: `${PRE}/black/addNoticeBlacklist`,
    黑名单移除: `${PRE}/black/delNoticeBlacklist`,
    获取非黑名单列表:`${PRE}/black/getNonBlacklistLeadsList`
};
