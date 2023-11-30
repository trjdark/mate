/**
 * desc: GA个人工作台
 * User: Lyon.li@gymboglobal.com
 * Date: 2018/2/28
 * Time: 下午1:38
 */

import React, {Component, Fragment} from 'react';
import {Row, Col} from "antd";
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {PageTitle} from "@/ui/component/pageTitle";
import {MainPanel} from "../components/mainPanel";
import {MainPanelItem} from "../components/mainPanelItem";
import {SecondPanel} from "../components/secondPanel";
import {Donut} from "@/ui/component/charts/donut";
import {Histogram} from "@/ui/component/charts/histogram";
import {toCustomerCenter, queryEnum, navConfigEnum} from "../common";
import {getGaAchievementData} from "@redux-actions/report/dashboard";
import {User} from "@/common/beans/user";

class GAWork extends Component<any, any> {
    private toCustomerCenter: any;

    constructor(props) {
        super(props);
        this.state = {
            breadCrumbRoutes: [
                {
                    name: '仪表盘'
                },
                {
                    name: 'GA个人业绩'
                },
            ],
            renewalMember: 0,                      // 本月续约会员数
            renewalAmount: 0,                      // 本月续约金额
            memberIntroduceLeads: 0,               // 本月会员推荐leads数量
            memberIntroduceContractNum: 0,         // 本月会员推荐合同数量
            memberIntroduceContractAmount: 0,      // 本月会员推荐合同金额
            lastSyncDatetime: 0,                   // 数据同步时间
            waitingRenewalMember: 0,               // 待续会员数
            newMember: 0,                          // 新会员
            oldMember: 0,                          // 老会员
            twoWeekUnopenedCourse: 0,              // 两周未开课
            waitingScheduleMember: 0,              // 待排课宝宝
            upgradeWithinTwoWeeks: 0,              // 两周内升班
            twoNotArrived: 0,                      // 连续未到两次
            totalNum: 0,                           // 本月耗课数
            totalAmount: 0,                        // 本月耗课金额
            avgWeekCourseRate: 0,                  // 平均周耗课
            alreadyRate: 0,                        // 出席率
            truantRate: 0,                         // 旷课率
            leaveRate: 0,                          // 请假率
            consume: [],                           // 会员耗课金额
            consumeAmount: [],                     // 会员耗课金额分布
            monthAge: [],                          // 月龄
            consumeAmountGuide: {},                // 本月耗课金额
            consumeGuide: {},                      // 本月耗课数
            consumeColor: ['#45c9bb', '#f5c86a', '#f5893e'],
            consumeAmountColor: ['#f5893e', '#f5c86a', '#19aac5'],
            monthAgeColor: '#19aac5',
        };
        this.toCustomerCenter = toCustomerCenter.bind(this);
    }

    render() {
        const {
            breadCrumbRoutes, consumeAmountColor, consumeColor, monthAgeColor, renewalMember, renewalAmount,
            memberIntroduceLeads, memberIntroduceContractNum, memberIntroduceContractAmount, lastSyncDatetime,
            waitingRenewalMember, newMember, oldMember, twoWeekUnopenedCourse, waitingScheduleMember, upgradeWithinTwoWeeks,
            twoNotArrived, totalNum, totalAmount, avgWeekCourseRate, alreadyRate, truantRate, leaveRate, consume, consumeAmount,
            monthAge, consumeAmountGuide, consumeGuide,
        } = this.state;
        return (
            <Fragment>
                <BreadCrumb routes={breadCrumbRoutes}/>
                <MainPanel lastSyncDatetime={lastSyncDatetime}>
                    <MainPanelItem
                        title="本月续约会员数"
                        remark="当前GA下的会员本月已收款的续约合同数量"
                        value={renewalMember}
                    />
                    <MainPanelItem
                        title="本月续约会员金额"
                        remark="当前GA下的会员本月已收款的续约合同实收总额，小数点后保留两位（未刨退转）"
                        value={renewalAmount}
                    />
                    <MainPanelItem
                        title={
                            <span>
                                本月会介来源
                                <span className="gym-dashboard-main-panel-data-item-title-des">(Leads数/签单数)</span>
                            </span>
                        }
                        remark="当前GA下渠道为会员推荐的leads数量及合同数量（未刨退转）"
                        value={`${memberIntroduceLeads}/${memberIntroduceContractNum}`}
                    />
                    <MainPanelItem
                        title="本月会介会员签单金额"
                        remark="当前GA下渠道为会员推荐的合同实收总额 小数点后保留两位（未刨退转）"
                        value={memberIntroduceContractAmount}
                    />
                </MainPanel>
                <Row gutter={16}>
                    <Col span={6}>
                        <SecondPanel
                            leftTitle="待续会员数"
                            leftValue={waitingRenewalMember}
                            rightTitle="新会员/老会员"
                            rightValue={`${newMember}/${oldMember}`}
                            bottomTitle="两周未开课"
                            bottomValue={twoWeekUnopenedCourse}
                            handleBottomClick={() => this.toCustomerCenter({
                                queryId: queryEnum.两周未开课,
                                phaseId: navConfigEnum.待分配
                            })}
                        />
                    </Col>
                    <Col span={6}>
                        <SecondPanel
                            leftTitle="待排课宝宝"
                            leftValue={waitingScheduleMember}
                            rightTitle="两周内升班"
                            rightValue={upgradeWithinTwoWeeks}
                            bottomTitle="连续未到两次"
                            bottomValue={twoNotArrived}
                            handleRightClick={() => this.toCustomerCenter({
                                queryId: queryEnum.两周内升班,
                                phaseId: navConfigEnum.待分配
                            })}
                        />
                    </Col>
                    <Col span={6}>
                        <SecondPanel
                            leftTitle="本月耗课数"
                            leftValue={totalNum}
                            rightTitle="本月耗课金额"
                            rightValue={totalAmount}
                            bottomTitle="平均周耗课"
                            bottomValue={avgWeekCourseRate}
                        />
                    </Col>
                    <Col span={6}>
                        <SecondPanel
                            leftTitle="出席率"
                            leftValue={alreadyRate}
                            rightTitle="请假率"
                            rightValue={leaveRate}
                            bottomTitle="旷课率"
                            bottomValue={truantRate}
                        />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <div className="page-wrap">
                            <PageTitle title="会员耗课金额分布"/>
                            <div className="gym-dashboard-three-panel">
                                <Donut color={consumeAmountColor} data={consumeAmount} guide={consumeAmountGuide}/>
                            </div>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div className="page-wrap">
                            <PageTitle title="会员耗课分布"/>
                            <div className="gym-dashboard-three-panel">
                                <Donut color={consumeColor} data={consume} guide={consumeGuide}/>
                            </div>
                        </div>
                    </Col>
                </Row>
                <div className="page-wrap">
                    <PageTitle title="会员月龄占比"/>
                    <div className="gym-dashboard-four-panel">
                        <Histogram xAxis="name" yAxis="value" data={monthAge} color={monthAgeColor} toolTipLabel="宝宝数"/>
                    </div>
                </div>
            </Fragment>
        );
    }
    componentDidMount() {
        this.getAchievementData();
    }

    /*获取GA业绩数据*/
    getAchievementData = () => {
        const params = {
            currentCenterId: User.currentCenterId,
            staffId: User.userId,
        };
        getGaAchievementData(params).then(res => {
            const {
                renewalMember, renewalAmount, memberIntroduceLeads, memberIntroduceContractNum, memberIntroduceContractAmount,
                lastSyncDatetime, waitingRenewalMember, newMember, oldMember, twoWeekUnopenedCourse, waitingScheduleMember,
                upgradeWithinTwoWeeks, twoNotArrived, totalNum, totalAmount, avgWeekCourseRate, alreadyRate, truantRate,
                leaveRate, consume, consumeAmount, monthAge, consumeAmountGuide, consumeGuide,
            } = res;
            this.setState({
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
                consume,                            // 会员耗课金额
                consumeAmount,                      // 会员耗课金额分布
                monthAge,                           // 月龄
                consumeAmountGuide,                 // 本月耗课金额
                consumeGuide,                       // 本月耗课数
            })
        });
    }
}

export default GAWork;
