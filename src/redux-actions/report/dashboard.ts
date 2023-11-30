/**
 * desc: dashboard请求方法
 * User: Lyon
 * Date: 2019/3/21
 * Time: 11:50
 */

import {Fetch} from "@/service/fetch";
import {reportApi} from "@/api/reportApi";
import { CustomerApi } from "@/api/customerApi";

/**
 * 获取GB个人业绩数据
 * @returns {any}
 */
export const getGbAchievementNewData = (params: any): Promise<any> => {
    const param = {
        url: reportApi.DashboardGB关键指标,
        data: params
    };
    return Fetch.post(param)
        .then((res: any) => {
            return Promise.resolve(res)
        });
};

/**
 * 获取GB已领取待联络leads明细查询
 * @returns {any}
 */
export const getGbReceiveLeadsData = (params: any): Promise<any> => {
    const param = {
        url: reportApi.GB工作台已领取待联络leads明细,
        data: params
    };
    return Fetch.post(param)
        .then((res: any) => {
            return Promise.resolve(res)
        });
};

/**
 * 获取GB工作台已联络未到访leads明细
 * @returns {any}
 */
export const getGbContactLeadsData = (params: any): Promise<any> => {
    const param = {
        url: reportApi.GB工作台已联络未到访leads明细,
        data: params
    };
    return Fetch.post(param)
        .then((res: any) => {
            return Promise.resolve(res)
        });
};

/*获取GB个人业绩数据Old*/
export const getGbAchievementData = (data) => {
    const params = {
        url: reportApi.DashboardGB个人业绩,
        data,
    };
    return Fetch.post(params).then(res => {
        const {
            todayStayComplete, threeTodayComplete, overdueTask, unclaimedLeadsNum, appLeadsNum, oppLeadsNum,
            visitRate, stayContactLeadsNum, newMemberNum, memberRate, singBillNum, totalSales, monthAchievementNum,
            targetAmount, completionRate, newLeadsNum, effectiveLeadsNum, promiseLeadsNum, visitLeadsNum,
            singningLeadsNum, netInAmount, callInAmount, walkInAmount, callOutAmount, memberChannelAmount,
            callInNum, netInNum, callOutNum, memberChannelNum, todayTomorrowVisitNum, lastSyncDatetime,
        } = res;
        return {
            todayStayComplete,          // 今日待完成
            threeTodayComplete,         // 近3日完成
            overdueTask,                // 已过期任务
            unclaimedLeadsNum,          // 待领取名单
            stayContactLeadsNum,        // 今日待联系
            visitRate,                  // 到访-诺访转化率
            appLeadsNum,
            todayTomorrowVisitNum,      // 今明到访
            oppLeadsNum,                // 本月到访量
            newMemberNum,
            memberRate,                 // 会员-到访转化率
            singBillNum,                // 本月签单数
            totalSales,                 // 本月总销售额
            monthAchievementNum,        // 本月业绩
            targetAmount,               // 月目标销售额
            completionRate,             // 当月业务完成率
            lastSyncDatetime,           // 数据最后同步时间
            leadsConventRate: [         // leads转化率数据
                {
                    name: "Leads",
                    value: newLeadsNum,
                },
                {
                    name: "有效Leads",
                    value: effectiveLeadsNum,
                },
                {
                    name: "诺访",
                    value: promiseLeadsNum,
                },
                {
                    name: "到访",
                    value: visitLeadsNum
                },
                {
                    name: "签约",
                    value: singningLeadsNum
                },
            ],
            channelPercentage: [    // 渠道销售渠道占比
                {
                    name: "Call-in",
                    value: callInAmount,
                },
                {
                    name: "Call-out",
                    value: callOutAmount,
                },
                {
                    name: "Net-in",
                    value: netInAmount,
                },
                {
                    name: "Walk-in",
                    value: walkInAmount,
                },
                {
                    name: "会员推荐",
                    value: memberChannelAmount,
                }
            ],
            channelGuide: {
                title: '本月签单金额',
                text: totalSales,
            },
            channelVisit: [     // 渠道到访率
                {
                    name: "Call-in",
                    value:  [callInNum, callOutNum, netInNum, memberChannelNum].some((item) => item !== 0)
                        ? callInNum / (callInNum + callOutNum + netInNum + memberChannelNum) * 100
                        : 0,
                },
                {
                    name: "Call-out",
                    value: [callInNum, callOutNum, netInNum, memberChannelNum].some((item) => item !== 0)
                        ? callOutNum / (callInNum + callOutNum + netInNum + memberChannelNum) * 100
                        : 0,
                },
                {
                    name: "Net-in",
                    value: [callInNum, callOutNum, netInNum, memberChannelNum].some((item) => item !== 0)
                        ? netInNum / (callInNum + callOutNum + netInNum + memberChannelNum) * 100
                        : 0,
                },
                {
                    name: "会员推荐",
                    value: [callInNum, callOutNum, netInNum, memberChannelNum].some((item) => item !== 0)
                        ? memberChannelNum / (callInNum + callOutNum + netInNum + memberChannelNum) * 100
                        : 0,
                }
            ],
        }
    })
};

/*获取中心履约服务数据*/
export const getCenterServicesData = (data) => {
    const params = {
        url: reportApi.Dashboard中心履约,
        data,
    };

    return Fetch.post(params).then(res => {
        const {
            renewalMemberNum, renewalMemberSum, memberIntroduceNum, memberIntroduceSum, noGaNum, waitingRenewalMember,
            validMemberNum, twiceAbsentTimes, waitingScheduleMember, upgradeWithinTwoWeeks, sumConsumePrice,
            courseConsumePrice, activityConsumePrice, otherConsumePrice, sumConsumeNum, courseConsumeNum,
            activityConsumeNum, otherConsumeNum, zeroSixNum, sixTenNum, tenSixteenNum, sixteenTwentytwoNum,
            twentytwoTwentyeightNum, twentyeightThirdsixNum, thirdsixFortyeightNum, fortyeightSixtyNum,
            sixtyFormoreNum, avgClassCapacity, avgWeekconsume, memberMonthActityRate, attendRate, leaveRate, absentRate, lastSyncDatetime,
        } = res;

        return {
            renewalMemberNum,           // 本月续约会员数
            renewalMemberSum,           // 本月续约会员金额,
            memberIntroduceNum,         // 本月会介会员数,
            memberIntroduceSum,         // 本月会介会员金额
            noGaNum,                    // 无ga会员数量
            waitingRenewalMember,       // 待续约会员数
            validMemberNum,             // 会员数
            waitingScheduleMember,      // 待排课宝宝
            upgradeWithinTwoWeeks,      // 两周内升班
            twiceAbsentTimes,           // 连续未到两次
            avgClassCapacity,           // 平均班容
            avgWeekconsume,             // 平均周耗课
            memberMonthActityRate,      // 会员月活跃率
            attendRate,                 // 出席率
            leaveRate,                  // 请假率
            absentRate,                 // 旷课率
            consumeAmount: [            // 会员耗课金额
                {
                    name: "课程耗课金额",
                    value: courseConsumePrice,
                },
                {
                    name: "活动耗课金额",
                    value: activityConsumePrice,
                },
                {
                    name: "其他耗课金额",
                    value: otherConsumePrice,
                },
            ],
            consumeAmountGuide: {
                title: '本月耗课金额',
                text: sumConsumePrice,
            },
            consume: [                  // 会员耗课数
                {
                    name: "课程耗课",
                    value: courseConsumeNum,
                },
                {
                    name: "活动耗课",
                    value: activityConsumeNum,
                },
                {
                    name: "其他耗课",
                    value: otherConsumeNum,
                },
            ],
            consumeGuide: {
                title: '本月耗课数',
                text: sumConsumeNum,
            },
            monthAge: [                 // 会员月龄数据
                {
                    name: '0-6个月',
                    value: zeroSixNum,
                },
                {
                    name: '6-10个月',
                    value: sixTenNum,
                },
                {
                    name: '10-16个月',
                    value: tenSixteenNum,
                },
                {
                    name: '16-22个月',
                    value: sixteenTwentytwoNum,
                },
                {
                    name: '22-28个月',
                    value: twentytwoTwentyeightNum,
                },
                {
                    name: '28-36个月',
                    value: twentyeightThirdsixNum,
                },
                {
                    name: '3岁-4岁',
                    value: thirdsixFortyeightNum,
                },
                {
                    name: '4岁-5岁',
                    value: fortyeightSixtyNum,
                },
                {
                    name: '5岁以上',
                    value: sixtyFormoreNum,
                }
            ],
            lastSyncDatetime,           // 数据最后同步时间
        };
    });
};

/*获取GA个人业绩数据*/
export const getGaAchievementData = (data) => {
    const params = {
        url: reportApi.DashBoardGA个人业绩,
        data,
    };
    return Fetch.post(params).then(res => {
        const {
            renewalMember, renewalAmount, memberIntroduceLeads, memberIntroduceContractNum, memberIntroduceContractAmount,
            waitingRenewalMember, newMember, oldMember, twoWeekUnopenedCourse, waitingScheduleMember, upgradeWithinTwoWeeks,
            twoNotArrived, courseConsumeNum, activityConsumeNum, otherConsumeNum, courseConsumeAmount, activityConsumeAmount,
            otherConsumeAmount, totalAmount, totalNum, avgWeekCourseRate, alreadyRate, truantRate, leaveRate, zeroSixNum,
            sixTenNum, tenSixteenNum, sixteenTwentytwoNum, lastSyncDatetime, twentytwoTwentyeightNum, twentyeightThirdsixNum,
            thirdsixFortyeightNum, fortyeightSixtyNum, sixtyFormoreNum,
        } = res;
        return {
            renewalMember,                      // 本月续约会员数
            renewalAmount,                      // 本月续约金额
            memberIntroduceLeads,               // 本月会员推荐leads数量
            memberIntroduceContractNum,         // 本月会员推荐合同数量
            memberIntroduceContractAmount,      // 本月会员推荐合同金额
            lastSyncDatetime,                   // 数据同步时间
            waitingRenewalMember,               // 待续会员数
            newMember,                          // 新会员
            oldMember,                          // 老会员
            twoWeekUnopenedCourse,              // 两周未开课
            waitingScheduleMember,              // 待排课宝宝
            upgradeWithinTwoWeeks,              // 两周内升班
            twoNotArrived,                      // 连续未到两次
            totalNum,                           // 本月耗课数
            totalAmount,                        // 本月耗课金额
            avgWeekCourseRate,                  // 平均周耗课
            alreadyRate,                        // 出席率
            truantRate,                         // 旷课率
            leaveRate,                          // 请假率
            consume: [                          // 会员耗课金额
                {
                    name: "课程耗课",
                    value: courseConsumeNum,
                },
                {
                    name: "活动耗课",
                    value: activityConsumeNum,
                },
                {
                    name: "其他耗课",
                    value: otherConsumeNum
                },
            ],
            consumeAmount: [                    // 会员耗课金额分布
                {
                    name: "课程耗课金额",
                    value: courseConsumeAmount,
                },
                {
                    name: "活动耗课金额",
                    value: activityConsumeAmount,
                },
                {
                    name: "其他耗课金额",
                    value: otherConsumeAmount
                },
            ],
            monthAge: [                         // 月龄
                {
                    name: '0-6个月',
                    value: zeroSixNum,
                },
                {
                    name: '6-10个月',
                    value: sixTenNum,
                },
                {
                    name: '10-16个月',
                    value: tenSixteenNum,
                },
                {
                    name: '16-22个月',
                    value: sixteenTwentytwoNum,
                },
                {
                    name: '22-28个月',
                    value: twentytwoTwentyeightNum,
                },
                {
                    name: '28-36个月',
                    value: twentyeightThirdsixNum,
                },
                {
                    name: '3岁-4岁',
                    value: thirdsixFortyeightNum,
                },
                {
                    name: '4岁-5岁',
                    value: fortyeightSixtyNum,
                },
                {
                    name: '5岁以上',
                    value: sixtyFormoreNum,
                }
            ],
            consumeAmountGuide: {
                title: '本月耗课金额',
                text: totalAmount
            },
            consumeGuide: {
                title: '本月耗课数',
                text: totalNum
            },
        };
    });
};

/**
 * CD本月业绩
 * @param params
 * @returns {Promise<any>}
 */
export const getMonthPerformances = (params: any): Promise<any> => {
    const param = {
        url: reportApi.本月业绩,
        data: params
    };
    return Fetch.post(param);
};

/**
 * CD渠道和跟进
 * @param params
 * @returns {Promise<any>}
 */
export const getMonthChannel = (params: any): Promise<any> => {
    const param = {
        url: reportApi.本月渠道和跟进,
        data: params
    };
    return Fetch.post(param);
};
/**
 * CD课程消耗
 * @param params
 * @returns {Promise<any>}
 */
export const getMonthConsumeCource = (params: any): Promise<any> => {
    const param = {
        url: reportApi.本月课程消耗,
        data: params
    };
    return Fetch.post(param);
};

/**
 * 本月待到访明细
 * @param params
 * @returns {Promise<any>}
 */
export const getMonthPlanDetail = (params: any): Promise<any> => {
    const param = {
        url: reportApi.本月待到访明细,
        data: params
    };
    return Fetch.post(param);
};
/**
 * 本周待到访明细
 * @param params
 * @returns {Promise<any>}
 */
export const getWeekPlanDetail = (params: any): Promise<any> => {
    const param = {
        url: reportApi.本周待到访明细,
        data: params
    };
    return Fetch.post(param);
};
/**
 * 本月已到访明细
 * @param params
 * @returns {Promise<any>}
 */
export const getMonthDidDetail = (params: any): Promise<any> => {
    const param = {
        url: reportApi.本月已到访明细,
        data: params
    };
    return Fetch.post(param);
};
/*获取GA仪表盘数据*/

export const getKeyIndicators = (data) => {
    const params = {
        url: reportApi.GA关键指标,
        data,
    };
    return Fetch.post(params)
}
// 查询任务列表
export const getTaskList = (data) => {
    const params = {
        url: CustomerApi.查询任务列表,
        data: data
    };
    return Fetch.post(params)
}
//待续会员
export const getRenewalMember = (data) => {
    const params = {
        url: reportApi.待续会员,
        data,
    };
    return Fetch.post(params)
}
/*今日首课宝宝*/
export const getTodayFirstClassBaby = (data) => {
    const params = {
        url: reportApi.今日首课宝宝,
        data,
    };
    return Fetch.post(params)
}

/*未开课宝宝*/
export const getNoClassBaby = (data) => {
    const params = {
        url: reportApi.未开课宝宝,
        data,
    };
    return Fetch.post(params)
}

/*未排课宝宝*/
export const getNoArrangingBaby = (data) => {
    const params = {
        url: reportApi.未排课宝宝,
        data,
    };
    return Fetch.post(params)
}

/*今日生日宝宝*/
export const getTodayBirthdayBaby = (data) => {
    const params = {
        url: reportApi.今日生日宝宝,
        data,
    };
    return Fetch.post(params)
}

/*本月生日宝宝*/
export const getMonthBirthdayBaby = (data) => {
    const params = {
        url: reportApi.本月生日宝宝,
        data,
    };
    return Fetch.post(params)
}
//过去14天以上未耗课且未联系宝宝
export const getFourteendayNoAttendContact = data => {
    const params = {
        url: reportApi.过去14天以上未耗课且未联系宝宝,
        data
    };
    return Fetch.post(params)
};
//过去7天已约未到宝宝
export const getSevendayAttendNosign = (data) => {
    const params = {
        url: reportApi.过去7天已约未到宝宝,
        data,
    };
    return Fetch.post(params)
}
//未来14天内升班宝宝
export const getFourteendayUpgradeClass = (data) => {
    const params = {
        url: reportApi.未来14天内升班宝宝,
        data,
    };
    return Fetch.post(params)
}
//今日最后一节课宝宝
export const getTodayLastClassBaby = (data) => {
    const params = {
        url: reportApi.今日最后一节课宝宝,
        data,
    };
    return Fetch.post(params)
}

//获取ga仪表盘数据
export const getGaPannel = funcArr => {
    return new Promise(resolve => {
        let sttled = 0;
        let result = [];
        for (let index = 0; index < funcArr.length; index++) {
            const element = funcArr[index];
            element
                .then(res => {
                    result[index] = {
                        status: "ok",
                        value: res
                    };
                })
                .catch(err => {
                    result[index] = {
                        status: "fail",
                        reason: err
                    };
                })
                .finally(() => {
                    ++sttled === funcArr.length && resolve(result);
                });
        }
    });
};
