/**
 * desc: GB仪表盘
 * User: Katarina.yuan@gymboglobal.com
 * Date: 2021/8/13
 * Time: 下午4:00
 */

import React, {Component, Fragment} from 'react';
import {Row, Col} from "antd";
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {thousandNum} from "../common";
import {
    getGbAchievementNewData,
    getGbContactLeadsData,
    getGbReceiveLeadsData
} from "@redux-actions/report/dashboard";
import {User} from "@/common/beans/user";
import {Table as AntDTable} from 'antd';
import {DefaultDataContent} from "@/ui/component/defaultDataContent/defaultDataContent";
import { PageTitle } from '@/ui/component/pageTitle';
import {CollapseTable} from "@/ui/pages/dashboard/components/collapseTable";
import {columns, receiveColumns, contactColumns} from "./enum/columns";
import SmallPanel from "@/ui/pages/dashboard/gbPanel/part/smallPanel";
class GBPanel extends Component<any, any> {
    // 面包屑
    private routes: Array<any> =[
        { name: '工作台' },
        { name: 'GB工作台' },
    ]
    constructor(props) {
        super(props);
        this.state = {
            gbKpi: [],              // 业绩
            receivePageNo: 1,
            contactPageNo: 1,
            receivePageSize: 10,
            contactPageSize: 10,
            receiveTotalSize: 0,
            contactTotalSize: 0,
            dataSource: [],         // 到访情况
            receiveDataSource: [],
            contactDataSource: [],

        };
    }
    componentDidMount() {
        Promise.all([
                        this.getAchievementData(),
                        this.getReceiveLeads(),
                        this.getContactLeads()
                    ]).then(res=>{})
    }

    // 基本信息
    getAchievementData = () => {
        const params = {
            currentCenterId: User.currentCenterId,
            staffId: User.userId,
        };
        // 数据处理
        getGbAchievementNewData(params).then(res => {
            const dataSource = [
                {
                    leftTitle: '诺访数（首次）',
                    today: res.todayFirstappTime,
                    currentWeek: res.currentWeekFirstAppTime,
                    currentMonth: res.currentMonthFirstAppTime
                },{
                    leftTitle: '诺访数（非首次）',
                    today: res.todayMultipleAppTime,
                    currentWeek: res.currentWeekMultipleAppTime,
                    currentMonth: res.currentMonthMultipleAppTime
                },{
                    leftTitle: '计划到访数（首次）',
                    today: res.todayFirstOppTime,
                    currentWeek: res.currentWeekFirstOppTime,
                    currentMonth: res.currentMonthFirstOppTime
                },{
                    leftTitle: '计划到访数（非首次）',
                    today: res.todayMultipleOppTime,
                    currentWeek: res.currentWeekMultipleOppTime,
                    currentMonth: res.currentMonthMultipleOppTime
                },
            ]
            const gbKpi = [
                [
                    {title:'本月业绩（新合约+续约）', data: thousandNum(res.performanceIncome)},
                    {title:'目标销售额（完成率）', data: res.performanceIndexStr==='未设目标'?'未设目标':thousandNum(res.performanceIndexStr)+'（'+res.finishingRate+'）'},
                    {title:'本月净收入', data: thousandNum(res.performanceNetIncome)},
                ],
                [
                    {title:'今日有效电话数', data: thousandNum(res.effectiveCallTimes)},
                    {title:'今日诺访数', data: thousandNum(res.promiseLeadsNum), remark:'任务创建时间为今天，任务类型为面谈或签约的任务数，只统计leads阶段的任务。'},
                ],
                [
                    {title:'待领取leads', data: thousandNum(res.needReceiveLeadsNum), nav: '已分配'},
                    {title:'已约未到访leads', data: thousandNum(res.alreadyConnectNotVisitNum)},
                    {title:'已到访未签约leads', data: thousandNum(res.alreadyVisitNotSignNum)},
                ],
                [
                    {title:'新会员阶段待续数', data: thousandNum(res.expiredMemberNewsNum), nav: '待续会员'},
                    {title:'待续会员数 (新会员+老会员)', data: thousandNum(res.expiredMemberAllNum), nav: '待续会员'},
                ],
            ];
            this.setState({dataSource, gbKpi})
        })
    }

    // 已领取待联络leads明细
    getReceiveLeads = () => {
        const {receivePageNo, receivePageSize} = this.state
        const params = {
            currentCenterId: User.currentCenterId,
            staffId: User.userId,
            pageNo: receivePageNo,
            pageSize: receivePageSize
        }
        getGbReceiveLeadsData(params).then(res => {
            this.setState({
                              receiveDataSource: res.list,
                              receivePageNo: res.pageNo,
                              receivePageSize: res.pageSize,
                              receiveTotalSize: res.totalSize,
                          })
        })
    }

    // 已联络未到访leads明细
    getContactLeads = () => {
        const {contactPageNo, contactPageSize} = this.state
        const params = {
            currentCenterId: User.currentCenterId,
            staffId: User.userId,
            pageNo: contactPageNo,
            pageSize: contactPageSize
        }
        getGbContactLeadsData(params).then(res => {
            this.setState({
                              contactDataSource: res.list,
                              contactPageNo: res.pageNo,
                              contactPageSize: res.pageSize,
                              contactTotalSize: res.totalSize,
                          })
        })
    }

    // 已领取待联络leads表格切换页数
    handleChangeReceivePage = (pageInfo) => {
        this.setState({
                          receivePageNo: pageInfo.pageNo,
                          receivePageSize: pageInfo.pageSize
                      },
                      this.getReceiveLeads);
    };
    // 已联络未到访leads表格切换页数
    handleChangeContactPage = (pageInfo) => {
        this.setState({
                          contactPageNo: pageInfo.pageNo,
                          contactPageSize: pageInfo.pageSize
                      },
                      this.getContactLeads);
    };
    render() {
        const { dataSource, gbKpi, receiveDataSource, receivePageNo, receivePageSize, receiveTotalSize,
            contactPageNo, contactPageSize, contactTotalSize, contactDataSource } = this.state;
        return (
            <Fragment>
                <BreadCrumb routes={this.routes}/>
                <div className='gym-dashboard-gb-card-panel-explainLink'>
                    <a href="http://wiki.gymbomate.com/pages/viewpage.action?pageId=27363011" target="_blank">本页数据是如何统计的？</a>
                </div>
                <Row gutter={16}>
                    <Col span={15}>
                        <SmallPanel dataSource={gbKpi[0]}/>
                    </Col>
                    <Col span={9}>
                        <SmallPanel dataSource={gbKpi[1]}/>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={15}>
                        <SmallPanel dataSource={gbKpi[2]} second={true}/>
                    </Col>
                    <Col span={9}>
                        <SmallPanel dataSource={gbKpi[3]} second={true}/>
                    </Col>
                </Row>
                <div className="page-wrap">
                    <PageTitle title={`到访情况（人次）`} />
                    <AntDTable
                        locale={{emptyText:<DefaultDataContent/>}}
                        className='gym-table-wrap gym-dashboard-gb-card-panel-table'
                        bordered={false}
                        pagination={false}
                        dataSource={dataSource}
                        columns={columns()}
                        rowKey='leftTitle'
                    />
                    <CollapseTable
                        title={`已领取待联络Leads（总计：${receiveTotalSize}）`}
                        columns={receiveColumns()}
                        dataSource={receiveDataSource}
                        rowKey='id'
                        totalSize={receiveTotalSize}
                        pageSize={receivePageSize}
                        pageNo={receivePageNo}
                        handleChangePage={this.handleChangeReceivePage}
                        className='gym-dashboard-gb-card-panel-table-leads'
                        handleRefresh={this.getReceiveLeads}
                    />
                    <CollapseTable
                        title={`已联络未到访Leads（总计：${contactTotalSize}）`}
                        columns={contactColumns()}
                        dataSource={contactDataSource}
                        rowKey='id'
                        totalSize={contactTotalSize}
                        pageSize={contactPageSize}
                        pageNo={contactPageNo}
                        handleChangePage={this.handleChangeContactPage}
                        handleRefresh={this.getContactLeads}
                    />
                </div>
            </Fragment>
        );
    }
}

export default GBPanel;
