/**
 * desc: 报表类路由
 * User: Lyon.li@gymboglobal.com
 * Date: 2018/1/10
 * Time: 上午10:38
 */
import Report from '../../ui/pages/report/index';
import AchievementCenter from '../../ui/pages/report/achievementCenter/index';
import ConsumeAndDebt from '../../ui/pages/report/consumeAndDebt/index';
import AchievementMarket from '../../ui/pages/report/achievementMarket/index';
import AchievementMarketSell from '../../ui/pages/report/achievementMarketSell/index';
import MarketDetail from '../../ui/pages/report/marketDetail/index';
import MarketDetailSell from '../../ui/pages/report/marketDetailSell/index';
import ContractExpire from '../../ui/pages/report/contractExpire/index';
import TaskFollowUp from '../../ui/pages/report/taskFollowUp/index';
import MemberAbsentTwice from '../../ui/pages/report/memberAbsentTwice/index';
import MemberConsumeCourse from '../../ui/pages/report/memberConsumeCourse/index';
import MemberUpdateCourse from '../../ui/pages/report/memeberUpdateCourse/index';
import AchievementDaily from '../../ui/pages/report/achievementDaily/index';
import IncomeCenter from '../../ui/pages/report/incomeCenter/index';
import ConsumerCourseStatistics from '../../ui/pages/report/consumeCourseStatistics/index';
import GaConsume from '../../ui/pages/report/consumeCourseStatistics/part/ga';
import GbConsume from '../../ui/pages/report/consumeCourseStatistics/part/gb';
import InsConsume from '../../ui/pages/report/consumeCourseStatistics/part/ins'
import AchievementMarketStyle from '../../ui/pages/report/achievementMarketStyle/index';
import AchievementMarketStyleSell from '../../ui/pages/report/achievementMarketStyleSell/index';
import Attendance from '../../ui/pages/report/attendance/index';
import AttendanceDetail from '../../ui/pages/report/attendanceDetail/index';
import {requirePermission} from './routeFuncIdMap';
import OrderGoodsLimit from '../../ui/pages/report/orderGoodsLimit/index';
import AdvancePayment from '@/ui/pages/report/advancePayment';
import UnshippedOrder from '@/ui/pages/report/unshippedOrder';
import UnexpiredPremium from '../../ui/pages/report/unexpiredPremium/index';
import AccountStatement from '../../ui/pages/report/accountStatement/index';
import StarInquiry from '@/ui/pages/report/starInquiry';
import {UnConsumeAndDebt} from "@/ui/pages/report/unConsumeAndDebt";
// 消息报表类
import {ArrangeClassVital} from "@/ui/pages/report/arrangeClassVital";
import { LeaveMember } from "@/ui/pages/report/leaveMember";
import { AtendClassDetail } from "@/ui/pages/report/attendClassDetail";

import { RepairData } from '@/ui/pages/report/repairData';
import { ActivityConsumptionCourseList } from "@/ui/pages/report/activityConsumptionCourse";
import { ActivityConsumptionCourseDetail } from '@/ui/pages/report/activityConsumptionCourse/detail'
import { PaymentReceivedDetail } from '@/ui/pages/report/paymentReceivedDetail'
import { ExchangeAndDeletedRecord } from '@/ui/pages/report/exchangeAndDeletedRecord'
import { SpecialOperationLog } from "@/ui/pages/report/specialOperationLog";
import { MultiCenterDownload } from "@/ui/pages/report/multiCenterDownload";
import { MultiCenterQueryList } from "@/ui/pages/report/multiCenterQueryList";
import {VisitForm} from "@/ui/pages/report/visitForm";

import {Approval} from "@/ui/pages/report/approval";
import {Apply} from "@/ui/pages/report/apply";
import {ARBill} from "@/ui/pages/report/arBill";
import {ARBillDetail} from "@/ui/pages/report/arBill/detail";
import {Policy} from "@/ui/pages/report/policy";

export class ReportRoutes {
    static 报表 = {
        path: "/report",
        component: Report,
        authority: requirePermission("绩效中心")
    };
    static 中心业绩 = {
        path: "/report/achievementCenter",
        component: AchievementCenter,
        authority: requirePermission("中心业绩")
    };
    static 消耗负债 = {
        path: "/report/consumeAndDebt",
        component: ConsumeAndDebt,
        authority: requirePermission("消耗负债(按合同)")
    };
    // Todo
    static 未消耗负债 = {
        path: "/report/unConsumeAndDebt",
        component: UnConsumeAndDebt,
        authority: requirePermission("未消耗负债查询")
    };
    static 市场渠道业绩 = {
        path: '/report/achievementMarket',
        component: AchievementMarket,
        authority: requirePermission('渠道业绩'),
    };
    static 市场渠道业绩销售向 = {
        path: '/report/achievementMarketSell',
        component: AchievementMarketSell,
        authority: requirePermission('渠道业绩(销售向)'),
    };
    static 市场名单明细 = {
        path: '/report/marketDetail',
        component: MarketDetail,
        authority: requirePermission('市场名单明细'),
    };
    static 市场名单明细销售向 = {
        path: '/report/marketDetailSell',
        component: MarketDetailSell,
        authority: requirePermission('市场名单明细（销售向）'),
    };
    static 合同到期提醒 = {
        path: '/report/contractExpire',
        component: ContractExpire,
        authority: requirePermission('合同到期提醒'),
    };
    static 任务跟进记录 = {
        path: '/report/taskFollowUp',
        component: TaskFollowUp,
        authority: requirePermission('任务跟进记录'),
    };
    static 会员连续未到提醒 = {
        path: '/report/memberAbsentTwice',
        component: MemberAbsentTwice,
        authority: requirePermission('会员连续未到提醒'),
    };
    static 会员排课耗课统计 = {
        path: '/report/memberConsumeCourse',
        component: MemberConsumeCourse,
        authority: requirePermission('会员排课耗课统计'),
    };
    static 会员升班提醒 = {
        path: '/report/memberUpdateCourse',
        component: MemberUpdateCourse,
        authority: requirePermission('即将升班宝宝明细'),
    };
    static 日常业绩统计 = {
        path: '/report/achievementDaily',
        component: AchievementDaily,
        authority: requirePermission('日常业绩统计'),
    };
    static 中心收入统计 = {
        path: '/report/incomeCenter',
        component: IncomeCenter,
        authority: requirePermission('中心收入统计'),
    };
    static 耗课统计 = {
        path: '/report/consumerCourseStatistics',
        component: ConsumerCourseStatistics,
        authority: requirePermission('服务类报表'),
        routes: [
            {
                path: '/report/consumerCourseStatistics/gb',
                component: GbConsume,
            },
            {
                path: '/report/consumerCourseStatistics/ga',
                component: GaConsume,
            },
            {
                path: '/report/consumerCourseStatistics/ins',
                component: InsConsume,
            },
        ],
    };
    static 渠道出现方式业绩 = {
        path: '/report/achievementMarketStyle',
        component: AchievementMarketStyle,
        authority: requirePermission('渠道+出现方式业绩'),
    };
    static 渠道出现方式业绩销售向 = {
        path: '/report/achievementMarketStyleSell',
        component: AchievementMarketStyleSell,
        authority: requirePermission('渠道+出现方式业绩(销售向)'),
    };
    static 出席报告 = {
        path: '/report/attendance',
        component: Attendance,
        authority: requirePermission('出席报告'),
    };
    static 出席报告详情 = {
        path: '/report/attendanceDetail/:params?',
        link: '/report/attendanceDetail',
        component: AttendanceDetail,
        authority: requirePermission('出席报告'),
    };
    static 订货额度 = {
        path: '/report/orderGoodsLimit',
        component: OrderGoodsLimit,
        authority: requirePermission('订货额度'),
    };
    static 预付款余额 = {
        path: '/report/advancePayment',
        component: AdvancePayment,
        authority: requirePermission('订货额度'),
    };
    static 未发货订单 = {
        path: '/report/unshippedOrder/:params?',
        link: '/report/unshippedOrder',
        component: UnshippedOrder,
        authority: requirePermission('订货额度'),
    };
    static 未到期权益金 = {
        path: '/report/unexpiredPremium',
        component: UnexpiredPremium,
        authority: requirePermission('订货额度'),
    };
    static 对账单 = {
        path: '/report/accountStatement',
        component: AccountStatement,
        authority: requirePermission('对账单'),
    };
    static 星级查询 = {
        path: '/report/starInquiry',
        // link: '/report/starInquiry',
        component: StarInquiry,
        authority: requirePermission('星级评分'),
    };
    static 期初数据修正表 = {
        path: '/report/repairData',
        component: RepairData,
        authority: requirePermission('期初数据对照'),
    };
    static 排课耗课统计 = {
        path: '/report/arrangeClassVital',
        component:ArrangeClassVital,
        authority: requirePermission('排课耗课统计'),
    }
    static 请假会员名单 = {
        path: '/report/leaveMember',
        component: LeaveMember,
        authority: requirePermission('请假明细'),
    }
    static 出席会员上课明细 = {
        path: '/report/attendClassDetail',
        component: AtendClassDetail,
        authority: requirePermission('出席会员上课明细'),
    }
    static 活动耗课表 = {
        path: '/report/activityConsumptionCourse/list',
        component: ActivityConsumptionCourseList,
        authority: requirePermission('活动耗课统计/明细'),
    };
    static 活动耗课明细表 = {
        path: '/report/activityConsumptionCourse/detail/:params',
        link: '/report/activityConsumptionCourse/detail/',
        component: ActivityConsumptionCourseDetail,
        authority: requirePermission('活动耗课统计/明细'),
    };
    static 换课删课明细记录 = {
        path: '/report/exchangeAndDeletedRecord',
        component: ExchangeAndDeletedRecord,
        authority: requirePermission('换/删课明细'),
    };
    static 特殊操作日志记录 = {
        path: "/report/specialOperationLog",
        component: SpecialOperationLog,
        authority: requirePermission("特殊操作日志记录"),
    };
    static 收付款明细 = {
        path: '/report/PaymentReceivedDetail',
        component: PaymentReceivedDetail,
        authority: requirePermission('收付款明细'),
    };
    static 到访表 = {
        path: '/report/visitForm',
        component: VisitForm,
        authority: requirePermission('到访表'),
    };
    static 多中心导出下载 = {
        path: "/report/multiCenterDownload",
        component: MultiCenterDownload,
        authority: requirePermission("多中心导出下载"),
    };
    static 多中心导出查看 = {
        path: "/report/multiCenterQueryList",
        component: MultiCenterQueryList,
        authority: requirePermission("多中心导出查看"),
    };
    static 审批报表导出申请 = {
        path: '/report/approval',
        component: Approval,
        authority: requirePermission('审批报表导出申请'),
    };
    static 查看报表导出审批进度 = {
        path: '/report/apply',
        component: Apply,
        authority: requirePermission('查看报表导出审批进度'),
    };
    static 月度AR账单 = {
        path: '/report/ARBill',
        component: ARBill,
        authority: requirePermission('月度AR账单'),
    };
    static 月度AR账单明细 = {
        path: '/report/ARBillDetail/:params?',
        link: '/report/ARBillDetail/',
        component: ARBillDetail,
        authority: requirePermission('月度AR账单'),
    }
    static 政策管理 = {
        path: '/report/policy',
        component: Policy,
        authority: requirePermission('政策管理(查看)'),
    }
}
