import ActivityList from '../../ui/pages/activity/activityList/index';
import ActivityDetail from '../../ui/pages/activity/activityEdit/index';
import ActivityCheckin from '../../ui/pages/activity/activityCheckin/index';
import ActivityApprove from '../../ui/pages/activity/activityApprove/index';
import ActivityPrint from '../../ui/pages/activity/activityPrint/index';
import Activity from '../../ui/pages/activity/index';
import {requirePermission} from "./routeFuncIdMap";

export class ActivityRoutes {
    static 活动 = {
        path: '/activity',
        component: Activity,
        authority: requirePermission('活动'),
    };
    static 活动列表 = {
        path: '/activity/list',
        component: ActivityList,
        authority: requirePermission('活动'),
    };
    static 编辑活动 = {
        path: '/activity/edit/:params?',
        link: '/activity/edit',
        component: ActivityDetail,
        authority: requirePermission('活动'),
    };
    static 审批活动 = {
        path: '/activity/approve/:params?',
        link: '/activity/approve',
        component: ActivityApprove,
        authority: requirePermission('活动'),
    };
    static 活动签到 = {
        path: '/activity/checkin/:params?',
        link: '/activity/checkin',
        component: ActivityCheckin,
        authority: requirePermission('活动'),
    };
    static 打印 = {
        path: '/activity/print/:params?',
        link: '/activity/print',
        component: ActivityPrint,
        authority: requirePermission('活动'),
    };
}
