/**
 * desc: dashboard类路由
 * User: Lyon.li@gymboglobal.com
 * Date: 2018/2/28
 * Time: 下午13:38
 */
import Dashboard from '../../ui/pages/dashboard/index';
import GAPanel from '../../ui/pages/dashboard/gaPanel/index';
import GBPanel from '../../ui/pages/dashboard/gbPanel/index';
import GAWork from '../../ui/pages/dashboard/gaPanel/gaWork';
import GBWork from '../../ui/pages/dashboard/gbPanel/gbWork';
import {CenterAchievePanel} from '../../ui/pages/dashboard/centerAchievePanel/index';
import CenterServicesPanel from '../../ui/pages/dashboard/centerServicesPanel/index';
import {EarlyWarningLog} from "@/ui/pages/dashboard/earlyWarningLog";
import {CenterAchievePanelDetail} from "@/ui/pages/dashboard/centerAchievePanel/detail";
import {requirePermission} from './routeFuncIdMap';

export class DashboardRoutes {
    static Dashboard = {
        path:'/dashboard',
        component: Dashboard,
        authority: requirePermission('工作台'),
    };

    static GA个人工作台 = {
        path:'/dashboard/gaPanel',
        component: GAWork,
        authority: requirePermission('GA个人工作台'),
    };

    static GB个人工作台 = {
        path:'/dashboard/gbWork',
        component: GBWork,
        authority: requirePermission('GB个人工作台'),
    };
    static GA仪表盘 = {
        path:'/dashboard/gaWork',
        component: GAPanel,
        authority: requirePermission('GA工作台'),
    };

    static GB仪表盘 = {
        path:'/dashboard/gbPanel',
        component: GBPanel,
        authority: requirePermission('GB工作台'),
    };

    static CD仪表盘 = {
        path:'/dashboard/centerAchievePanel',
        component: CenterAchievePanel,
        authority: requirePermission('CD工作台'),
        exact: true,
    };

    static 中心履约服务看板 = {
        path:'/dashboard/centerServicesPanel',
        component: CenterServicesPanel,
        authority: requirePermission('HGA工作台'),
    };
    static 预警日志 = {
        path:'/dashboard/earlyWarningLog',
        component: EarlyWarningLog,
        authority: requirePermission('预警日志'),
    };
    static 中心业绩看板详情 = {
        path:'/dashboard/centerAchievePanel/detail/:params',
        link: '/dashboard/centerAchievePanel/detail/',
        component: CenterAchievePanelDetail,
        authority: requirePermission('CD工作台'),
        exact: true
    };
}
