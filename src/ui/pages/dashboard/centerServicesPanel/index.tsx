/**
 * desc: 中心履约服务看板
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
import {Histogram} from "@/ui/component/charts/histogram";
import {Donut} from "@/ui/component/charts/donut";
import {toCustomerCenter, queryEnum, navConfigEnum} from "../common";
import {getCenterServicesData} from "@redux-actions/report/dashboard";
import {User} from "@/common/beans/user";

class CenterServicesPanel extends Component<any, any> {
    private toCustomerCenter: any;

    constructor(props) {
        super(props);
        this.state = {
            breadCrumbRoutes: [
                {
                    name: '工作台'
                },
                {
                    name: 'HGA工作台'
                },
            ],
            renewalMemberNum: 0,           // 本月续约会员数
            renewalMemberSum: 0,           // 本月续约会员金额,
            memberIntroduceNum: 0,         // 本月会介会员数,
            lastSyncDatetime: 0,           // 最后同步时间
            memberIntroduceSum: 0,         // 本月会介会员金额
            noGaNum: 0,                    // 无ga会员数量
            waitingRenewalMember: 0,       // 待续约会员数
            validMemberNum: 0,             // 会员数
            waitingScheduleMember: 0,      // 待排课宝宝
            upgradeWithinTwoWeeks: 0,      // 两周内升班
            twiceAbsentTimes: 0,           // 连续未到两次
            avgClassCapacity: 0,           // 平均班容
            avgWeekconsume: 0,             // 平均周耗课
            memberMonthActityRate: 0,      // 会员月活跃率
            attendRate: 0,                 // 出席率
            leaveRate: 0,                  // 请假率
            absentRate: 0,                 // 旷课率
            consume: [],                   // 会员耗课数
            consumeAmount: [],             // 会员耗课金额
            monthAge: [],                  // 月龄数据
            consumeAmountGuide: {},        // 本月耗课总金额
            consumeGuide: {},              // 本月耗课数
            consumeColor: ['#45c9bb', '#f5c86a', '#f5893e'],
            consumeAmountColor: ['#f5893e', '#f5c86a', '#19aac5'],
            monthAgeColor: '#19aac5',
        };
        this.toCustomerCenter = toCustomerCenter.bind(this);
    }

    render() {
        const {
            breadCrumbRoutes, consumeColor, consumeAmountColor, monthAgeColor, renewalMemberNum,
            renewalMemberSum, memberIntroduceNum, memberIntroduceSum, noGaNum, waitingRenewalMember,
            validMemberNum, waitingScheduleMember, upgradeWithinTwoWeeks, twiceAbsentTimes,
            avgClassCapacity, avgWeekconsume, memberMonthActityRate, attendRate, leaveRate, absentRate,
            consumeAmount, consumeAmountGuide, consume, consumeGuide, monthAge, lastSyncDatetime,
        } = this.state;
        return (
            <Fragment>
                <BreadCrumb routes={breadCrumbRoutes}/>
                <MainPanel lastSyncDatetime={lastSyncDatetime}>
                    <MainPanelItem
                        title="本月续约会员数"
                        remark="当前中心本月已收款的续约合同数量"
                        value={renewalMemberNum}
                    />
                    <MainPanelItem
                        title="本月续约金额"
                        remark="当前中心本月已收款的续约合同实收总额（未刨退转）"
                        value={renewalMemberSum}
                    />
                    <MainPanelItem
                        title="本月会介会员数"
                        remark="当前中心渠道为会员推荐的会员数量。"
                        value={memberIntroduceNum}
                    />
                    <MainPanelItem
                        title="本月会介会员金额"
                        remark="当前中心渠道为会员推荐的合同实收总额。（未刨退转）"
                        value={memberIntroduceSum}
                    />
                </MainPanel>
                <Row gutter={16}>
                    <Col span={6}>
                        <SecondPanel
                            leftTitle="无GA会员数"
                            leftValue={noGaNum}
                            rightTitle="待续会员数"
                            rightValue={waitingRenewalMember}
                            bottomTitle="会员数"
                            bottomValue={validMemberNum}
                            handleRightClick={() => this.toCustomerCenter({phaseId: navConfigEnum.待续会员})}
                        />
                    </Col>
                    <Col span={6}>
                        <SecondPanel
                            leftTitle="待排课宝宝"
                            leftValue={waitingScheduleMember}
                            rightTitle="两周内升班"
                            rightValue={upgradeWithinTwoWeeks}
                            bottomTitle="连续未到两次"
                            bottomValue={twiceAbsentTimes}
                            handleRightClick={() => this.toCustomerCenter({
                                queryId: queryEnum.两周内升班,
                                phaseId: navConfigEnum.待分配
                            })}
                        />
                    </Col>
                    <Col span={6}>
                        <SecondPanel
                            leftTitle="平均班容"
                            leftValue={avgClassCapacity}
                            rightTitle="平均周耗课"
                            rightValue={avgWeekconsume}
                            bottomTitle="会员月活跃率"
                            bottomValue={memberMonthActityRate}
                        />
                    </Col>
                    <Col span={6}>
                        <SecondPanel
                            leftTitle="出席率"
                            leftValue={attendRate}
                            rightTitle="请假率"
                            rightValue={leaveRate}
                            bottomTitle="旷课率"
                            bottomValue={absentRate}
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
                    <Histogram data={monthAge} color={monthAgeColor} toolTipLabel="宝宝数"/>
                </div>
            </Fragment>
        );
    }

    componentDidMount() {
        this.getServicesData();
    }

    /*获取中心履约服务数据*/
    getServicesData = () => {
        const params = {
            currentCenterId: User.currentCenterId,
        };

        getCenterServicesData(params).then(res => {
            const {
                renewalMemberNum, renewalMemberSum, memberIntroduceNum, memberIntroduceSum, noGaNum,
                waitingRenewalMember, validMemberNum, waitingScheduleMember, upgradeWithinTwoWeeks,
                twiceAbsentTimes, avgClassCapacity, avgWeekconsume, memberMonthActityRate, attendRate,
                leaveRate, absentRate, consumeAmount, consumeAmountGuide, consume, consumeGuide, monthAge,
                lastSyncDatetime,
            } = res;

            this.setState({
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
                consumeAmount,              // 会员耗课金额
                consumeAmountGuide,         // 本月耗课金额
                consume,                    // 会员耗课数
                consumeGuide,               // 本月耗课数
                monthAge,                   // 会员月龄数据,
                lastSyncDatetime,           // 数据最后同步时间
            })
        })
    };
}

export default CenterServicesPanel;
