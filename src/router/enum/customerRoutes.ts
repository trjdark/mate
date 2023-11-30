import {Customer} from "../../ui/pages/customer/index";
import AssignCustomer from "../../ui/pages/customer/assign/index";
import {CreateCustomer} from "../../ui/pages/customer/create/index";
import {BatchImportIdx} from '../../ui/pages/customer/batchImport/index';
import {AssignRecord} from '../../ui/pages/customer/assignRecord/index';
import {Client360} from '../../ui/pages/customer/client360/index';
import {HistoryRecord} from "../../ui/pages/customer/history/index";
import {CustAcquisition} from "../../ui/pages/customer/360/customerAcquisition/index";
import {BasicInformation360} from '../../ui/pages/customer/360/basicInformation/index';
import {HokaniInfo} from '../../ui/pages/customer/360/hokaniInfo/index';
import {CustGrowth} from "../../ui/pages/customer/360/customerGrowth/index";
import {OuterQuery} from "../../ui/pages/customer/leadsQuery/outerQuery/index";
import {ChannelLogs} from "@/ui/pages/customer/channelLogs";
import {requirePermission} from './routeFuncIdMap';
import {CheckRRP} from "@/ui/pages/customer/rrp";
import {CallRecords} from "@/ui/pages/customer/callRecords";
import {OnlineCallRecords} from "@/ui/pages/customer/onlineCallRecords";
import {MonthlyReportDetail} from "@/ui/pages/customer/360/customerGrowth/part/detail";
import {PromotionReportInfo} from "@/ui/pages/teaching/levelUpReport/part/detail";
import {ClientCenter} from "@/ui/pages/customer/clientCenter";

class CustomerRoutes {
    static 客户中心 = {
        path: '/customer',
        component: Customer,
        authority: requirePermission('客户'),
    };
    static 分配客户={
        path: '/customer/assign/:params?',
        link: '/customer/assign',
        component: AssignCustomer,
        authority: requirePermission('客户中心'),
    };

    static 客户360={
        path: '/customer/client360/:params',
        link: '/customer/client360/',
        component: Client360,
        authority: requirePermission('客户中心', true),
    };

    static 客户360基本信息={
      path: '/customer/360basicInfo/:params',
      link: '/customer/360basicInfo',
      component:BasicInformation360,
      authority: requirePermission('客户中心'),
    };

    static 新建客户 = {
        path: '/customer/create',
        component: CreateCustomer,
        authority: requirePermission('新建Leads'),
    };

    static 批量导入客户 = {
        path: '/customer/import',
        component: BatchImportIdx,
        authority: requirePermission('批量导入Leads'),
    };

    static 分配记录 = {
        path: '/customer/assignRecord',
        component: AssignRecord,
        authority: requirePermission('转中心记录'),
    };

    static 历史名单={
        path: '/customer/history',
        component: HistoryRecord,
    };

    static 客户获取={
        path: '/customer/acquisition/:params',
        link: '/customer/acquisition',
        component: CustAcquisition,
        authority: requirePermission('客户中心'),
    };
    static 客户成长={
        path: '/customer/growth/:params',
        link: '/customer/growth',
        component: CustGrowth,
        authority: requirePermission('客户中心'),
    };

    static 跨中心查询 = {
        path: '/customer/cross/leads/query',
        component: OuterQuery,
        authority: requirePermission('跨中心Leads查询'),
    };
    static rrp绑定查询 = {
        path: '/customer/rrp/status',
        component: CheckRRP,
        authority: requirePermission('客户中心'),
    }

    static 其他信息 = {
      path: '/customer/hokaniInfo/:params',
      link: '/customer/hokaniInfo/',
      component:HokaniInfo,
      authority: requirePermission('客户中心'),
    }
    static 渠道日志 = {
        path: '/customer/ChannelLogs/:params',
        link: '/customer/ChannelLogs/',
        component:ChannelLogs,
        authority: requirePermission('客户中心'),
    }
    static 通话记录 = {
        path: '/customer/leadsCallRecords/:params',
        link: '/customer/leadsCallRecords/',
        component:CallRecords,
        authority: requirePermission('客户中心'),
    }
    static 云语音记录 = {
        path: '/customer/callRecords',
        component:OnlineCallRecords,
        authority: requirePermission('客户中心'),
    }
    static 月度回顾管理查询 = {
        path: '/customer/monthlyReport/detail/:params',
        link: '/customer/monthlyReport/detail/',
        component:MonthlyReportDetail,
        authority: requirePermission('月度回顾管理'),
        redirectPath: ''
    }
    static 升班报告管理查询 = {
        path: '/customer/promotionReport/detail/:params',
        link: '/customer/promotionReport/detail/',
        component:PromotionReportInfo,
        authority: requirePermission('升班报告'),
        redirectPath: ''
    }
    static 新客户中心={
        path: '/customer/client/:params?',
        link: '/customer/client',
        component: ClientCenter,
        authority: true,
    };
}

export {CustomerRoutes};
