/**
 * desc: 菜单枚举
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2021/9/2
 * Time: 下午4:22
 */
import {FUNC} from "@/ui/pages/setting/enum/functions";
import {Routes} from "@/router/enum/routes";

declare interface item {
    title: string;                            // 菜单名
    key: string;                              // 键值（唯一）
    iconType: string;                         // icon 图标
    isShow ?: '0' | '1' | '2' | '3'           // 是否展示(0 => 非总部中心；1 => 总部中心；2 => 总部中心和非总部中心；3 => BMS岗位)
    authority ?: string | boolean;            // 权限
    eventType ?: 'link'                       // 事件绑定
    children ?: any;                          // 子菜单

}

const siderList:Array<item> = [
    {
        title: '工作台',
        key: 'dashboard',
        iconType: 'compass',
        isShow: '0',
        authority: FUNC['工作台'],
        children: [
            {
                title: '工作台',
                key: 'dashboard_dashboard',
                isShow: '2',
                authority: true,
                list: [
                    {
                        title: 'CD工作台',
                        path: Routes.CD仪表盘.path,
                        authority: FUNC['CD工作台'],
                    },{
                        title: 'HGA工作台',
                        path: Routes.中心履约服务看板.path,
                        authority: FUNC['HGA工作台'],
                    },{
                        title: 'GB个人业绩',
                        path: Routes.GB个人工作台.path,
                        authority: FUNC['GB个人工作台'],
                    },{
                        title: 'GA个人工作台',
                        path: Routes.GA个人工作台.path,
                        authority: FUNC['GA个人工作台'],
                    },{
                        title: 'GB工作台',
                        path: Routes.GB仪表盘.path,
                        authority: FUNC['GB工作台'],
                    },{
                        title: 'GA工作台',
                        path: Routes.GA仪表盘.path,
                        authority: FUNC['GA工作台'],
                    },{
                        title: '预警日志',
                        path: Routes.预警日志.path,
                        authority: FUNC['预警日志'],
                    },{
                        title: '任务中心',
                        path: Routes.任务中心.link,
                        authority: true
                    },{
                        title: '消息中心',
                        path: Routes.消息中心.path,
                        authority: true
                    },
                ]
            }
        ]
    }, {
        title: '客户',
        key: 'customer',
        iconType: 'kehu',
        isShow: '0',
        authority: FUNC['客户'],
        children: [
            {
                title: '客户信息管理',
                key: 'customer_manage',
                isShow: '2',
                authority: true,
                list: [
                    {
                        title: '客户中心',
                        path: Routes.分配客户.link,
                        authority: FUNC['客户中心'],
                    },
                    {
                        title: '新建Leads',
                        path: Routes.新建客户.path,
                        authority: FUNC['新建Leads'],
                    },{
                        title: '批量导入Leads',
                        path: Routes.批量导入客户.path,
                        authority: FUNC['批量导入Leads'],
                    },{
                        title: '转中心记录',
                        path: Routes.分配记录.path,
                        authority: FUNC['转中心记录'],
                    },{
                        title: '跨中心Leads查询',
                        path: Routes.跨中心查询.path,
                        authority: FUNC['跨中心Leads查询'],
                    },{
                        title: 'RRP绑定查询',
                        path: Routes.rrp绑定查询.path,
                        authority: true,
                    },{
                        title: '客户搜索',
                        path: Routes.新客户中心.link,
                        authority: true,
                    }
                ]
            }
        ]
    },
    {
        title: '市场',
        key: 'market',
        iconType: 'shichang',
        isShow: '0',
        authority: FUNC['市场渠道'],
        children: [
            {
                title: '市场渠道管理',
                key: 'market_manage',
                isShow: '2',
                authority: true,
                list: [
                    {
                        title: '新建市场渠道',
                        path: Routes.编辑市场渠道.link,
                        authority: FUNC['新建市场渠道'],
                    },{
                        title: '渠道管理',
                        path: Routes.市场渠道列表.path,
                        authority: FUNC['渠道管理'],
                    },
                ]
            }
        ]
    }, {
        title: '活动',
        key: 'activity',
        iconType: 'huodong',
        isShow: '0',
        authority: FUNC['活动'],
        children: [
            {
                title: '活动管理',
                key: 'activity_manage',
                isShow: '2',
                authority: true,
                list: [
                    {
                        title: '活动列表',
                        path: Routes.活动列表.path,
                        authority: true,
                    },{
                        title: '新建活动',
                        path: Routes.编辑活动.link,
                        authority: true,
                    },
                ]
            }
        ]
    }, {
        title: '合同',
        key: 'contract',
        iconType: 'hetong',
        isShow: '0',
        authority: FUNC['合同'],
        children: [
            {
                title: '合同管理',
                key: 'contract_manage',
                isShow: '2',
                authority: FUNC['合同管理'],
                list: [
                    {
                        title: '合同列表',
                        path: Routes.合同管理列表.path,
                        authority: FUNC['合同列表'],
                    },{
                        title: '线上订单交易明细',
                        path: Routes.线上订单交易明细.path,
                        authority: FUNC['线上订单交易明细'],
                    },
                ]
            }, {
                title: '收付款',
                key: 'contract_pay',
                isShow: '2',
                authority: FUNC['收付款'],
                list: [
                    // {
                    //     title: '收款管理',
                    //     path: Routes.合同收款管理合同.path,
                    //     authority: FUNC['收款管理'],
                    // },
                    {
                        title: '收款管理',
                        path: Routes.合同收款管理.link,
                        authority: FUNC['收款管理'],
                    },
                    // {
                    //     title: '付款管理',
                    //     path: Routes.合同付款管理合同.path,
                    //     authority: FUNC['付款管理'],
                    // },
                    {
                        title: '付款管理',
                        path: Routes.合同付款管理.link,
                        authority: FUNC['付款管理'],
                    },
                ]
            },  {
                title: '合同操作',
                key: 'contract_operation',
                isShow: '2',
                authority: FUNC['合同操作'],
                list: [
                    {
                        title: '过期合同确认收入',
                        path: Routes.合同操作列表过期确认收入.path,
                        authority: FUNC['过期合同收入确认'],
                    },{
                        title: '转中心申请',
                        path: Routes.合同操作列表转中心.path,
                        authority: FUNC['转中心申请'],
                    },{
                        title: '退课申请',
                        path: Routes.合同操作列表退课.path,
                        authority: FUNC['退课申请'],
                    },{
                        title: '改包申请',
                        path: Routes.合同操作列表改包.path,
                        authority: FUNC['改包申请'],
                    },{
                        title: '合同延期申请',
                        path: Routes.合同操作列表延期.path,
                        authority: FUNC['合同延期申请'],
                    },{
                        title: '请假次数修改申请',
                        path: Routes.合同操作列表修改请假次数.path,
                        authority: FUNC['请假次数修改申请'],
                    },{
                        title: '赠课申请',
                        path: Routes.合同操作列表赠课.path,
                        authority: FUNC['赠课申请'],
                    },{
                        title: '合同调整申请',
                        path: Routes.合同调整申请.path,
                        authority: FUNC['合同调整申请'],
                    },{
                        title: '部分退费申请',
                        path: Routes.部分退费申请.path,
                        authority: FUNC['部分退费申请'],
                    },
                ]
            }
        ]
    }, {
        title: '教学',
        key: 'teach',
        iconType: 'jiaoxue',
        isShow: '2',
        authority: FUNC['教学'],
        children: [
            {
                title: '课程表',
                key: 'teach_schedule',
                isShow: '0',
                authority: FUNC['课程表'],
                list: [
                    {
                        title: '课程表',
                        path: Routes.课程表.link,
                        isShow: '0',
                        authority: FUNC['课程表'],
                    },
                    {
                        title: '随堂反馈2.0',
                        path: Routes.随堂反馈新.path,
                        authority: FUNC['随堂反馈2.0'],
                        isShow: '0',
                    },
                ]
            }, {
                title: '申请管理',
                key: 'teach_apply',
                isShow: '2',
                authority: FUNC['申请管理'],
                list: [
                    {
                        title: '试听申请',
                        path: Routes.试听申请.path,
                        authority: FUNC['试听申请'],
                    },{
                        title: '请假申请',
                        path: Routes.请假申请.path,
                        authority: FUNC['请假申请'],
                    },{
                        title: 'Gym Guard',
                        path: Routes.gymguard.path,
                        authority: FUNC['GYM Guard'],
                    },
                ]
            }, {
                title: '随堂反馈',
                key: 'teach_feedback',
                isShow: '0',
                authority: FUNC['随堂反馈'],
                list: [
                    {
                        title: '随堂反馈管理2.0',
                        path: Routes.随堂反馈管理新.path,
                        authority: FUNC['随堂反馈管理2.0'],
                        isShow: '0',
                    },
                    {
                        title: '随堂反馈数据统计',
                        path: Routes.随堂反馈数据统计.path,
                        authority: FUNC['随堂反馈数据统计'],
                        isShow: '0',
                    },{
                        title: '随堂反馈管理(Art)',
                        path: Routes.随堂反馈管理.path,
                        authority: FUNC['随堂反馈管理(Art)'],
                        isShow: '0',
                    },
                ]
            }, {
                title: '教学管理',
                key: 'teach_manage',
                isShow: '2',
                authority: FUNC['教学管理'],
                list: [
                    {
                        title: '到访测评',
                        path: Routes.测评报告.path,
                        authority: FUNC['到访测评'],
                        isShow: '0',
                    },{
                        title: '点评库设置(Art)',
                        path: Routes.点评库管理.path,
                        authority: FUNC['点评库设置(Art)'],
                        isShow: '1',
                    },{
                        title: '点评库设置2.0',
                        path: Routes.点评库管理新版.path,
                        authority: FUNC['点评库设置2.0'],
                        isShow: '1',
                    },{
                        title: '课程主题设置(Art)',
                        path: Routes.中心主题.path,
                        authority: FUNC['课程主题设置(Art)'],
                        isShow: '1',
                    },{
                        title: '课程主题设置2.0',
                        path: Routes.中心主题新.path,
                        authority: FUNC['课程主题设置2.0'],
                        isShow: '1',
                    },
                    {
                        title: '系统消息推送',
                        path: Routes.系统消息推送.path,
                        authority: FUNC['系统消息推送'],
                        isShow: '1',
                    },{
                        title: '到访测评设置',
                        path: Routes.测评库.path,
                        authority: FUNC['到访测评设置'],
                        isShow: '1',
                    },{
                        title: '中心开放约课/等位设置',
                        path: Routes.中心开放约课等位.path,
                        authority: FUNC['到访测评设置'],
                        isShow: '1',
                    },{
                        title: '月度回顾管理',
                        path: Routes.月度回顾管理.path,
                        authority: FUNC['月度回顾管理'],
                        isShow: '0',
                    },{
                        title: '升班报告管理',
                        path: Routes.升班报告管理.path,
                        authority: FUNC['升班报告'],
                        isShow: '0',
                    },{
                        title: '八大领域管理设置',
                        path: Routes.八大领域管理设置.path,
                        authority: FUNC['八大领域管理设置'],
                        isShow: '1'
                    },
                    // Todo R店课程配置
                    {
                        title: 'R店主题设置',
                        path: Routes.R店主题设置.path,
                        authority: FUNC['R店主题设置'],
                        isShow: '1'
                    },{
                        title: 'R店主题资源库',
                        path: Routes.R店主题资源库.path,
                        authority: FUNC['R店主题资源库'],
                        isShow: '1'
                    },{
                        title: 'App课程展示',
                        path: Routes.App课程展示.path,
                        authority: FUNC['app课程展示-列表'],
                        isShow: '1'
                    }
                ]
            },
        ]
    },{
        title: '多中心报表',
        key: 'multipleReport',
        iconType: 'baobiaozhongxin',
        isShow: '0',
        authority: FUNC['多中心报表'],
        children: [
            {
                title: '市场销售多中心报表',
                key: 'multipleReport_multipleReport',
                isShow: '2',
                authority: true,
                list: [
                    {
                        title: '一键BR导出',
                        authority: FUNC['一键BR导出'],
                        handleLink: 'brExport'
                    },{
                        title: '耗课统计表',
                        authority: FUNC['耗课统计表'],
                        handleLink: 'consumeCourse'
                    },{
                        title: '工作量统计表',
                        authority: FUNC['工作量统计表'],
                        handleLink: 'workload'
                    },{
                        title: '后端产出跟进表',
                        authority: FUNC['后端产出跟进表'],
                        handleLink: 'backend'
                    },{
                        title: '市场销售跟进表',
                        authority: FUNC['市场销售跟进表'],
                        handleLink: 'marketSales'
                    },{
                        title: '市场销售统计表',
                        authority: FUNC['市场销售统计表'],
                        handleLink: 'marketingStatistics'
                    }
                ]
            }
        ]
    },{
        title: '单中心报表',
        key: 'singleReport',
        iconType: 'baobiaoshangwu',
        isShow: '2',
        authority: FUNC['绩效中心'],
        children: [
            {
                title: '其他',
                key: 'singleReport_other',
                isShow: '2',
                authority: FUNC['其他'],
                list: [
                    {
                        title: '下载已审批导出报表',
                        authority: FUNC['多中心导出下载'],
                        path: Routes.多中心导出下载.path,
                        isShow: '0',
                    }, {
                        title: '多中心导出查看',
                        path: Routes.多中心导出查看.path,
                        authority: FUNC['多中心导出查看'],
                        isShow: '1',
                    },{
                        title: '审批报表导出申请',
                        authority: FUNC['审批报表导出申请'],
                        isShow: '0',
                        path: Routes.审批报表导出申请.path
                    },{
                        title: '查看审批报表导出申请进度',
                        authority: FUNC['查看报表导出审批进度'],
                        isShow: '0',
                        path: Routes.查看报表导出审批进度.path
                    },
                ]
            },{
                title: '业绩类报表',
                key: 'singleReport_performance',
                isShow: '0',
                authority: FUNC['业绩类报表'],
                list: [
                    {
                        title: '中心业绩',
                        authority: FUNC['中心业绩'],
                        path: Routes.中心业绩.path,
                    },{
                        title: '合同到期提醒',
                        authority: FUNC['合同到期提醒'],
                        path: Routes.合同到期提醒.path,
                    },
                ]
            },{
                title: '市场类报表',
                key: 'singleReport_market',
                isShow: '0',
                authority: FUNC['市场类报表'],
                list: [
                    {
                        title: '渠道业绩',
                        authority: FUNC['渠道业绩'],
                        path: Routes.市场渠道业绩.path,
                    },{
                        title: '渠道业绩(销售向)',
                        authority: FUNC['渠道业绩(销售向)'],
                        path: Routes.市场渠道业绩销售向.path,
                    },{
                        title: '市场名单明细',
                        authority: FUNC['市场名单明细'],
                        path: Routes.市场名单明细.path,
                    },{
                        title: '市场名单明细(销售向)',
                        authority: FUNC['市场名单明细（销售向）'],
                        path: Routes.市场名单明细销售向.path,
                    },{
                        title: '渠道+出现方式业绩',
                        authority: FUNC['渠道+出现方式业绩'],
                        path: Routes.渠道出现方式业绩.path,
                    },{
                        title: '渠道+出现方式业绩(销售向)',
                        authority: FUNC['渠道+出现方式业绩(销售向)'],
                        path: Routes.渠道出现方式业绩销售向.path,
                    },{
                        title: '到访表',
                        authority: FUNC['到访表'],
                        path: Routes.到访表.path,
                    }
                ]
            }, {
                title: '服务类报表',
                key: 'singleReport_service',
                isShow: '0',
                authority: FUNC['服务类报表'],
                list: [
                    {
                        title: '任务跟进记录',
                        authority: FUNC['任务跟进记录'],
                        path: Routes.任务跟进记录.path,
                    },{
                        title: '耗课统计',
                        authority: FUNC['服务类报表'],
                        path: Routes.耗课统计.path,
                    },{
                        title: '会员连续未到提醒',
                        authority: FUNC['会员连续未到提醒'],
                        path: Routes.会员连续未到提醒.path,
                    },{
                        title: '会员排课耗课统计',
                        authority: FUNC['会员排课耗课统计'],
                        path: Routes.会员排课耗课统计.path,
                    },{
                        title: '即将升班宝宝明细',
                        authority: FUNC['即将升班宝宝明细'],
                        path: Routes.会员升班提醒.path,
                    },{
                        title: '出席报告',
                        authority: FUNC['出席报告'],
                        path: Routes.出席报告.path,
                    },{
                        title: '排课耗课统计',
                        authority: FUNC['排课耗课统计'],
                        path: Routes.排课耗课统计.path,
                    },{
                        title: '请假明细',
                        authority: FUNC['请假明细'],
                        path: Routes.请假会员名单.path,
                    },{
                        title: '出席会员上课明细',
                        authority: FUNC['出席会员上课明细'],
                        path: Routes.出席会员上课明细.path,
                    },{
                        title: '活动耗课统计/明细',
                        authority: FUNC['活动耗课统计/明细'],
                        path: Routes.活动耗课表.path,
                    },{
                        title: '换/删课明细',
                        authority: FUNC['换/删课明细'],
                        path: Routes.换课删课明细记录.path,
                    },{
                        title: '特殊操作日志记录',
                        authority: FUNC['特殊操作日志记录'],
                        path: Routes.特殊操作日志记录.path,
                    }
                ]
            }, {
                title: '财务类报表',
                key: 'singleReport_finance',
                isShow: '0',
                authority: FUNC['财务类报表'],
                list: [
                    {
                        title: '消耗负债(按合同)',
                        authority: FUNC['消耗负债(按合同)'],
                        path: Routes.消耗负债.path,
                    },
                    {
                        title: '日常业绩统计',
                        authority: FUNC['日常业绩统计'],
                        path: Routes.日常业绩统计.path,
                    },{
                        title: '中心收入统计',
                        authority: FUNC['中心收入统计'],
                        path: Routes.中心收入统计.path,
                    },{
                        title: '期初数据修正表',
                        authority: FUNC['期初数据对照'],
                        path: Routes.期初数据修正表.path,
                    },{
                        title: '收付款明细',
                        authority: FUNC['收付款明细'],
                        path: Routes.收付款明细.path,
                    },
                ]
            }, {
                title: '中心订货额度',
                key: 'singleReport_order',
                isShow: '2',
                authority: FUNC['中心订货额度'],
                list: [
                    {
                        title: '订货额度',
                        authority: FUNC['订货额度'],
                        isShow: '0',
                        path: Routes.订货额度.path,
                    }, {
                        title: '对账单',
                        isShow: '0',
                        authority: FUNC['对账单'],
                        path: Routes.对账单.path,
                    },{
                        title: '月度AR账单',
                        authority: FUNC['月度AR账单'],
                        isShow: '0',
                        path: Routes.月度AR账单.path,
                    },{
                        title: '政策管理',
                        authority: FUNC['政策管理(查看)'],
                        path: Routes.政策管理.path,
                    },
                ]
            }, {
                title: '中心综合评价',
                key: 'singleReport_assess',
                isShow: '0',
                authority: FUNC['中心综合评价'],
                list: [
                    {
                        title: '星级评分',
                        authority: FUNC['星级评分'],
                        path: Routes.星级查询.path,
                    },
                ]
            },
        ]
    },{
        title: '设置',
        key: 'setting',
        iconType: 'shezhi',
        isShow: '2',
        authority: FUNC['设置'],
        children: [
            {
                title: '用户管理',
                key: 'setting_user',
                isShow: '2',
                authority: FUNC['用户管理'],
                list: [
                    {
                        title: '特殊角色设置',
                        authority: FUNC['特殊角色设置'],
                        path: Routes.中心角色管理.path
                    },{
                        title: '默认角色设置',
                        authority: FUNC['默认角色设置'],
                        isShow: '1',
                        path: Routes.默认角色管理.path
                    },{
                        title: '账号设置',
                        authority: FUNC['账号设置'],
                        path: Routes.员工信息管理.path
                    },{
                        title: '员工账号列表',
                        authority: FUNC['员工账号列表'],
                        path: Routes.员工数据管理.path
                    },{
                        title: '自定义角色设置',
                        authority: FUNC['自定义角色设置'],
                        path: Routes.自定义角色管理.path,
                        isShow: '1',
                    },{
                        title: '账号变更审批',
                        authority: FUNC['账号变更审批'],
                        isShow: '0',
                        path: Routes.员工审批管理.path
                    },
                    {
                        title: '账号绑定',
                        authority: FUNC['账号绑定'],
                        isShow: '2',
                        path: Routes.账号绑定.path
                    },
                ]
            }, {
                title: '运营管理',
                key: 'setting_operation',
                isShow: '2',
                authority: FUNC['运营管理'],
                list: [
                    {
                        title: '总部课程包设置',
                        authority: FUNC['总部课程包设置'],
                        isShow: '1',
                        path: Routes.总部课程包管理.path
                    },{
                        title: '中心课程包设置',
                        authority: FUNC['中心课程包设置'],
                        path: Routes.中心课程包管理.path
                    },{
                        title: '中心管理',
                        authority: FUNC['中心管理'],
                        path: Routes.中心管理.path
                    },{
                        title: '节假日设置',
                        authority: FUNC['节假日设置'],
                        path: Routes.节假日.path
                    },{
                        title: '教室设置',
                        authority: FUNC['教室设置'],
                        path: Routes.教室管理.path
                    },{
                        title: 'PR产品设置',
                        authority: FUNC['PR产品设置'],
                        path: Routes.产品管理.path
                    },{
                        title: '课程分类设置',
                        authority: FUNC['课程分类设置'],
                        path: Routes.课程分类.path
                    },{
                        title: 'Promotor设置',
                        authority: FUNC['Promotor设置'],
                        path: Routes.promotor管理.path
                    },{
                        title: '课程资料设置',
                        authority: FUNC['课程资料设置'],
                        path: Routes.课程资料.path
                    },{
                        title: '销售指标设置',
                        authority: FUNC['销售指标设置'],
                        path: Routes.中心业绩设置列表.path
                    },{
                        title: '约课指标设置',
                        authority: FUNC['约课指标设置'],
                        path: Routes.业绩指标.path
                    },{
                        title: 'RRP模板管理',
                        authority: true,
                        isShow: '1',
                        path: Routes.RRP课程类型.path
                    },{
                        title: 'Net-in Leads设置',
                        authority: FUNC['Net-in Leads设置'],
                        isShow: '0',
                        path: Routes.NetInLeads.path
                    },{
                        title: 'TMK呼叫中心设置',
                        authority: FUNC['TMK呼叫中心设置'],
                        isShow: '1',
                        path: Routes.TMK呼叫中心设置.path
                    },{
                        title: '激活码管理',
                        authority: FUNC['激活码管理'],
                        isShow: '1',
                        path: Routes.激活码管理列表.path
                    },{
                        title: '试点中心设置',
                        authority: FUNC['试点中心设置'],
                        isShow: '1',
                        path: Routes.试点中心设置.path
                    },{
                        title: '非活跃会员不提醒设置',
                        authority: FUNC['非活跃会员不提醒设置'],
                        isShow: '0',
                        path: Routes.非活跃会员提醒设置.path
                    },{
                        title: '合同批量导入',
                        authority: true,
                        isShow: '1',
                        path: Routes.合同批量导入.path
                    }
                ]
            },{
                title: '财务管理',
                key: 'setting_finance',
                authority: true,
                list: [
                    {
                        title: '过期合同确认权限设置',
                        authority:true,
                        isShow: '3',
                        path: Routes.设置财务管理.path
                    },{
                        title: '中心费率设置',
                        authority: FUNC['中心费率设置'],
                        isShow: '1',
                        path: Routes.中心费率设置.path
                    }
                ]
            }, {
                title: '电子合同管理',
                key: 'setting_electronic',
                isShow: '1',
                authority: FUNC['电子合同管理'],
                list: [
                    {
                        title: '电子合同用印设置',
                        authority:FUNC['电子合同用印设置'],
                        path: Routes.电子合同管理.path
                    },
                ]
            },
        ]
    },{
        title: '云语音',
        key: 'telephone',
        iconType: 'yunyuyin',
        isShow: '0',
        authority: FUNC['云语音'],
        children: [
            {
                title: '云语音',
                key: 'telephone_telephone',
                isShow: '2',
                authority: FUNC['云语音'],
                list: [
                    {
                        title: '坐席分配',
                        authority: FUNC['坐席分配'],
                        path:  Routes.坐席分配.path
                    },{
                        title: '外呼明细',
                        authority: FUNC['外呼明细'],
                        path:  Routes.云语音通话数据统计.path
                    },{
                        title: '外呼统计(按坐席)',
                        authority: FUNC['外呼统计(按坐席)'],
                        path:  Routes.坐席通话详情统计.path
                    },{
                        title: '外呼统计(按坐席组)',
                        authority: FUNC['外呼统计(按坐席组)'],
                        path:  Routes.技能组详情统计.path
                    },{
                        title: '账户余额',
                        authority: FUNC['账户余额'],
                        path:  Routes.账户余额.path
                    },{
                        title: '呼入明细',
                        authority: FUNC['呼入明细'],
                        path:  Routes.客户回拨统计.path
                    },{
                        title: 'TMK转入Leads明细',
                        authority: FUNC['TMK转入Leads明细'],
                        path:  Routes.TMK转Leads.path
                    },{
                        title: '市场名单明细(仅TMK)',
                        authority: FUNC['市场名单明细(仅TMK)'],
                        path:  Routes.云语音市场类报表.path
                    },{
                        title: '任务跟进明细(含云语音)',
                        authority: FUNC['任务跟进明细(含云语音)'],
                        path:  Routes.云语音服务类报表.path
                    },
                ]
            }
        ]
    },{
        title: '合同调整',
        key: 'contractRevise',
        iconType: 'hetong',
        isShow: '1',
        authority: FUNC['合同调整'],
        children: [
            {
                title: '合同调整',
                key: 'contractRevise_contractRevise',
                isShow: '2',
                authority: true,
                list: [
                    {
                        title: 'POP合同调整审批',
                        authority: FUNC['POP合同调整审批'],
                        path:  Routes.合同调整POP列表.path
                    },{
                        title: '研发合同调整审批',
                        authority: FUNC['研发合同调整审批'],
                        path:  Routes.合同调整研发列表.path
                    },{
                        title: '总部财务审批',
                        authority: FUNC['总部财务审批'],
                        path:  Routes.总部审批页面.path
                    },{
                        title: '部分退费-总部财务审批',
                        authority: FUNC['部分退费-总部财务审批'],
                        path:  Routes.部分退费列表.path
                    },
                ]
            }
        ]
    },{
        title: '展业',
        key: 'jump',
        iconType: '-kehuguanxiguanli',
        isShow: '2',
        authority: true,
        children: [],
        eventType: 'link'
    },
];


export {siderList}
