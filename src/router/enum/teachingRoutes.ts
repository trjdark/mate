/**
 * Desc: 教学管理页面路由
 * User: Debby.Deng
 * Date: 2018/11/29,
 * Time: 下午1:43
 */
// 排课
import {Teaching} from "@/ui/pages/teaching";
import {Schedule} from "@/ui/pages/teaching/schedule";
import {SignInList} from "@/ui/pages/teaching/schedule/part/signInList";
import {SigninListPrint} from "@/ui/pages/teaching/schedule/print";

// 选课、试听
import {TeachingSelection} from '@/ui/pages/teaching/selection';
import {CourseSelection} from '@/ui/pages/teaching/selection/select';
import {ReserveSubmit} from '@/ui/pages/teaching/selection/reserve';
import {ListenSubmit} from '@/ui/pages/teaching/selection/listen';
// 批量换课选课
import { TeachingSelectionNew } from '@/ui/pages/teaching/selectionNew';
import { CourseSelectionNew } from '@/ui/pages/teaching/selectionNew/select';
import { ReserveSubmitNew } from '@/ui/pages/teaching/selectionNew/reserve';
import { ListenSubmitNew } from '@/ui/pages/teaching/selectionNew/listen';
// 申请管理
import {MakeupApply} from "@/ui/pages/teaching/applyManage/makeupApply";
import {MakeUpApplyDetail} from "@/ui/pages/teaching/applyManage/makeUpApplyDetail";
import {MakeUpApplyApprove} from "@/ui/pages/teaching/applyManage/makeUpApplyApprove";
import {LeaveApply} from "@/ui/pages/teaching/applyManage/leaveApply";
import {GymGuard} from "@/ui/pages/teaching/applyManage/gymGuard";
import {CourseSelectionList} from "@/ui/pages/teaching/courseSelection/courseSelectionList";
import {CourseSelectionCalendar} from "@/ui/pages/teaching/courseSelection/courseSelectionCalendar";
import {RRPConfig} from "@/ui/pages/teaching/rrp";
import {RRPConfigDetail} from "@/ui/pages/teaching/rrp/rrpConfigDetail";
import {SystemMessage} from "@/ui/pages/teaching/message";
import {SystemMessageSet} from "@/ui/pages/teaching/message/page/set";
import {SystemMessageTemplate} from "@/ui/pages/teaching/message/page/template";
import { ReviewLibaray } from "@/ui/pages/teaching/reviewLibrary";
import {ReviewLibarayList} from "@/ui/pages/teaching/reviewLibrary/page/list";
import {ReviewLibarayDetail} from "@/ui/pages/teaching/reviewLibrary/page/detail";
import {ReviewLibarayLessonInfo} from "@/ui/pages/teaching/reviewLibrary/page/lessonInfo";
import {ReviewLibarayAddLessonInfo} from "@/ui/pages/teaching/reviewLibrary/page/addLessonInfo";
// 点评库2.0
import { ReviewLibarayNew } from "@/ui/pages/teaching/reviewLibraryNew";
import { ReviewLibarayListNew } from "@/ui/pages/teaching/reviewLibraryNew/page/list";
import { ReviewLibarayDetailNew } from "@/ui/pages/teaching/reviewLibraryNew/page/detail";
import { ReviewLibarayLessonInfoNew } from "@/ui/pages/teaching/reviewLibraryNew/page/lessonInfo";
import {TeachThemes} from "@/ui/pages/teaching/teachThemes";
import {TeachThemesSet} from "@/ui/pages/teaching/teachThemes/page/set";
import {RCourse} from "@/ui/pages/teaching/rCourseTheme";
import {RCourseSet} from "@/ui/pages/teaching/rCourseTheme/page/set";
import {RCourseList} from "@/ui/pages/teaching/rCourseTheme/page/list";
import {RCourseDetail} from "@/ui/pages/teaching/rCourseTheme/page/detail";
// 主题配置
import { TeachThemesNew } from "@/ui/pages/teaching/teachThemesNew";
import { TeachThemesSetNew } from "@/ui/pages/teaching/teachThemesNew/page/set";

import {EvaluationLibaray} from "@/ui/pages/teaching/evaluationLibrary";
import {EvaluationLibarayAdd} from "@/ui/pages/teaching/evaluationLibrary/part/add";
import {EvalutionLibarayList} from "@/ui/pages/teaching/evaluationLibrary/part/list";
import {EvaluationLibarayEdit} from "@/ui/pages/teaching/evaluationLibrary/part/edit";

import { EvaluationLibarayInfo } from "@/ui/pages/teaching/evaluationReport/part/detail";
import {EvaluationReport} from "@/ui/pages/teaching/evaluationReport";
import {EvalutionReportList} from "@/ui/pages/teaching/evaluationReport/part/list";
import { EvaluationReportEdit } from "@/ui/pages/teaching/evaluationReport/part/edit";
import { EvaluationReportAdd } from "@/ui/pages/teaching/evaluationReport/part/create";
// 随堂反馈
import { FeedBack } from '@/ui/pages/teaching/feedback/index'
import { FeedBackList } from '@/ui/pages/teaching/feedback/list';
import {FeedBackEdit} from '@/ui/pages/teaching/feedback/part/edit';
import {FeedBackEvaluate} from '@/ui/pages/teaching/feedback/part/evaluate';
import {FeedBackManage} from '@/ui/pages/teaching/feedBackManage';
import {FeedBackManageList} from '@/ui/pages/teaching/feedBackManage/part/list';
import { FeedBackManageDetail } from '@/ui/pages/teaching/feedBackManage/part/detail';
import {FeedBackStatistics} from '@/ui/pages/teaching/feedBackstatistics/index';
import {FeedBackStatisticsList} from '@/ui/pages/teaching/feedBackstatistics/part/list';
import {FeedBackStatisticsDetail} from '@/ui/pages/teaching/feedBackstatistics/part/detail';
import { FeedBackReport } from '@/ui/pages/teaching/feedback/part/report';
import { CenterOpenAppointment } from '@/ui/pages/teaching/centerOpenAppointment/index';
// 随堂反馈2.0
import {FeedBackNew} from '@/ui/pages/teaching/feedbackNew/index';
import {FeedBackListNew} from '@/ui/pages/teaching/feedbackNew/list';
import { FeedBackReportNew } from '@/ui/pages/teaching/feedbackNew/part/report';
import {FeedBackEvaluateNew} from '@/ui/pages/teaching/feedbackNew/part/evaluate';
import { FeedBackManageNew } from '@/ui/pages/teaching/feedBackManageNew';
import { FeedBackManageListNew } from '@/ui/pages/teaching/feedBackManageNew/part/list';
import { FeedBackManageDetailNew } from '@/ui/pages/teaching/feedBackManageNew/part/detail';
import { FeedBackStatisticsNew } from '@/ui/pages/teaching/feedBackstatisticsNew/index';
import { FeedBackStatisticsListNew } from '@/ui/pages/teaching/feedBackstatisticsNew/part/list';
import { FeedBackStatisticsDetailNew } from '@/ui/pages/teaching/feedBackstatisticsNew/part/detail';
// 月度回顾管理
import { MonthlyReport } from '@/ui/pages/teaching/monthlyReport';
import {MonthlyReportList} from "@/ui/pages/teaching/monthlyReport/part/list";
// 升班报告
import { PromotionReportList } from '@/ui/pages/teaching/levelUpReport/part/list';
import { PromotionReport } from '@/ui/pages/teaching/levelUpReport';
// 领域设置
import {ScopesSet} from "@/ui/pages/teaching/scopesSet";
import {AppCourse} from "@/ui/pages/teaching/appCourse";

import {requirePermission} from './routeFuncIdMap';


class TeachingRoutes {
    static 教学管理 = {
        path: '/teaching',
        component: Teaching,
        authority: requirePermission('教学'),

    };
    static 课程表 = {
        path: '/teaching/schedule/:params?',
        link: '/teaching/schedule/',
        component: Schedule,
        authority: requirePermission('课程表'),
    };
    static 签到 = {
        path: '/teaching/signin/:params',
        link: '/teaching/signin/',
        component: SignInList,
        authority: requirePermission('上课签到'),
    };
    static 签到打印 = {
        path: '/teaching/signin/print/:params',
        link: '/teaching/signin/print/',
        component: SigninListPrint,
        authority: requirePermission('上课签到'),
    };

    static 选课 = {
        path:'/customer/selection',
        component: TeachingSelection,
        authority: requirePermission('客户中心')
    };
    static 选择固定课表={
        path:'/customer/selection/select/:params',
        link:'/customer/selection/select/',
        component: CourseSelection,
        authority: requirePermission('客户中心')
    };
    static 提交预定={
        path:'/customer/selection/submit/:params',
        link:'/customer/selection/submit/',
        component: ReserveSubmit,
        authority: requirePermission('客户中心')
    };
    static 提交试听={
        path:'/customer/selection/listen/:params',
        link:'/customer/selection/listen/',
        component:ListenSubmit,
        authority: requirePermission('客户中心')
    };
    // 批量换课
    static 选课新 = {
        path: '/customer/selectionNew',
        component: TeachingSelectionNew,
        authority: requirePermission('客户中心')
    };
    static 选择固定课表新 = {
        path: '/customer/selectionNew/select/:params',
        link: '/customer/selectionNew/select/',
        component: CourseSelectionNew,
        authority: requirePermission('客户中心')
    };
    static 提交预定新 = {
        path: '/customer/selectionNew/submit/:params',
        link: '/customer/selectionNew/submit/',
        component: ReserveSubmitNew,
        authority: requirePermission('客户中心')
    };
    static 提交试听新 = {
        path: '/customer/selectionNew/listen/:params',
        link: '/customer/selectionNew/listen/',
        component: ListenSubmitNew,
        authority: requirePermission('客户中心')
    };
    // 随堂反馈2.0
    static 随堂反馈新 = {
        path: '/teaching/feedbackNew',
        component: FeedBackNew,
        authority: requirePermission('随堂反馈2.0')
    };
    static 随堂反馈列表新 = {
        path: '/teaching/feedbackNew/list',
        component: FeedBackListNew,
        authority: requirePermission('随堂反馈2.0')
    };
    static 随堂反馈测评新 = {
        path: '/teaching/feedbackNew/evaluate/:params',
        link: '/teaching/feedbackNew/evaluate/',
        component: FeedBackEvaluateNew,
        authority: requirePermission('随堂反馈2.0')
    };
    static 随堂反馈报告详情新 = {
        path: '/teaching/feedbackNew/report/:params',
        link: '/teaching/feedbackNew/report/',
        component: FeedBackReportNew,
        authority: requirePermission('随堂反馈2.0')
    };
    static 随堂反馈管理新 = {
        path: '/teaching/feedBackManageNew',
        component: FeedBackManageNew,
        authority: requirePermission('随堂反馈管理2.0')
    }
    static 随堂反馈管理列表新 = {
        path: '/teaching/feedBackManageNew/list',
        component: FeedBackManageListNew,
        authority: requirePermission('随堂反馈管理2.0')
    }
    static 随堂反馈管理查看新 = {
        path: '/teaching/feedBackManageNew/detail/:params',
        link: '/teaching/feedBackManageNew/detail/',
        component: FeedBackManageDetailNew,
        authority: requirePermission('随堂反馈管理2.0')
    }
    static 随堂反馈数据统计新 = {
        path: '/teaching/feedBackstatisticsNew',
        component: FeedBackStatisticsNew,
        authority: requirePermission('随堂反馈数据统计')

    }
    static 随堂反馈数据统计列表新 = {
        path: '/teaching/feedBackstatisticsNew/list',
        component: FeedBackStatisticsListNew,
        authority: requirePermission('随堂反馈数据统计')

    }
    static 随堂反馈数据统计查看新 = {
        path: '/teaching/feedBackstatisticsNew/detail/:params',
        link: '/teaching/feedBackstatisticsNew/detail/',
        component: FeedBackStatisticsDetailNew,
        authority: requirePermission('随堂反馈数据统计')
    }

    // 随堂反馈1.0
    static 随堂反馈={
        path:'/teaching/feedback',
        component: FeedBack,
        authority:requirePermission('随堂反馈(Art)')
    };
    static 随堂反馈列表 = {
        path: '/teaching/feedback/list',
        component: FeedBackList,
        authority: requirePermission('随堂反馈(Art)')
    };
    static 随堂反馈测评={
        path:'/teaching/feedback/evaluate/:params',
        link:'/teaching/feedback/evaluate/',
        component: FeedBackEvaluate,
        authority: requirePermission('随堂反馈(Art)')
    };
    static 随堂反馈编辑 = {
        path: '/teaching/feedback/edit/:params',
        link: '/teaching/feedback/edit/',
        component: FeedBackEdit,
        authority: requirePermission('随堂反馈(Art)')
    };
    static 随堂反馈报告详情 = {
        path: '/teaching/feedback/report/:params',
        link: '/teaching/feedback/report/',
        component: FeedBackReport,
        authority: requirePermission('随堂反馈(Art)')
    };
    static 随堂反馈管理 = {
        path: '/teaching/feedBackManage',
        component: FeedBackManage,
        authority: requirePermission('随堂反馈管理(Art)')
    }
    static 随堂反馈管理列表={
        path: '/teaching/feedBackManage/list',
        component: FeedBackManageList,
        authority: requirePermission('随堂反馈管理(Art)')
    }
    static 随堂反馈管理查看 = {
        path: '/teaching/feedBackManage/detail/:params',
        link: '/teaching/feedBackManage/detail/',
        component: FeedBackManageDetail,
        authority: requirePermission('随堂反馈管理(Art)')
    }
    static 随堂反馈数据统计 = {
        path: '/teaching/feedBackstatistics',
        component: FeedBackStatistics,
        authority: requirePermission('随堂反馈数据统计')

    }
    static 随堂反馈数据统计列表 = {
        path: '/teaching/feedBackstatistics/list',
        component: FeedBackStatisticsList,
        authority: requirePermission('随堂反馈数据统计')

    }
    static 随堂反馈数据统计查看 = {
        path: '/teaching/feedBackstatistics/detail/:params',
        link: '/teaching/feedBackstatistics/detail/',
        component: FeedBackStatisticsDetail,
        authority: requirePermission('随堂反馈数据统计')
    }

    static 选课情况列表 = {
        path: '/customer/courseSelectionList/:params',
        link: '/customer/courseSelectionList/',
        component: CourseSelectionList,
        authority: requirePermission('客户中心')
    };
    static 选课情况日历 = {
        path: '/customer/courseSelectionCalendar/:params',
        link: '/customer/courseSelectionCalendar/',
        component: CourseSelectionCalendar,
        authority: requirePermission('客户中心')
    };
    static 试听申请 = {
        path: '/teaching/makeup',
        component: MakeupApply,
        authority: requirePermission('试听申请'),
    };
    static 试听申请查看 = {
        path: '/teaching/makeUpDetail/:params',
        link: '/teaching/makeUpDetail/',
        component: MakeUpApplyDetail,
        authority: requirePermission('试听申请'),
    };
    static 试听申请审批 = {
        path: '/teaching/makeUpApprove/:params',
        link: '/teaching/makeUpApprove/',
        component: MakeUpApplyApprove,
        authority: requirePermission('试听申请'),
    };
    static 请假申请 = {
        path: '/teaching/leaveApply',
        component: LeaveApply,
        authority: requirePermission('请假申请'),
    };
    static gymguard = {
        path: '/teaching/gymGuard',
        component: GymGuard,
        authority: requirePermission('GYM Guard'),
    };
    static RRP课程类型配置 = {
        path: '/teaching/rrpConfig',
        component: RRPConfig,
        authority: requirePermission('RRP配置管理'),
        redirectPath: ''
    };
    static RRP课程类型配置详情 = {
        path: '/teaching/rrpConfig/detail',
        component: RRPConfigDetail,
        authority: requirePermission('RRP配置管理'),
        redirectPath: ''
    };
    static 点评库管理新版 = {
        path: '/teaching/reviewNew',
        component: ReviewLibarayNew,
        authority: requirePermission('点评库设置2.0'),
        redirectPath: ''
    }
    static 点评库管理列表新版 = {
        path: '/teaching/reviewNew/list',
        component: ReviewLibarayListNew,
        authority: requirePermission('点评库设置2.0'),
        redirectPath: ''
    }
    static 教案修改新版 = {
        path: '/teaching/reviewNew/detail/:params',
        link: '/teaching/reviewNew/detail/',
        component: ReviewLibarayDetailNew,
        authority: requirePermission('点评库设置2.0'),
        redirectPath: ''
    };
    static 教案详情新版 = {
        path: '/teaching/reviewNew/lesson/:params',
        link: '/teaching/reviewNew/lesson/',
        component: ReviewLibarayLessonInfoNew,
        authority: requirePermission('点评库设置2.0'),
        redirectPath: ''
    };
    static 点评库管理 = {
        path: '/teaching/review',
        component: ReviewLibaray,
        authority: requirePermission('点评库设置(Art)'),
        redirectPath: ''
    }
    static 点评库管理列表 = {
        path: '/teaching/review/list',
        component: ReviewLibarayList,
        authority: requirePermission('点评库设置(Art)'),
        redirectPath: ''
    }
    static 教案修改 = {
        path: '/teaching/review/detail/:params',
        link: '/teaching/review/detail/',
        component: ReviewLibarayDetail,
        authority: requirePermission('点评库设置(Art)'),
        redirectPath: ''
    };
    static 教案详情 = {
        path: '/teaching/review/lesson/:params',
        link: '/teaching/review/lesson/',
        component: ReviewLibarayLessonInfo,
        authority: requirePermission('点评库设置(Art)'),
        redirectPath: ''
    };
    static 添加教案 = {
        path: '/teaching/review/add/lesson/:params',
        link: '/teaching/review/add/lesson/',
        component: ReviewLibarayAddLessonInfo,
        authority: requirePermission('点评库设置(Art)'),
        redirectPath: ''
    };
    static 系统消息推送 = {
        path: '/teaching/message',
        component: SystemMessage,
        authority: requirePermission('系统消息推送'),
        redirectPath: ''
    }
    static 系统消息设置 = {
        path: '/teaching/message/set',
        component: SystemMessageSet,
        authority: requirePermission('系统消息推送'),
        redirectPath: ''
    }
    static 系统消息模版 = {
        path: '/teaching/message/template/:params',
        link: '/teaching/message/template/',
        component: SystemMessageTemplate,
        authority: requirePermission('系统消息推送'),
        redirectPath: ''
    }
    static 中心主题新 = {
        path: '/teaching/teachThemesNew',
        component: TeachThemesNew,
        authority: requirePermission('课程主题设置2.0'),
        redirectPath: ''
    }
    static 中心主题配置新 = {
        path: '/teaching/teachThemesNew/set',
        component: TeachThemesSetNew,
        authority: requirePermission('课程主题设置2.0'),
        redirectPath: ''
    }
    static 中心主题 = {
        path: '/teaching/teachThemes',
        component: TeachThemes,
        authority: requirePermission('课程主题设置(Art)'),
        redirectPath: ''
    }
    static 中心主题配置 = {
        path: '/teaching/teachThemes/set',
        component: TeachThemesSet,
        authority: requirePermission('课程主题设置(Art)'),
        redirectPath: ''
    }
    // todo
    static 测评库 = {
        path: '/teaching/evaluation',
        component: EvaluationLibaray,
        authority: requirePermission('到访测评设置'),
        redirectPath: ''
    }
    static 测评库列表 = {
        path: '/teaching/evaluation/list',
        component: EvalutionLibarayList,
        authority: requirePermission('到访测评设置'),
        redirectPath: ''
    }
    static 测评库新增 = {
        path: '/teaching/evaluation/add',
        component: EvaluationLibarayAdd,
        authority: requirePermission('到访测评设置'),
        redirectPath: ''
    }
    static 测评库编辑 = {
        path: '/teaching/evaluation/edit/:params',
        link: '/teaching/evaluation/edit/',
        component: EvaluationLibarayEdit,
        authority: requirePermission('到访测评设置'),
        redirectPath: ''
    }
    static 测评报告 = {
        path: '/teaching/evaluationReport',
        component: EvaluationReport,
        authority: requirePermission('到访测评'),
        redirectPath: ''
    }
    static 测评报告列表 = {
        path: '/teaching/evaluationReport/list',
        component: EvalutionReportList,
        authority: requirePermission('到访测评'),
        redirectPath: ''
    }
    static 测评报告新建 = {
        path: '/teaching/evaluationReport/add/:params',
        link: '/teaching/evaluationReport/add/',
        component: EvaluationReportAdd,
        authority: requirePermission('到访测评'),
        redirectPath: ''
    }
    static 测评报告编辑 = {
        path: '/teaching/evaluationReport/edit/:params',
        link: '/teaching/evaluationReport/edit/',
        component: EvaluationReportEdit,
        authority: requirePermission('到访测评'),
        redirectPath: ''
    }
    static 测评报告详情= {
        path: '/teaching/evaluationReport/detail/:params',
        link: '/teaching/evaluationReport/detail/',
        component: EvaluationLibarayInfo,
        authority: requirePermission('到访测评'),
        redirectPath: ''
    }
    static 中心开放约课等位 = {
        path: '/teaching/centerOpenAppointment',
        component:CenterOpenAppointment,
        authority: requirePermission('到访测评设置'),
    }
    static 月度回顾管理 = {
        path: '/teaching/monthlyReport',
        component:MonthlyReport,
        authority: requirePermission('月度回顾管理'),
        redirectPath: ''
    }
    static 月度回顾管理列表 = {
        path: '/teaching/monthlyReport/list',
        component:MonthlyReportList,
        authority: requirePermission('月度回顾管理'),
        redirectPath: ''
    }
    static 升班报告管理 = {
        path: '/teaching/promotionReport',
        component:PromotionReport,
        authority: requirePermission('升班报告'),
        redirectPath: ''
    }
    static 升班报告管理列表 = {
        path: '/teaching/promotionReport/list',
        component:PromotionReportList,
        authority: requirePermission('升班报告'),
        redirectPath: ''
    }
    static 八大领域管理设置 = {
        path: '/teaching/scopesSet',
        component: ScopesSet,
        authority: requirePermission('八大领域管理设置'),
    }

    static R店主题 = {
        path: '/teaching/rCourse',
        component: RCourse,
        authority: requirePermission('R店主题资源库'),
        redirectPath: ''
    }
    static R店主题资源库 = {
        path: '/teaching/rCourse/list',
        component: RCourseList,
        authority: requirePermission('R店主题资源库'),
        redirectPath: ''
    }
    static R店主题资源库详情 = {
        path: '/teaching/rCourse/detail/:params',
        link: '/teaching/rCourse/detail/',
        component: RCourseDetail,
        authority: requirePermission('R店主题资源库'),
        redirectPath: ''
    }
    static R店主题设置 = {
        path: '/teaching/rCourse/themeSet',
        component: RCourseSet,
        authority: requirePermission('R店主题设置'),
        redirectPath: ''
    }
    static App课程展示 = {
        path: '/teaching/appCourse',
        component: AppCourse,
        authority: requirePermission('课程主题设置2.0'),
        redirectPath: ''
    }

}

export {TeachingRoutes}
