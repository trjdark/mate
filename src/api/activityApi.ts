/**
 * desc: 活动相关Api
 * User: 
 * Date: 2018/12/19
 * Time: 11:50
 */

const PRE = `/mate-activity`;

export const ActivityApi = {
    // 教学活动列表
    教学活动列表: `${PRE}/activity/search`,
    创建活动: `${PRE}/activity/create`,
    删除教学活动: `${PRE}/activity/delete`,
    获取活动详情: `${PRE}/activity/detail`,
    审批活动: `${PRE}/activity/audit`,
    签到列表: `${PRE}/activity/signInList`,
    活动签到: `${PRE}/activity/batchSingIn`,
    取消报名: `${PRE}/activity/batchCancelBook`,
    报名: `${PRE}/activity/bookMemberActivity`,
    编辑教学活动:`${PRE}/activity/edit`,
    // 分类定义: `${PRE}/settings/queryIntent`,
    分类定义: `/mate-basic/enum/queryIntent`,
    // 类型定义: `${PRE}/settings/queryTypeDef`,
    类型定义: `/mate-basic/enum/queryTypeDef`,

    // 360活动记录
    会员教学活动列表: `${PRE}/activity/queryByLeads`,
    会员可报名活动列表: `${PRE}/activity/queryForBook`,
    查看会员活动详情: `${PRE}/activity/queryActivityRecord`,
    校验员工是否冲突: `${PRE}/activity/validStaffIsConflict`,
    获取会员宝宝列表: `${PRE}/activity/getBookBabyList`,
};
