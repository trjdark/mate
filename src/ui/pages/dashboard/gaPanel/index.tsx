/**
 * desc: GA仪表盘
 * User: luck.yuan@gymboglobal.com
 * Date: 2021/8/10
 * Time: 上午9:38
 */

import React, { Component, Fragment } from 'react';
import { BreadCrumb } from "@/ui/component/breadcrumb";
import { GaPanelItem } from "./part/gaPanelItem";
import {
    getGaPannel,
    getKeyIndicators,
    getTaskList,
    getTodayFirstClassBaby,
    getNoClassBaby,
    getNoArrangingBaby,
    getTodayBirthdayBaby,
    getMonthBirthdayBaby,
    getFourteendayNoAttendContact,
    getSevendayAttendNosign,
    getFourteendayUpgradeClass,
    getTodayLastClassBaby,
    getRenewalMember
} from "@redux-actions/report/dashboard";
import { User } from "@/common/beans/user";
import { toCustomerCenter, navConfigEnum, toTaskCenter, searchTagEnum } from "../common";
import { CollapseTable } from './part/collapseTable';
import { columns, remarkInfo } from './enum/columns';

class GAPanel extends Component<any, any> {
    private toCustomerCenter: any;
    private toTaskCenter: any;
    constructor(props) {
        super(props);
        this.state = {
            breadCrumbRoutes: [
                {name: "工作台"},
                {name: "GA工作台"}
            ],
            quotaList: [],                         // 指标数组
            taskList: [],                         // 任务数组
            tableList: [],                        // 表格数组

        };
        this.toCustomerCenter = toCustomerCenter.bind(this);
        this.toTaskCenter = toTaskCenter.bind(this);
    }

    componentDidMount() {
        const params = {
            currentCenterId: User.currentCenterId,
            staffId: User.userId,
            pageNo: 1,
            pageSize: 10
        };
        const promises = [
            getKeyIndicators(params), //ga关键指标
            getTaskList({
                //获取任务中心今日待完成
                currentCenterId: User.currentCenterId,
                quickSearchType: searchTagEnum.今日待完成,
                taskDateBegin: 0,
                taskDateEnd: 0
            }),
            getTaskList({
                //获取过期未完成任务数
                currentCenterId: User.currentCenterId,
                quickSearchType: searchTagEnum.本月已过期,
                taskDateBegin: 0,
                taskDateEnd: 0
            }),
            getRenewalMember({
                currentCenterId: User.currentCenterId,
                staffId: User.userId
            }), //待续约会员

            getTodayFirstClassBaby(params), //今日首课宝宝
            getNoClassBaby(params), //未开课宝宝
            getNoArrangingBaby(params), //未排课宝宝
            getFourteendayNoAttendContact(params), //过去14天以上未耗课且未联系宝宝
            getSevendayAttendNosign(params), //过去7天已约未到宝宝
            getFourteendayUpgradeClass(params), //未来14天内升班宝宝
            getTodayLastClassBaby(params), //今日最后一节课宝宝
            getTodayBirthdayBaby(params), //今日生日宝宝
            getMonthBirthdayBaby(params) //本月生日宝宝
        ];
        getGaPannel(promises).then((res: any) => {
            let quotaList = []
            if (res[0].status === "ok") {
                const { courseConsumeQuantity, courseBookQuantity, completionRate, memberCoverage, courseConsumeFrequencyPer } = res[0].value;
                quotaList = [
                    { title: "本月耗课时数", value: courseConsumeQuantity },
                    { title: "本月预定课时数(完成率)", value: courseBookQuantity, data: completionRate },
                    { title: "本月会员覆盖率", value: memberCoverage, remark: "T+1,本月1号展示上个月整月的数据。" },
                    { title: "本月人均耗课频次", value: courseConsumeFrequencyPer, remark: "T+1,本月1号展示上个月整月的数据，按照宝宝维度统计。" }
                ];
            } else {
                quotaList = [
                    { title: "本月耗课时数", value: '0' },
                    { title: "本月预定课时数(完成率)", value: '0', data: '未设目标' },
                    { title: "本月会员覆盖率", value: '0%', remark: "T+1,本月1号展示上个月整月的数据。" },
                    { title: "本月人均耗课频次", value: '0.00', remark: "T+1,本月1号展示上个月整月的数据，按照宝宝维度统计。" }
                ];
            }

            const taskList = [
                { title: '今日待完成任务', value: res[1].status === "ok" ? res[1].value.totalSize : 0 },
                { title: '本月过期未完成任务', value: res[2].status === "ok" ? res[2].value.totalSize : 0 },
                { title: '待续会员', value: res[3].status === "ok" ? res[3].value.renewalMemberNum : 0 },
            ];

            const defaultDataSource = { list: [], pageNo: 1, pageSize: 10, totalNo: 0, totalSize: 0 };
            const tableList = res
                .filter((item, index) => index > 3)
                .map((item, index) =>
                    item.status === "ok" ? item.value : defaultDataSource
                );
            this.setState({ quotaList, taskList, tableList, });
        })
    }

    //刷新功能栏数据
    resetData(index, res) {
        const { taskList } = this.state;
        let str = taskList.slice(index, (index + 1))[0];
        if (index === 2) {
            str.value = res.renewalMemberNum;
        } else {
            str.value = res.totalSize;
        }
        const arr = [...taskList.slice(0, index), str, ...taskList.slice(index + 1)];
        this.setState({ taskList: arr });
    }

    //页面跳转
    handleNumClick(index) {
        switch (index) {
            case 0: //今日待完成任务
                this.toTaskCenter({
                    quickSearchType: searchTagEnum.今日待完成
                });
                break;
            case 1: //本月过期未完成任务
                this.toTaskCenter({
                    quickSearchType: searchTagEnum.本月已过期
                });
                break;
            case 2: //待续会员
                this.toCustomerCenter({
                    phaseId: navConfigEnum.待续会员
                });
                break;
            default:
                break;
        }
    }

    //表格数据刷新
    resetList(index, res) {
        const { tableList } = this.state;
        const arr = [...tableList.slice(0, index), res, ...tableList.slice(index + 1)];
        this.setState({ tableList: arr });
    }

    handleUpdateClick(index) {
        switch (index) {
            case 0: //今日待完成任务
                getTaskList({ currentCenterId: User.currentCenterId, quickSearchType: searchTagEnum.今日待完成, taskDateBegin: 0, taskDateEnd: 0, })
                    .then(res => {
                        this.resetData(index, res);
                    })
                break;
            case 1: //本月过期未完成任务
                getTaskList({ currentCenterId: User.currentCenterId, quickSearchType: searchTagEnum.本月已过期, taskDateBegin: 0, taskDateEnd: 0, })
                    .then(res => {
                        this.resetData(index, res);
                    })
                break;
            case 2: //待续会员
                getRenewalMember({ currentCenterId: User.currentCenterId, staffId: User.userId })
                    .then(res => {
                        this.resetData(index, res);
                    });
                break;
            default:
                break;
        }
    }

    //分页控制&&icon图标刷新
    handleChangePage = (pageInfo, index) => {
        const params = {
            currentCenterId: User.currentCenterId,
            staffId: User.userId,
            pageNo: pageInfo.pageNo,
            pageSize: pageInfo.pageSize
        };
        switch (index) {
            case 0://今日首课宝宝
                getTodayFirstClassBaby(params).then(res => {
                    this.resetList(index, res);
                });
                break;
            case 1://未开课宝宝
                getNoClassBaby(params).then(res => {
                    this.resetList(index, res);
                });
                break;
            case 2://未排课宝宝
                getNoArrangingBaby(params).then(res => {
                    this.resetList(index, res);
                })
                break;
            case 3:/*过去14天以上未耗课且未联系宝宝*/
                getFourteendayNoAttendContact(params).then(res => {
                    this.resetList(index, res);
                });
                break;
            case 4:/*过去7天已约未到宝宝*/
                getSevendayAttendNosign(params).then(res => {
                    this.resetList(index, res);
                });
                break;
            case 5:/*未来14天内升班宝宝*/
                getFourteendayUpgradeClass(params).then(res => {
                    this.resetList(index, res);
                });
                break;
            case 6:/*今日最后一节课宝宝*/
                getTodayLastClassBaby(params).then(res => {
                    this.resetList(index, res);
                });
                break;
            case 7://今日生日宝宝
                getTodayBirthdayBaby(params).then(res => {
                    this.resetList(index, res);
                });
                break;
            case 8:/*本月生日宝宝*/
                getMonthBirthdayBaby(params).then(res => {
                    this.resetList(index, res);
                });
                break;
            default:
                break;
        }
    };
    render() {
        const {
            breadCrumbRoutes,
            quotaList,
            tableList,
            taskList
        } = this.state;

        return (
            <Fragment>
                <BreadCrumb routes={breadCrumbRoutes} />
                <div className="gym-dashboard-ga-panel">
                    <div className='gym-dashboard-ga-panel-explainLink'>
                        <a href="http://wiki.gymbomate.com/pages/viewpage.action?pageId=27363014" target="_blank">本页数据是如何统计的？</a>
                    </div>
                    <div className="page-wrap gym-dashboard-ga-panel-card">
                        <div className="gym-dashboard-ga-panel-card-data">
                            {(quotaList || []).map((item, index) => (
                                <GaPanelItem
                                    key={index}
                                    title={item.title}
                                    value={item.value}
                                    data={item.data}
                                    remark={item.remark}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="page-wrap gym-dashboard-ga-panel-card  smallCard">
                        <div className="gym-dashboard-ga-panel-card-data">
                            {(taskList || []).map((item, index) => (
                                <GaPanelItem
                                    key={index}
                                    title={item.title}
                                    value={item.value}
                                    icon='sync'
                                    isLink={true}
                                    second={true}
                                    handleNumClick={() => this.handleNumClick(index)}
                                    handleUpdateClick={() =>
                                        this.handleUpdateClick(index)
                                    }
                                />
                            ))}
                        </div>
                    </div>
                    <div className="page-wrap">
                        {(tableList || []).map((item, index) => (
                            <CollapseTable
                                key={`table_${index}`}
                                title={`${remarkInfo[index].title}（总计：${item.totalSize}）`}
                                remark={remarkInfo[index].remark}
                                dataSource={item.list}
                                rowKey="babyId"
                                totalSize={item.totalSize}
                                className="gym-dashboard-card-panel-table-leads"
                                pageSize={item.pageSize}
                                pageNo={item.pageNo}
                                handleChangePage={pageInfo =>
                                    this.handleChangePage(pageInfo, index)
                                }
                                columns={columns[index]}
                            />
                        ))}
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default GAPanel;
