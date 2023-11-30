/**
 * desc: 基础设置路由
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/11/14
 * Time: 上午11:14
 */
import {BasicSetting} from "@/ui/pages/setting";
// 总部课程包
import {CourseGeneralAdd} from "@/ui/pages/setting/courseGeneral/part/courseGeneralAdd";
import {CourseGeneralManage} from "@/ui/pages/setting/courseGeneral/part/courseGeneralManage";
import {CourseGeneral} from "@/ui/pages/setting/courseGeneral";
import {CenterSet} from "@/ui/pages/setting/center/part/centerSet";
import {HolidayManage} from "@/ui/pages/setting/holiday/part/holidayManage";
import {LessonMatMng} from "@/ui/pages/setting/lessonMaterial/part/lessonMatMng";
import {HolidayAdd} from "@/ui/pages/setting/holiday/part/holidayAdd";
import {LessonCateAddOrEdit} from "@/ui/pages/setting/lessonCategory/part/lessonCateAddOrEdit";
import {Promotor} from "@/ui/pages/setting/promotor";
import {RoleManagementList} from "@/ui/pages/setting/roleManagement/part/roleManagementList";
import {EmployeeAdd} from "@/ui/pages/setting/employee/page/employeeAdd";
import {CourseCenterPromotion} from "@/ui/pages/setting/courseCenter/part/courseCenterPromotion";
import {RoleManagementAdd} from "@/ui/pages/setting/roleManagement/part/roleManagementAdd";
import {Product} from "@/ui/pages/setting/product";
import {Employee} from "@/ui/pages/setting/employee";
import {RoleManagementEdit} from "@/ui/pages/setting/roleManagement/part/roleManagementEdit";
import {ProductAddOrEdit} from "@/ui/pages/setting/product/part/productAddOrEdit";
import {LessonCategory} from "@/ui/pages/setting/lessonCategory";
import {EmployeeList} from "@/ui/pages/setting/employee/page/employeeList";
import {PromotorAddOrEdit} from "@/ui/pages/setting/promotor/part/promotorAddOrEdit";
import {CourseCenterManage} from "@/ui/pages/setting/courseCenter/part/courseCenterManage";
import {HolidayEdit} from "@/ui/pages/setting/holiday/part/holidayEdit";
import {PromotorMange} from "@/ui/pages/setting/promotor/part/promotorManage";
import {RoomAddOrEdit} from "@/ui/pages/setting/classroom/part/roomEdit";
import {Classroom} from "@/ui/pages/setting/classroom";
import {DefaultRoleManagementEdit} from "@/ui/pages/setting/defaultRoleManagement/part/defaultRoleManagementEdit";
import {LessonMaterial} from "@/ui/pages/setting/lessonMaterial";
import {DefaultRoleManagementAdd} from "@/ui/pages/setting/defaultRoleManagement/part/defaultRoleManagementAdd";
import {CenterEdit} from "@/ui/pages/setting/center/part/centerEdit";
import {RoomManage} from "@/ui/pages/setting/classroom/part/roomManage";
import {CourseCenterPrice} from "@/ui/pages/setting/courseCenter/part/courseCenterPrice";
import {CenterManage} from "@/ui/pages/setting/center/part/centerManage";
import {DefaultRoleManagement} from "@/ui/pages/setting/defaultRoleManagement";
import {DefaultRoleManagementList} from "@/ui/pages/setting/defaultRoleManagement/part/defaultRoleManagementList";
import {Holiday} from "@/ui/pages/setting/holiday";
import {CourseCenter} from "@/ui/pages/setting/courseCenter";
import {LessonCateMng} from "@/ui/pages/setting/lessonCategory/part/lessonCateMng";
import {RoleManagement} from "@/ui/pages/setting/roleManagement";
import {CenterAdd} from "@/ui/pages/setting/center/part/centerAdd";
import {LessonMatAddOrEdit} from "@/ui/pages/setting/lessonMaterial/part/lessonMatAddOrEdit";
import {Center} from "@/ui/pages/setting/center";
import {ProductMange} from "@/ui/pages/setting/product/part/productManage";
import CenterAchievementList from '@/ui/pages/setting/centerAchievementList';
import CenterAchievementEdit from '@/ui/pages/setting/centerAchievementEdit';
import {RRP} from '@/ui/pages/setting/rrp';
import {RRPList} from '@/ui/pages/setting/rrp/page/rrpList';
import {RRPAdd} from '@/ui/pages/setting/rrp/page/rrpAdd';
import {RRPEdit} from '@/ui/pages/setting/rrp/page/rrpEdit';
import {NetInLeads} from '@/ui/pages/setting/netInLeads';
import {NetInLeadsManage} from '@/ui/pages/setting/netInLeads/netInLeadsManage';
import {TmkTelephoneCenter} from "@/ui/pages/setting/tmk";
import {TmkTelephoneCenterManage} from "@/ui/pages/setting/tmk/page/list";
import {TmkTelephoneCenterAdd} from "@/ui/pages/setting/tmk/page/add";
import {TmkTelephoneCenterEdit} from "@/ui/pages/setting/tmk/page/edit";
import {TmkTelephoneCenterDetail} from "@/ui/pages/setting/tmk/page/detail";
import {AcodeList} from "@/ui/pages/setting/activationCode/part/acodeList";
import {AcCode} from "@/ui/pages/setting/activationCode";
import {AccodeDetail} from "@/ui/pages/setting/activationCode/part/acodeDetail"
import { ImportacCode } from "@/ui/pages/setting/activationCode/part/importacCode";
import { financeAdministration } from "@/ui/pages/setting/financeAdministration";
import { employeeApprove } from '@/ui/pages/setting/employee/part/employeeApprove';
import { ApproveManage} from "@/ui/pages/setting/accountApprove";
import { ApproveManageList} from '@/ui/pages/setting/accountApprove/part/approveList';
import { ApproveSheet } from '@/ui/pages/setting/accountApprove/part/approveSheet';
import { ApproveDetail} from '@/ui/pages/setting/accountApprove/part/approveDetails';
import {CustomizeRoleManagement} from "@/ui/pages/setting/customizeRoleManagement";
import {CustomizeRoleManagementList} from "@/ui/pages/setting/customizeRoleManagement/page/list";
import {CustomizeRoleManagementEdit} from "@/ui/pages/setting/customizeRoleManagement/page/edit";
import {CustomizeRoleManagementAdd} from "@/ui/pages/setting/customizeRoleManagement/page/add";
import {EmployeeData} from "@/ui/pages/setting/employeeData";
import {EmployeeDataList} from "@/ui/pages/setting/employeeData/page/list";
import {EmployeeDataDetail} from "@/ui/pages/setting/employeeData/page/detail";
import {PerformanceIncome} from "@/ui/pages/setting/performanceIncome";
import {PerformanceIncomeList} from "@/ui/pages/setting/performanceIncome/page/list";
import {PerformanceIncomeDetail} from "@/ui/pages/setting/performanceIncome/page/detail";
import {TestPointList} from "@/ui/pages/setting/testPoint/page/list";
import {TestPoint} from "@/ui/pages/setting/testPoint";
import {InactiveMemberReminder} from "@/ui/pages/setting/inactiveMemberReminder";
import {InactiveMemberReminderManage} from "@/ui/pages/setting/inactiveMemberReminder/page/inactiveMemberReminderManage";
import {InactiveMemberReminderAdd} from "@/ui/pages/setting/inactiveMemberReminder/page/inactiveMemberReminderAdd";
import {ElectronicContract} from "@/ui/pages/setting/electronicContract";
import {ElectronicContractList} from "@/ui/pages/setting/electronicContract/page/list";
import {ElectronicContractAdd} from "@/ui/pages/setting/electronicContract/page/add";
import {ElectronicContractEdit} from "@/ui/pages/setting/electronicContract/page/edit";
import {AccountBind} from "@/ui/pages/setting/accountBind";
import {AccountBindList} from "@/ui/pages/setting/accountBind/page/list";
import {AccountBindDetail} from "@/ui/pages/setting/accountBind/page/detail";
import {CenterCostRate} from "@/ui/pages/setting/centerCostRate";
import {ImportContract} from "@/ui/pages/setting/importContract";
import {requirePermission} from './routeFuncIdMap';

class SettingRoutes {
    static 设置 = {
        path: '/setting',
        component: BasicSetting,
        authority: requirePermission('设置'),
        redirectPath: ''
    };
    static 总部课程包管理={
        path: '/setting/member/allCourse',
        component: CourseGeneral,
        authority: requirePermission('总部课程包设置'),
        redirectPath: ''
    };
    static 总部课程包列表={
        path: '/setting/member/allCourse/manage',
        component: CourseGeneralManage,
        authority: requirePermission('总部课程包设置'),
        redirectPath: ''
    };
    static 总部课程包编辑={
        path: '/setting/member/allCourse/edit/:params',
        link: '/setting/member/allCourse/edit',
        component: CourseGeneralAdd,
        authority: requirePermission('总部课程包设置'),
        redirectPath: ''
    };
    static 总部课程包添加={
        path: '/setting/member/allCourse/add',
        component: CourseGeneralAdd,
        authority: requirePermission('总部课程包设置'),
        redirectPath: ''
    };
    static 中心课程包管理={
        path: '/setting/member/course',
        component: CourseCenter,
        authority: requirePermission('中心课程包设置'),
        redirectPath: ''
    };
    static 中心课程包列表={
        path: '/setting/member/course/manage',
        component: CourseCenterManage,
        authority: requirePermission('中心课程包设置'),
        redirectPath: ''
    };
    static 中心课程包定价={
        path: '/setting/member/course/price/:params',
        link: '/setting/member/course/price/',
        component: CourseCenterPrice,
        authority: requirePermission('中心课程包设置'),
        redirectPath: ''
    };
    static 中心课程包促销={
        path: '/setting/member/course/promotion/:params',
        link: '/setting/member/course/promotion/',
        component: CourseCenterPromotion,
        authority: requirePermission('中心课程包设置'),
        redirectPath: ''
    };
    static 中心管理 = {
        path: '/setting/operation/center',
        component: Center,
        authority: requirePermission('中心管理'),
        redirectPath: ''
    };
    static 中心管理列表 = {
        path: '/setting/operation/center/manage',
        component: CenterManage,
        authority: requirePermission('中心管理'),
        redirectPath: ''
    };
    static 添加中心管理 = {
        path: '/setting/operation/center/add',
        component: CenterAdd,
        authority: requirePermission('中心管理'),
        redirectPath: ''
    };
    static 修改中心管理 = {
        path: '/setting/operation/center/edit/:params',
        component: CenterEdit,
        link: '/setting/operation/center/edit/',
        authority: requirePermission('中心管理'),
        redirectPath: ''
    };
    static 设置中心管理 = {
        path: '/setting/operation/center/set/:params',
        link: '/setting/operation/center/set/',
        component: CenterSet,
        authority: requirePermission('中心管理'),
        redirectPath: ''
    };
    static 设置财务管理 = {
        path: '/setting/financeAdministration',
        component: financeAdministration,
        redirectPath: ''
    };
    static 中心费率设置 = {
        path: '/setting/centerCostRate',
        component: CenterCostRate,
        authority: requirePermission('中心费率设置')
    };
    static 节假日={
        path:'/setting/operation/holiday',
        component:Holiday,
        authority:requirePermission('节假日设置'),
    };
    static 节假日列表 = {
        path:'/setting/operation/holiday/list',
        component:HolidayManage,
        authority:requirePermission('节假日设置'),
    };
    static 节假日添加 = {
        path:'/setting/operation/holiday/add',
        component:HolidayAdd,
        authority:requirePermission('节假日设置'),
    };
    static 节假日修改 = {
        path:'/setting/operation/holiday/edit/:params',
        link:'/setting/operation/holiday/edit/',
        component:HolidayEdit,
        authority:requirePermission('节假日设置'),
    };
    static 教室管理列表={
        path:'/setting/operation/classroom/roomManage',
        component:RoomManage,
        authority:requirePermission('教室设置'),
    };
    static 教室管理={
        path:'/setting/operation/classroom',
        component:Classroom,
        authority:requirePermission('教室设置'),
    };
    static 添加教室管理={
        path:'/setting/operation/classroom/addOrEdit',
        component:RoomAddOrEdit,
        authority:requirePermission('教室设置'),
    };
    static 编辑教室管理={
        path:'/setting/operation/classroom/addOrEdit/:params',
        link:'/setting/operation/classroom/addOrEdit',
        component:RoomAddOrEdit,
        authority:requirePermission('教室设置'),
    };
    static 中心角色管理 = {
        path: '/setting/member/roleManagement',
        component: RoleManagement,
        authority: requirePermission('特殊角色设置'),
        redirectPath: ''
    };
    static 中心角色管理列表 = {
        path: '/setting/member/roleManagement/roleManagementList',
        component: RoleManagementList,
        authority: requirePermission('特殊角色设置'),
        redirectPath: ''
    };
    static 中心角色管理新增 = {
        path: '/setting/member/roleManagement/roleManagementAdd',
        component: RoleManagementAdd,
        authority: requirePermission('特殊角色设置'),
        redirectPath: ''
    };
    static 中心角色管理编辑 = {
        path: '/setting/member/roleManagement/roleManagementEdit/:params',
        link: '/setting/member/roleManagement/roleManagementEdit/',
        component: RoleManagementEdit,
        authority: requirePermission('特殊角色设置'),
        redirectPath: ''
    };
    static 默认角色管理 = {
        path: '/setting/member/defaultRoleManagement',
        component: DefaultRoleManagement,
        authority: requirePermission('默认角色设置'),
        redirectPath: ''
    };
    static 默认角色管理列表 = {
        path: '/setting/member/defaultRoleManagement/defaultRoleManagementList',
        component: DefaultRoleManagementList,
        authority: requirePermission('默认角色设置'),
        redirectPath: ''
    };
    static 默认角色管理新增 = {
        path: '/setting/member/defaultRoleManagement/defaultRoleManagementAdd',
        component: DefaultRoleManagementAdd,
        authority: requirePermission('默认角色设置'),
        redirectPath: ''
    };
    static 默认角色管理编辑 = {
        path: '/setting/member/defaultRoleManagement/defaultRoleManagementEdit/:params',
        link: '/setting/member/defaultRoleManagement/defaultRoleManagementEdit/',
        component: DefaultRoleManagementEdit,
        authority: requirePermission('默认角色设置'),
        redirectPath: ''
    };
    static 产品管理 = {
        path: '/setting/operation/product',
        component: Product,
        authority: requirePermission('PR产品设置'),
        redirectPath: ''
    };
    static 产品管理列表 = {
        path: '/setting/operation/product/manage',
        component: ProductMange,
        authority: requirePermission('PR产品设置'),
        redirectPath: ''
    };
    static 产品管理新建 = {
        path: '/setting/operation/product/add',
        component: ProductAddOrEdit,
        authority: requirePermission('PR产品设置'),
        redirectPath: ''
    };
    static 产品管理编辑 = {
        path: '/setting/operation/product/edit/:params',
        link:'/setting/operation/product/edit',
        component: ProductAddOrEdit,
        authority: requirePermission('PR产品设置'),
        redirectPath: ''
    };
    static 课程分类 = {
        path: '/setting/operation/lessonCategory',
        component: LessonCategory,
        authority: requirePermission('课程分类设置'),
        redirectPath: ''
    };
    static 课程分类管理 = {
        path: '/setting/operation/lessonCategory/manage',
        component: LessonCateMng,
        authority: requirePermission('课程分类设置'),
        redirectPath: ''
    };
    static 课程分类新建 = {
        path: '/setting/operation/lessonCategory/add',
        component: LessonCateAddOrEdit,
        authority: requirePermission('课程分类设置'),
        redirectPath: ''
    };
    static 课程分类编辑 = {
        path: '/setting/operation/lessonCategory/edit/:params',
        link: '/setting/operation/lessonCategory/edit',
        component: LessonCateAddOrEdit,
        authority: requirePermission('课程分类设置'),
        redirectPath: ''
    };
    static 课程资料 = {
        path: '/setting/operation/lessonMaterial',
        component: LessonMaterial,
        authority: requirePermission('课程资料设置'),
        redirectPath: ''
    };
    static 课程资料管理 = {
        path: '/setting/operation/lessonMaterial/manage',
        component: LessonMatMng,
        authority: requirePermission('课程资料设置'),
        redirectPath: ''
    };
    static 课程资料新建 = {
        path: '/setting/operation/lessonMaterial/add',
        component: LessonMatAddOrEdit,
        authority: requirePermission('课程资料设置'),
        redirectPath: ''
    };
    static 课程资料编辑 = {
        path: '/setting/operation/lessonMaterial/edit/:params',
        link: '/setting/operation/lessonMaterial/edit',
        component: LessonMatAddOrEdit,
        authority: requirePermission('课程资料设置'),
        redirectPath: ''
    };
    static 员工信息管理 = {
        path: '/setting/member/employee',
        component: Employee,
        authority: requirePermission('账号设置'),
        redirectPath: ''
    };
    static 员工信息列表 = {
        path: '/setting/member/employee/list',
        component: EmployeeList,
        authority: requirePermission('账号设置'),
        redirectPath: ''
    };
    static 添加员工信息 = {
        path: '/setting/member/employee/add',
        component: EmployeeAdd,
        authority: requirePermission('账号设置'),
        redirectPath: ''
    };
    static 修改员工信息 = {
        path: '/setting/member/employee/edit/:params',
        link:'/setting/member/employee/edit',
        component: EmployeeAdd,
        authority: requirePermission('账号设置'),
        redirectPath: ''
    };
    static 解锁审批员工信息 = {
        path: '/setting/member/employee/approve/:params',
        link: '/setting/member/employee/approve',
        component: employeeApprove,
        authority: requirePermission('账号设置'),
        redirectPath: ''
    };
    static promotor管理 = {
        path: '/setting/operation/promotor',
        component: Promotor,
        authority: requirePermission('Promotor设置'),
        redirectPath: ''
    };
    static promotor管理列表 = {
        path: '/setting/operation/promotor/manage',
        component: PromotorMange,
        authority: requirePermission('Promotor设置'),
        redirectPath: ''
    };
    static promotor管理新建 = {
        path: '/setting/operation/promotor/add',
        component: PromotorAddOrEdit,
        authority: requirePermission('Promotor设置'),
        redirectPath: ''
    };
    static promotor管理编辑 = {
        path: '/setting/operation/promotor/edit/:params',
        link:'/setting/operation/promotor/edit',
        component: PromotorAddOrEdit,
        authority: requirePermission('Promotor设置'),
        redirectPath: ''
    };

    static 中心业绩设置列表 = {
        path: '/setting/operation/centerAchievementList',
        component: CenterAchievementList,
        authority: requirePermission('销售指标设置'),
        redirectPath: ''
    };

    static 中心业绩设置表单 = {
        path: '/setting/operation/centerAchievementEdit/:params?',
        link: '/setting/operation/centerAchievementEdit',
        component: CenterAchievementEdit,
        authority: requirePermission('销售指标设置'),
        redirectPath: ''
    };

    static RRP课程类型 = {
        path: '/setting/rrp',
        component: RRP,
        authority: requirePermission('RRP配置管理'),
        redirectPath: ''
    };

    static RRP课程类型列表 = {
        path: '/setting/rrp/rrpList',
        component: RRPList,
        authority: requirePermission('RRP配置管理'),
        redirectPath: ''
    };

    static RRP课程类型新增 = {
        path: '/setting/rrp/rrpAdd',
        component: RRPAdd,
        authority: requirePermission('RRP配置管理'),
        redirectPath: ''
    };

    static RRP课程类型编辑 = {
        path: '/setting/rrp/rrpEdit/:params',
        link: '/setting/rrp/rrpEdit',
        component: RRPEdit,
        authority: requirePermission('RRP配置管理'),
    }
    static NetInLeads = {
        path: '/setting/netInLeads',
        component: NetInLeads,
        authority: requirePermission('Net-in Leads设置'),
        redirectPath: ''
    };

    static NetInLeads设置管理 = {
        path: '/setting/netInLeads/manage',
        component: NetInLeadsManage,
        authority: requirePermission('Net-in Leads设置'),
        redirectPath: ''
    };
    static TMK呼叫中心设置 = {
        path: '/setting/tmk',
        component: TmkTelephoneCenter,
        authority: requirePermission('TMK呼叫中心设置'),
        redirectPath: ''
    };
    static TMK中心列表 = {
        path: '/setting/tmk/list',
        component: TmkTelephoneCenterManage,
        authority: requirePermission('TMK呼叫中心设置'),
        redirectPath: ''
    };

    static TMK新增 = {
        path: '/setting/tmk/add',
        component: TmkTelephoneCenterAdd,
        authority: requirePermission('TMK呼叫中心设置'),
        redirectPath: ''
    };
    static TMK编辑 = {
        path: '/setting/tmk/edit/:params',
        link: '/setting/tmk/edit/',
        component: TmkTelephoneCenterEdit,
        authority: requirePermission('TMK呼叫中心设置'),
        redirectPath: ''
    }
    static TMK查看 = {
        path: '/setting/tmk/detail/:params',
        link: '/setting/tmk/detail/',
        component: TmkTelephoneCenterDetail,
        authority: requirePermission('TMK呼叫中心设置'),
        redirectPath: ''
    }

    static 激活码管理 = {
        path: '/setting/operation/activationCode',
        component: AcCode,
        authority: requirePermission('节假日设置'),
    };
    static 激活码管理列表 = {
        path: '/setting/operation/activationCode/acodeList',
        component: AcodeList,
        authority: requirePermission('激活码管理'),
        redirectPath: ''
    }
    static 导入激活码 = {
        path: '/setting/operation/activationCode/importacCode',
        component: ImportacCode,
        authority: requirePermission('激活码管理'),
    }
    static 激活码详情 = {
        path: '/setting/operation/activationCode/acodeDetail/:params',
        link: '/setting/operation/activationCode/acodeDetail/',
        component: AccodeDetail,
        authority: requirePermission('激活码管理'),
    }
    static 员工审批管理 = {
        path: '/setting/account/approve',
        component: ApproveManage,
        authority: requirePermission('账号变更审批'),
    };
    static 员工审批管理列表 = {
        path: '/setting/account/approve/list',
        component: ApproveManageList,
        authority: requirePermission('账号变更审批'),
        redirectPath: ''
    }
    static 审批管理解锁审批 = {
        path: '/setting/account/approve/:params',
        link: '/setting/account/approve',
        component: ApproveSheet,
        authority: requirePermission('账号变更审批'),
        redirectPath: ''
    }
    static 审批管理单详情 = {
        path: '/setting/account/detail/:params',
        link: '/setting/account/detail',
        component: ApproveDetail,
        authority: requirePermission('账号变更审批'),
        redirectPath: ''
    }
    static 自定义角色管理 = {
        path: '/setting/member/customizeRoleManagement',
        component: CustomizeRoleManagement,
        authority: requirePermission('自定义角色设置'),
        redirectPath: ''
    };
    static 自定义角色管理列表 = {
        path: '/setting/member/customizeRoleManagement/list',
        component: CustomizeRoleManagementList,
        authority: requirePermission('自定义角色设置'),
        redirectPath: ''
    };
    static 自定义角色管理新增 = {
        path: '/setting/member/customizeRoleManagement/add',
        component: CustomizeRoleManagementAdd,
        authority: requirePermission('自定义角色设置'),
        redirectPath: ''
    };
    static 自定义角色管理编辑 = {
        path: '/setting/member/customizeRoleManagement/edit/:params',
        link: '/setting/member/customizeRoleManagement/edit/',
        component: CustomizeRoleManagementEdit,
        authority: requirePermission('自定义角色设置'),
        redirectPath: ''
    };
    static 员工数据管理 = {
        path: '/setting/member/employeeData',
        component: EmployeeData,
        authority: requirePermission('员工账号列表'),
        redirectPath: ''
    };
    static 员工数据列表 = {
        path: '/setting/member/employeeData/list',
        component: EmployeeDataList,
        authority: requirePermission('员工账号列表'),
        redirectPath: ''
    };
    static 员工数据详情 = {
        path: '/setting/member/employeeData/:params',
        link:'/setting/member/employeeData/',
        component: EmployeeDataDetail,
        authority: requirePermission('员工账号列表'),
        redirectPath: ''
    };
    static 业绩指标 = {
        path: '/setting/performanceIncome',
        component: PerformanceIncome,
        authority: requirePermission('约课指标设置'),
        redirectPath: ''
    };

    static 业绩指标列表 = {
        path: '/setting/performanceIncome/list',
        component: PerformanceIncomeList,
        authority: requirePermission('约课指标设置'),
        redirectPath: ''
    };
    static 业绩指标详情 = {
        path: '/setting/performanceIncome/detail/:params?',
        link: '/setting/performanceIncome/detail/',
        component: PerformanceIncomeDetail,
        authority: requirePermission('约课指标设置'),
        redirectPath: ''
    };
    static 试点中心设置 = {
        path: '/setting/testPoint',
        component: TestPoint,
        authority: requirePermission('试点中心设置'),
        redirectPath: ''
    };
    static 试点中心设置列表 = {
        path: '/setting/testPoint/list',
        component: TestPointList,
        authority: requirePermission('试点中心设置'),
        redirectPath: ''
    };
    static 非活跃会员提醒设置 = {
        path: '/setting/inactiveMemberReminder',
        component:InactiveMemberReminder,
        authority: requirePermission('非活跃会员不提醒设置'),
        redirectPath: ''
    };
    static 非活跃会员提醒管理 = {
        path: '/setting/inactiveMemberReminder/manage',
        component: InactiveMemberReminderManage,
        authority: requirePermission('非活跃会员不提醒设置'),
        redirectPath: ''
    };
    static 非活跃会员提醒新增 = {
        path: '/setting/inactiveMemberReminder/add',
        component: InactiveMemberReminderAdd,
        authority: requirePermission('非活跃会员不提醒设置'),
        redirectPath: ''
    };
    static 电子合同管理 = {
        path: '/setting/electronicContract',
        component: ElectronicContract,
        authority: requirePermission('电子合同管理'),
    };
    static 电子用印列表 = {
        path: '/setting/electronicContract/list',
        component: ElectronicContractList,
        authority: requirePermission('电子合同管理'),
    };
    static 电子用印添加 = {
        path: '/setting/electronicContract/add',
        component: ElectronicContractAdd,
        authority: requirePermission('电子合同管理'),
    };
    static 电子用印编辑 = {
        path: '/setting/electronicContract/edit/:params',
        link: '/setting/electronicContract/edit/',
        component: ElectronicContractEdit,
        authority: requirePermission('电子合同用印设置'),
    }

    static 账号绑定 = {
        path: '/setting/accountBind',
        component:AccountBind,
        authority: requirePermission('账号绑定'),
        redirectPath: ''
    };
    static 账号绑定列表 = {
        path: '/setting/accountBind/list',
        component: AccountBindList,
        authority: requirePermission('账号绑定'),
        redirectPath: ''
    };
    static 账号绑定明细 = {
        path: '/setting/accountBind/detail/:params',
        link: '/setting/accountBind/detail/',
        component: AccountBindDetail,
        authority: requirePermission('账号绑定'),
        redirectPath: ''
    };
    static 合同批量导入 = {
        path: '/setting/importContract',
        component: ImportContract,
        authority: true,
    }
}

export {SettingRoutes}
