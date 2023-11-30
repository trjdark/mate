/**
 * desc: 日常业绩统计报表
 * User: Lyon.li@gymboglobal.com
 * Date: 2019/1/30
 * Time: 上午20：00
 */
import React, {Component, Fragment} from 'react';
import {message} from "antd";
import moment from 'moment';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {TablePagination} from "@/ui/component/tablePagination";
import {SearchForm} from "@/ui/component/searchForm";
import FullScreen from '../components/fullScreen';
import {couldDownLoad, formatter, formatNum} from "../common";
import {getAchievementDataList, downloadAchievementData} from "@redux-actions/report/serviceReport";
import {User} from "@/common/beans/user";
import {Tooltip} from "@/ui/component/toolTip";

class AchievementDaily extends Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            breadCrumbRoutes: [
                {
                    name: '报表'
                },
                {
                    name: '财务类报表'
                },
                {
                    name: '日常业绩统计'
                }
            ],
            searchConfig: [
                {
                    type: 'months',
                    label: '收付款日期',
                    name: {
                        start: 'financialStartDate',
                        end: 'financialEndDate'
                    },
                    startInitialValue: moment(),
                    endInitialValue: moment()
                },
            ],
            columns: [
                {
                    title: '合同编号',
                    dataIndex: 'contractCode',
                },
                {
                    title: '合同类型',
                    dataIndex: 'contractType',
                },
                {
                    title: '出现方式',
                    dataIndex: 'appearanceType',
                },
                {
                    title: '渠道来源',
                    dataIndex: 'channelType',
                },
                {
                    title: '渠道备注',
                    dataIndex: 'channelComment',
                    width: 150,
                    render(text) {
                        if (!text) {
                            return '';
                        }

                        if (text.length > 20) {
                            return (
                                <Tooltip
                                    title={text}
                                    trigger="click"
                                >
                                    {`${text.slice(0, 18)}...`}
                                </Tooltip>
                            )
                        }

                        return text;
                    }
                },
                {
                    title: 'Leads创建日期',
                    dataIndex: 'leadsCreateDateStr',
                    render(text) {
                        return text ? moment(text).format(formatter) : ''
                    }
                },
                {
                    title: '收付款原由',
                    dataIndex: 'financialContent',
                },
                {
                    title: '收付款日期',
                    dataIndex: 'financialDateStr',
                    render(text) {
                        return text ? moment(text).format(formatter) : ''
                    }
                },
                {
                    title: '付款方式',
                    dataIndex: 'financialMode',
                },
                {
                    title: '收款人',
                    dataIndex: 'operatorStaff',
                },
                {
                    title: 'GB',
                    dataIndex: 'gb',
                },
                {
                    title: '签约人',
                    dataIndex: 'salesStaffName',
                },
                {
                    title: '宝宝姓名',
                    dataIndex: 'babyName',
                },
                {
                    title: '月龄',
                    dataIndex: 'monthAge',
                },
                {
                    title: '赠课数',
                    dataIndex: 'freeCourseNum',
                },
                {
                    title: '课程包',
                    dataIndex: 'packageName',
                },
                {
                    title: '合同金额',
                    dataIndex: 'contractAmount',
                    render: text => formatNum(text),
                },
                {
                    title: '转入合同金额',
                    dataIndex: 'contractInAmount',
                    render: text => formatNum(text),
                },
                {
                    title: '转出合同金额',
                    dataIndex: 'contractOutAmount',
                    render: text => formatNum(text),
                },
                {
                    title: '改包金额',
                    dataIndex: 'modifyPackageAmount',
                    render: text => formatNum(text),
                },
                {
                    title: '退课金额',
                    dataIndex: 'refundCourseAmount',
                    render: text => formatNum(text),
                },
                {
                    title: '注册费',
                    dataIndex: 'registerAmount',
                    render: text => formatNum(text),
                },
                {
                    title: '总收入',
                    dataIndex: 'total',
                    render: text => formatNum(text),
                },
            ],             // 表单配置
            dataSource: [],             // 数据项
            financialStartDate: moment(),
            financialEndDate: moment(),
            lastSyncDatetime: null,     // 数据有效时间
            scrollX: 2500,       // 横向滚动
            totalSize: 0,
            pageNo: 1,          // 页数
            pageSize: 10,       // 每页请求条数
        }
    }

    render() {
        const {
            breadCrumbRoutes, columns, dataSource, lastSyncDatetime,
            searchConfig, scrollX, totalSize, pageNo, pageSize,
        } = this.state;
        return (
            <Fragment>
                <BreadCrumb routes={breadCrumbRoutes}/>
                <div className="page-wrap">
                    <SearchForm
                        items={searchConfig}
                        onSearch={this.onSearch}
                        onReset={this.onReset}
                    />
                    <FullScreen
                        lastSyncDatetime={lastSyncDatetime}
                        handleDownLoadExcel={this.handleDownLoadExcel}
                        canDownload={dataSource.length > 0}
                    >
                        <TablePagination
                            columns={columns}
                            dataSource={dataSource}
                            scroll={{x: scrollX}}
                            totalSize={totalSize}
                            pageNo={pageNo}
                            pageSize={pageSize}
                            rowKey={item => item.id}
                            handleChangePage={this.handleChangePage}
                        />
                    </FullScreen>
                </div>
            </Fragment>
        );
    }

    componentDidMount() {}

    /**
     * 生成查询参数
     * @return object 参数对象
     */
    createParams = () => {
        const {financialStartDate, financialEndDate} = this.state;
        return {
            currentCenterId: User.currentCenterId,
            financialStartDate: financialStartDate.valueOf(),
            financialEndDate: financialEndDate.valueOf(),
        }
    };

    /*查询日常业绩列表*/
    getAchievementDailyList = () => {
        const {pageNo, pageSize,} = this.state;
        const params = {
            ...this.createParams(),
            pageNo, pageSize,
        };

        getAchievementDataList(params).then(res => {
            const {list, totalSize, pageNo, pageSize, lastSyncDatetime} = res;
            this.setState({
                dataSource: list,
                totalSize, pageNo, pageSize,
                lastSyncDatetime: lastSyncDatetime || Date.now()
            })
        });
    };

    /*查询*/
    onSearch = (value) => {
        const {financialStartDate, financialEndDate} = value;
        if (financialStartDate.valueOf() > financialEndDate.valueOf()) {
            // 如果开始时间大于结束时间，提示错误
            message.error('开始时间不能大于结束时间');
            return;
        }
        this.setState(
            {
                ...value,
                pageNo: 1,
                totalSize: 0,
            },

            this.getAchievementDailyList
        );
    };

    /*重置*/
    onReset = (value) => {
        this.setState(
            {
                ...value,
            }
        );
    };

    /*翻页*/
    handleChangePage = (data) => {
        this.setState(
            {
                pageNo: data.pageNo,
                pageSize: data.pageSize,
            },
            this.getAchievementDailyList
        );
    };

    /*导出excel*/
    handleDownLoadExcel = () => {
        if (couldDownLoad(this.state.dataSource)) {
            downloadAchievementData(this.createParams());
        }
    };
}

export default AchievementDaily;
