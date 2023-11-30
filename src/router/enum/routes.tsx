/**
 * desc: 路由配置
 * Date: 2018/7/31
 * Time: 下午3:00
 */
import {Login} from "@/ui/pages/login";
/*合同模块路由*/
import assign from 'lodash/assign';
import {CustomerRoutes} from "./customerRoutes";
import {ContractRoutes} from "./contractRoutes";
import {SettingRoutes} from "./settingRoutes";
import {MarketRoutes} from './marketRoutes';
import {ActivityRoutes} from "./activityRoutes";
import {TeachingRoutes} from "./teachingRoutes";
import {ReportRoutes} from './reportRoutes';
import {Home} from "@/ui/pages/home";
import {TaskCenterRoutes} from "./taskCenterRouter";
import {DashboardRoutes} from "./dashboardRoutes";
import {TelephoneOnlineRoutes} from "@/router/enum/telephoneOnlineRoutes";
import {ResetPassword} from "@/ui/pages/login/page/resetPassword";
import {ContractRevisionRoutes} from "@/router/enum/contractRevisionRoutes";
import {SelectASystem} from "@/ui/pages/login/page/selectASystem";
import {LoginMiddleware} from "@/ui/pages/login/page/loginMiddleware";
import {LoginTest} from "@/ui/pages/login/page/loginTest";

/**
 * oa系统权限管理
 */

class MainRoutes {
    static 登录 = {
        path: '/login',
        component: Login
    };
    static 重置密码 = {
        path: '/login/reset',
        component: ResetPassword
    };
    static 登录跳转 = {
        path: '/login/middleware',
        component: LoginMiddleware
    };
    static 选择登录的系统 = {
        path: '/login/selectASystem/:params?',
        link: '/login/selectASystem/',
        component: SelectASystem,
    };
    static 首页 = {
        path: '/',
        component: Home,
    };
    static 登录测试 = {
        path: '/login/test',
        component: LoginTest,
    };
}

/*合并各个模块定义的路由*/
export const Routes = assign(
    MainRoutes,
    SettingRoutes,
    CustomerRoutes,
    ContractRoutes,
    MarketRoutes,
    TeachingRoutes,
    ActivityRoutes,
    ReportRoutes,
    DashboardRoutes,
    TaskCenterRoutes,
    TelephoneOnlineRoutes,
    ContractRevisionRoutes
);

/* 路由映射
 * 当打开第三级页面时，左侧导航栏的二级菜单依然要保持高亮，
 * 根据ant design的高亮规则，要把第三级页面路由映射到二级页面路由
 * */
export const routerMap = {
    // 教室管理编辑
    [Routes.添加教室管理.path]: Routes.教室管理.path,
    // 客户中心
    [Routes.客户360.path.slice(0, -8)]: Routes.分配客户.path.slice(0, -8),
    [Routes.客户360基本信息.path.slice(0, -8)]: Routes.分配客户.path.slice(0, -8),
    [Routes.客户成长.path.slice(0, -8)]: Routes.分配客户.path.slice(0, -8),
    [Routes.其他信息.path.slice(0, -8)]: Routes.分配客户.path.slice(0, -8),
    [Routes.渠道日志.path.slice(0, -8)]: Routes.分配客户.path.slice(0, -8),
    [Routes.历史名单.path.slice(0, -1)]: Routes.分配客户.path.slice(0, -8),
    [Routes.通话记录.path.slice(0, -8)]: Routes.分配客户.path.slice(0, -8),
    [Routes.随堂反馈报告详情.path.slice(0, -8)]: Routes.分配客户.path.slice(0,-8),

    // 客户获取
    [Routes.客户获取.link]: Routes.分配客户.link,
    // 请假、上课情况
    [Routes.选课情况列表.path.slice(0, -8)]: Routes.分配客户.link,
    [Routes.选课情况日历.path.slice(0, -8)]: Routes.分配客户.link,
    [Routes.课程表.path.slice(0, -8)]: Routes.课程表.link,
    [Routes.签到.path.slice(0, -8)]: Routes.课程表.link,
    [Routes.签到打印.path.slice(0, -8)]: Routes.课程表.link,
    [Routes.试听申请查看.path.slice(0, -8)]: Routes.试听申请.path,
    [Routes.试听申请审批.path.slice(0, -8)]: Routes.试听申请.path,
    // 试听、选课
    [Routes.选择固定课表.path.slice(0, -8)]: Routes.分配客户.link,
    [Routes.提交预定.path.slice(0, -8)]: Routes.分配客户.link,
    // 员工管理编辑
    [Routes.修改员工信息.link]: Routes.员工信息管理.path,
    // 节假日管理
    [Routes.节假日修改.path.slice(0, -8)]: Routes.节假日.path,
    // pr产品维护
    [Routes.产品管理编辑.link]: Routes.产品管理.path,
    // promotor管理
    [Routes.promotor管理编辑.link]: Routes.promotor管理.path,
    // 总部课程包管理
    [Routes.总部课程包编辑.link]: Routes.总部课程包管理.path,
    [Routes.中心课程包定价.path.slice(0, -8)]: Routes.中心课程包管理.path,
    [Routes.中心课程包促销.path.slice(0, -8)]: Routes.中心课程包管理.path,
    // 课程分类
    [Routes.课程分类编辑.link]: Routes.课程分类.path,
    // 课程资料管理
    [Routes.课程资料编辑.link]: Routes.课程资料.path,
    // 中心管理
    [Routes.设置中心管理.path.slice(0, -8)]: Routes.中心管理.path,
    [Routes.修改中心管理.path.slice(0, -8)]: Routes.中心管理.path,
    // 中心角色管理
    [Routes.中心角色管理编辑.path.slice(0, -8)]: Routes.中心角色管理.path,
    // 默认角色管理
    [Routes.默认角色管理编辑.path.slice(0, -8)]: Routes.默认角色管理.path,
    // 激活码管理
    // [Routes.激活码管理.link]: Routes.激活码详情.link,
    [Routes.激活码详情.link]: Routes.激活码管理.link,
    // 电子合同
    [Routes.电子用印添加.path.slice(0, -1)]: Routes.电子合同管理.path,
    [Routes.电子用印编辑.path.slice(0, -8)]: Routes.电子合同管理.path,

    // 随堂反馈
    [Routes.随堂反馈管理列表.link]: Routes.随堂反馈管理.path,
    [Routes.随堂反馈管理查看.path.slice(0, -8)]: Routes.随堂反馈管理.path,
    [Routes.随堂反馈数据统计查看.path.slice(0, -8)]: Routes.随堂反馈数据统计.path,
    // 合同管理 合同详情 合同操作 合同收付款管理
    [Routes.新建合同.path.slice(0, -8)]: Routes.合同管理列表.path,
    [Routes.修改合同.path.slice(0, -8)]: Routes.合同管理列表.path,
    [Routes.审批合同.path.slice(0, -8)]: Routes.合同管理列表.path,
    [Routes.合同详情.path.slice(0, -8)]: Routes.合同管理列表.path,

    [Routes.合同操作详情转中心.path.slice(0, -8)]: Routes.合同操作列表转中心.path,
    [Routes.合同操作详情退课.path.slice(0, -8)]: Routes.合同操作列表退课.path,
    [Routes.合同操作详情改包.path.slice(0, -8)]: Routes.合同操作列表改包.path,
    [Routes.合同操作详情延期.path.slice(0, -8)]: Routes.合同操作列表延期.path,
    [Routes.合同操作详情修改请假次数.path.slice(0, -8)]: Routes.合同操作列表修改请假次数.path,
    [Routes.合同操作详情赠课.path.slice(0, -8)]: Routes.合同操作列表赠课.path,

    // 市场渠道
    [Routes.市场渠道明细.link]: Routes.市场渠道列表.path,
    // 活动
    [Routes.活动签到.link]: Routes.活动列表.path,
    [Routes.打印.link]: Routes.活动列表.path,
    [Routes.审批活动.link]: Routes.活动列表.path,
    // 报表
    [Routes.出席报告详情.link]: Routes.出席报告.path,
    [Routes.活动耗课明细表.path.slice(0, -8)]:Routes.活动耗课表.path,
    // 中心业绩设置
    [Routes.中心业绩设置表单.link]: Routes.中心业绩设置列表.path,
    //教学中RRP管理
    [Routes.RRP课程类型配置.path]: Routes.RRP课程类型配置.path,
    // 云语音
    [Routes.添加坐席.path.slice(0, -8)]: Routes.坐席分配.path,
    [Routes.编辑坐席.path.slice(0, -8)]: Routes.坐席分配.path,
};
