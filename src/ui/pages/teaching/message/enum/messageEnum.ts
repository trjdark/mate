/**
 * desc: 消息配置枚举
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2020/8/5
 * Time: 上午9:28
 */
export const noticeTemplateType = {
    入学须知: '193001',
    首课提醒: '193002',
    首课再次提醒: '193003',
    课前提醒: '193004',
    课前再次提醒: '193005',
    非活跃会员上课提醒: '193006',
    随堂反馈提醒: '193007',
    月度回顾: '193008',
    阶段反馈: '193009',
    升班反馈: '193010',
    升班课程推荐: '193011',
    旷课课程补位推荐: '193012',
    周中空闲课程推荐: '193013',
    单一课程推荐: '193014',
    旷课提醒: '193015',
    启蒙APP约课成功: '193016',
    启蒙APP请假提醒: '193017',
    启蒙换课成功提醒:"193018",
    启蒙排队成功提醒:"193019" ,
    启蒙排队未成功提醒:"193020",
    启蒙签到提醒:"193021",
    启蒙智能课程提醒:"193022",
};

// 渲染配置
export const noticeTemplateConfig = [
    {
        id: '0',
        component: [
            {
                id: '0-1',
                label: '入学须知：用户注册后打开APP',
                option: [{name:'2个小时', value: '2'}],
                checkboxName: 'isNoticeEnterSchool',
                formName: 'isOne',
                type: '入学须知',
            },
            {
                id: '0-2',
                label: '旷课提醒：',
                option: [{name:'1天', value: '1'}],
                checkboxName: 'absentCoverageRecommend',
                formName: 'isTwo',
                type: '旷课提醒',
            },
        ],

    }, {
        id: '1',
        component: [
            {
                id: '1-1',
                label: '首课提醒：开课前1天',
                option: [{name:'2个小时', value: '2'}],
                checkboxName: 'firstClassEarlyDay',
                formName: 'isOne',
                type: '首课提醒',
            },
            {
                id: '1-2',
                label: '首课再次提醒：开课前1个小时',
                option: [{name:'1天', value: '1'}],
                checkboxName: 'firstClassEarlyHour',
                formName: 'isTwo',
                type: '首课再次提醒',
            },
        ],

    }, {
        id: '2',
        component: [
            {
                id: '2-1',
                label: '课前提醒：开课前1天',
                option: [{name:'2个小时', value: '2'}],
                checkboxName: 'beforeClassEarlyDay',
                formName: 'isOne',
                type: '课前提醒',
            },
            {
                id: '2-2',
                label: '课前再次提醒：开课前2个小时',
                option: [{name:'1天', value: '1'}],
                checkboxName: 'beforeClassEarlyHour',
                formName: 'isTwo',
                type: '课前再次提醒',
            },
        ],
    }, {
        id: '3',
        component: [
            {
                id: '3-1',
                label: '非活跃会员上课提醒',
                option: [{name:'2个小时', value: '2'}],
                checkboxName: 'inactiveLeadsClassEarly',
                formName: 'isThree',
                type: '非活跃会员上课提醒',
            },
            {
                id: '3-2',
                label: '启蒙APP约课成功',
                option: [{name:'2个小时', value: '2'}],
                checkboxName: 'bookLessonNoticeEnabled',
                formName: 'isThree',
                type: '启蒙APP约课成功',
            },
        ],
    }, {
        id: '4',
        component: [
            {
                id: '4-1',
                label: '随堂反馈提醒：Ins点评后',
                option: [{name:'2个小时', value: '2'}],
                checkboxName: 'classFeedbackAfterHour',
                formName: 'isFour',
                type: '随堂反馈提醒',
            },{
                id: '4-2',
                label: '启蒙APP请假提醒',
                option: [{name:'2个小时', value: '2'}],
                checkboxName: 'leaveNoticeEnabled',
                formName: 'isFour',
                type: '启蒙APP请假提醒',
            },
        ],
    }, {
        id: '5',
        component: [
            {
                id: '5-1',
                label: '月度回顾',
                option: [{name:'2个小时', value: '2'}],
                checkboxName: 'monthFeedback',
                formName: 'isFour',
                type: '月度回顾',
            },
            {
                id: '5-2',
                label: '启蒙换课成功提醒',
                option: [{name:'2个小时', value: '2'}],
                checkboxName: 'exchangeLessonEnabled',
                formName: 'isFour',
                type: '启蒙换课成功提醒',
            },
        ],
    },  {
        id: '6',
        component: [
            {
                id: '6-1',
                label: '阶段反馈',
                option: [{name:'2个小时', value: '2'}],
                checkboxName: 'stageFeedback',
                formName: 'isFour',
                type: '阶段反馈',
            },
            {
                id: '6-2',
                label: '启蒙签到提醒',
                option: [{name:'2个小时', value: '2'}],
                checkboxName: 'signInEnabled',
                formName: 'isFour',
                type: '启蒙签到提醒',
            },
        ],
    },{
        id: '7',
        component: [
            {
                id: '7-1',
                label: '启蒙排队成功提醒',
                option: [{name:'2个小时', value: '2'}],
                checkboxName: 'fillVacancyEnabled',
                formName: 'isFour',
                type: '启蒙排队成功提醒',
            },
            {
                id: '7-2',
                label: '启蒙排队未成功提醒',
                option: [{name:'2个小时', value: '2'}],
                checkboxName: 'abandonWaitingEnabled',
                formName: 'isFour',
                type: '启蒙排队未成功提醒',
            },
        ],
    },{
        id: '8',
        component: [
            {
                id: '8-1',
                label: '升班提醒',
                option: [{name:'2个小时', value: '2'}],
                checkboxName: 'nextGradeFeedback',
                formName: 'isFour',
                type: '升班反馈',
            },
            {
                id: '8-2',
                label: '启蒙智能课程提醒',
                option: [{name:'2个小时', value: '2'}],
                checkboxName: 'intelligentCourseReminder',
                formName: 'isFour',
                type: '启蒙智能课程提醒',
            },
        ],
    },
];
