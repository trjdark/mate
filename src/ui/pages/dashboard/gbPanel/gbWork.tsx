/**
 * desc: GB个人工作台
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
import {ListDonut} from "@/ui/component/charts/listDonut";
import {Funnel} from "@/ui/component/charts/funnel";
import {toCustomerCenter, queryEnum, navConfigEnum} from "../common/index";
import {getGbAchievementData} from "../../../../redux-actions/report/dashboard";
import {User} from "@/common/beans/user";

class GBWork extends Component<any, any> {
    private toCustomerCenter: any;

    constructor(props) {
        super(props);
        this.state = {
            breadCrumbRoutes: [
                {
                    name: '仪表盘'
                },
                {
                    name: 'GB个人业绩'
                },
            ],
            todayStayComplete: 0,          // 今日待完成
            threeTodayComplete: 0,         // 近3日完成
            overdueTask: 0,                // 已过期任务
            unclaimedLeadsNum: 0,          // 待领取名单
            stayContactLeadsNum: 0,        // 今日待联系
            visitRate: 0,                  // 到访-诺访转化率
            todayTomorrowVisitNum: 0,      // 今明到访
            oppLeadsNum: 0,                // 本月到访量
            memberRate: 0,                 // 会员-到访转化率
            singBillNum: 0,                // 本月签单数
            totalSales: 0,                 // 本月总销售额
            monthAchievementNum: 0,        // 本月业绩
            targetAmount: 0,               // 月目标销售额
            completionRate: 0,             // 当月业务完成率
            lastSyncDatetime: 0,           // 数据最后同步时间
            leadsConventRate: [],          // leads转化率数据
            channelPercentage: [],         // 渠道销售渠道占比
            channelVisit: [],              // 渠道到访率
            channelGuide: {},              // 本月签单金额
            color: ['#f5c86a', '#45c9bb', '#f5893e', '#19aac5', '#0a5b86'],
        };
        this.toCustomerCenter = toCustomerCenter.bind(this);
    }

    render() {
        const {
            breadCrumbRoutes, leadsConventRate, channelPercentage, channelGuide, channelVisit, color,
            todayStayComplete, threeTodayComplete, overdueTask, unclaimedLeadsNum, stayContactLeadsNum,
            visitRate, todayTomorrowVisitNum, oppLeadsNum, memberRate, singBillNum, totalSales,
            monthAchievementNum, targetAmount, completionRate, lastSyncDatetime,
        } = this.state;
        return (
            <Fragment>
                <BreadCrumb routes={breadCrumbRoutes}/>
                <MainPanel lastSyncDatetime={lastSyncDatetime}>
                    <MainPanelItem
                        title="今天待完成任务"
                        value={todayStayComplete}
                    />
                    <MainPanelItem
                        title="近三日已完成任务"
                        remark="本中心该GB名下汇总当前系统日期前3天的完成任务数"
                        value={threeTodayComplete}
                    />
                    <MainPanelItem
                        title="已过期任务"
                        value={overdueTask}
                    />
                </MainPanel>
                <Row gutter={16}>
                    <Col span={6}>
                        <SecondPanel
                            leftTitle="待领取名单"
                            leftValue={unclaimedLeadsNum}
                            rightTitle="今日待联系"
                            rightValue={stayContactLeadsNum}
                            bottomTitle="诺访-到访转化率"
                            bottomValue={visitRate}
                            handleRightClick={() => this.toCustomerCenter({
                                queryId: queryEnum.今日待联系,
                                phaseId: navConfigEnum.待分配
                            })}
                        />
                    </Col>
                    <Col span={6}>
                        <SecondPanel
                            leftTitle="今明到访"
                            leftValue={todayTomorrowVisitNum}
                            rightTitle="本月到访量"
                            rightValue={oppLeadsNum}
                            bottomTitle="会员-到访转化率"
                            bottomValue={memberRate}
                            handleLeftClick={() => this.toCustomerCenter({
                                queryId: queryEnum.今明到访,
                                phaseId: navConfigEnum.待分配
                            })}
                        />
                    </Col>
                    <Col span={6}>
                        <SecondPanel
                            leftTitle="本月签单数"
                            leftValue={singBillNum}
                            rightTitle="本月总销售额"
                            rightValue={totalSales}
                            bottomTitle="本月业绩"
                            bottomValue={monthAchievementNum}
                        />
                    </Col>
                    <Col span={6}>
                        <SecondPanel
                            leftTitle="当月业务完成率"
                            leftValue={completionRate}
                            bottomTitle="月目标销售额"
                            bottomValue={targetAmount}
                            progress={completionRate}
                        />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <div className="page-wrap">
                            <PageTitle title="本年度个人Leads转化率"/>
                            <div className="gym-dashboard-three-panel">
                                <Funnel xAxis="name" yAxis="value" data={leadsConventRate} color={color}/>
                            </div>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div className="page-wrap">
                            <PageTitle title="销售额渠道占比"/>
                            <div className="gym-dashboard-three-panel">
                                <Donut color={color} data={channelPercentage} guide={channelGuide}/>
                            </div>
                        </div>
                    </Col>
                </Row>
                <div className="page-wrap">
                    <PageTitle title="渠道到访率"/>
                    <ListDonut data={channelVisit} color={color} guide={channelGuide}/>
                </div>
            </Fragment>
        );
    }

    componentDidMount() {
        this.getAchievementData();
    }

    getAchievementData = () => {
        const params = {
            currentCenterId: User.currentCenterId,
            staffId: User.userId,
        };
        getGbAchievementData(params).then(res => {
            const {
                todayStayComplete, threeTodayComplete, overdueTask, unclaimedLeadsNum, stayContactLeadsNum,
                visitRate, todayTomorrowVisitNum, oppLeadsNum, memberRate, singBillNum, totalSales,
                monthAchievementNum, targetAmount, completionRate, lastSyncDatetime, leadsConventRate,
                channelPercentage, channelVisit, channelGuide,
            } = res;
            this.setState({
                todayStayComplete,          // 今日待完成
                threeTodayComplete,         // 近3日完成
                overdueTask,                // 已过期任务
                unclaimedLeadsNum,          // 待领取名单
                stayContactLeadsNum,        // 今日待联系
                visitRate,                  // 到访-诺访转化率
                todayTomorrowVisitNum,      // 今明到访
                oppLeadsNum,                // 本月到访量
                memberRate,                 // 会员-到访转化率
                singBillNum,                // 本月签单数
                totalSales,                 // 本月总销售额
                monthAchievementNum,        // 本月业绩
                targetAmount,               // 月目标销售额
                completionRate,             // 当月业务完成率
                lastSyncDatetime,           // 数据最后同步时间
                leadsConventRate,           // leads转化率数据
                channelPercentage,          // 渠道销售渠道占比
                channelVisit,               // 渠道到访率
                channelGuide,               // 本月签单金额
            })
        })
    }
}

export default GBWork;
