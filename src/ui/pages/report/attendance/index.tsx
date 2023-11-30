/**
 * desc: 出席报告
 * User: Lyon.li@gymboglobal.com
 * Date: 2019/2/18
 * Time: 下午15：30
 */
import React, {Component, Fragment} from 'react';
import {message} from "antd";
import moment from 'moment';
import {Routes} from "@/router/enum/routes";
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {TablePagination} from "@/ui/component/tablePagination";
import FullScreen from '../components/fullScreen';
import {SearchForm} from "@/ui/component/searchForm";
import {CommonUtils} from "@/common/utils/commonUtils";
import {couldDownLoad, timeIsCorrect} from "../common";
import {getAttendTotalList, downloadAttendTotal} from "@redux-actions/report/serviceReport";
import {User} from "@/common/beans/user";

class Attendance extends Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            breadCrumbRoutes: [
                {
                    name: '报表'
                },
                {
                    name: '服务类报表'
                },
                {
                    name: '出席报告'
                }
            ],
            searchConfig: [
                {
                    type: 'months',
                    label: '年月',
                    name: {
                        start: 'startDate',
                        end: 'endDate'
                    },
                    startInitialValue: moment(),
                    endInitialValue: moment()
                },
            ],
            columns: [
                {
                    title: '年月',
                    dataIndex: 'courseYearMonth',
                },
                {
                    title: '应到出席人数',
                    dataIndex: 'shoPeople',
                },
                {
                    title: '实际出席人数',
                    dataIndex: 'reaPeople',
                },
                {
                    title: '应到出席人次',
                    dataIndex: 'shoPeopleNum',
                },
                {
                    title: '实际出席人次',
                    dataIndex: 'reaPeopleNum',
                },
                {
                    title: '旷课人次',
                    dataIndex: 'adjPeopleNum',
                },
                {
                    title: '请假人次',
                    dataIndex: 'leaPeopleNum',
                },
                {
                    title: '出席率',
                    dataIndex: 'attendRate',
                },
                {
                    title: '旷课率',
                    dataIndex: 'truantRate',
                },
                {
                    title: '请假率',
                    dataIndex: 'leaveRate',
                },
                {
                    title: '消耗率',
                    dataIndex: 'consumeRate',
                },
            ],
            dataSource: [],             // 数据项
            startDate: moment(),
            endDate: moment(),
            lastSyncDatetime: null,     // 数据有效时间
            totalSize: 0,
            pageNo: 1,
            pageSize: 10,
        };
    }

    render() {
        const {
            breadCrumbRoutes, searchConfig, dataSource, lastSyncDatetime,
            columns, totalSize, pageNo, pageSize,
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
                        <div className="ml30 mb20">
                            <button
                                className="gym-button-sm gym-button-default gym-look-detail"
                                onClick={this.toDetail}
                            >
                                查看出席明细
                            </button>
                        </div>

                        <TablePagination
                            columns={columns}
                            dataSource={dataSource}
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
    /*查询*/
    onSearch = (value) => {
        const {startDate, endDate} = value;
        if (startDate.valueOf() > endDate.valueOf()) {
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
            this.getAttendanceList,
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

    /**
     * 生成查询参数
     * @return object 参数对象
     */
    createParams = () => {
        const {startDate, endDate} = this.state;
        return {
            currentCenterId: User.currentCenterId,
            startDate: startDate.valueOf(),
            endDate: endDate.valueOf(),
        }
    };

    /*查询出席报告*/
    getAttendanceList = () => {
        const {pageNo, pageSize, startDate, endDate} = this.state;
        // 首先验证开始时间是否小于结束时间
        if (timeIsCorrect(startDate.valueOf(), endDate.valueOf())) {
            const params = {
                ...this.createParams(),
                pageNo, pageSize,
            };
            getAttendTotalList(params).then(res => {
                const {lastSyncDatetime, list, pageNo, pageSize, totalSize} = res;
                this.setState({
                    dataSource: list,
                    lastSyncDatetime: lastSyncDatetime || Date.now(),
                    pageNo, pageSize, totalSize,
                });
            });
        }
    };

    /*跳转到详情页*/
    toDetail = () => {
        const {startDate, endDate} = this.state;
        const params = CommonUtils.stringify({
            startDate: startDate.valueOf(),
            endDate: endDate.valueOf()
        });
        this.props.history.push({
            pathname: `${Routes.出席报告详情.link}/${params}`,
        });
    };

    /*翻页*/
    handleChangePage = (data) => {
        this.setState(
            {
                pageNo: data.pageNo,
                pageSize: data.pageSize,
            },
            this.getAttendanceList,
        );
    };

    /*下载报表*/
    handleDownLoadExcel = () => {
        if(couldDownLoad(this.state.dataSource)) {
            const params = this.createParams();
            downloadAttendTotal(params);
        }
    }
}

export default Attendance;
