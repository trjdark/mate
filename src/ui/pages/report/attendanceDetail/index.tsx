/**
 * desc: 出席报告详情
 * User: Lyon.li@gymboglobal.com
 * Date: 2019/2/18
 * Time: 下午15：30
 */
import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {cloneDeep} from 'lodash';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {TablePagination} from "@/ui/component/tablePagination";
import {SearchForm} from "@/ui/component/searchForm";
import FullScreen from '../components/fullScreen';
import {CommonUtils} from "@/common/utils/commonUtils";
import {getAttendDetailList, downloadDetailTotal} from "@redux-actions/report/serviceReport";
import {User} from "@/common/beans/user";
import {couldDownLoad} from "../common";

class AttendanceDetail extends Component<any, any> {
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
                    name: '出席报告明细'
                }
            ],
            columns: [
                {
                    title: '课程',
                    dataIndex: 'courseName',
                },
                {
                    title: '星期',
                    dataIndex: 'weekDay',
                },
                {
                    title: '上课日期',
                    dataIndex: 'courseDate',
                },
                {
                    title: '时间',
                    dataIndex: 'courseStartTime',
                },
                {
                    title: '教室',
                    dataIndex: 'classroomName',
                },
                {
                    title: '主要指导师',
                    dataIndex: 'majorInstructor',
                },
                {
                    title: '辅助指导师',
                    dataIndex: 'assistantInstructor',
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
                {
                    title: '耗课时数',
                    dataIndex: 'consumeTime',
                },
            ],             // 表单配置
            dataSource: [],             // 数据项
            searchConfig: [
                {
                    type: 'month',
                    label: '年月',
                    name: 'queryDate',
                    initialValue: moment(),
                    props: {
                        disabledDate: this.disabledDate
                    }
                },
            ],
            queryDate: moment(),      // 查询时间默认数据
            startDate: moment(),      // 起始时间
            endDate: moment(),        // 终止数据
            lastSyncDatetime: null,   // 数据有效时间
            totalSize: 0,
            pageNo: 1,          // 页数
            pageSize: 10,       // 每页请求条数
        };
    }

    render() {
        const {
            breadCrumbRoutes, columns, dataSource, lastSyncDatetime,
            searchConfig, totalSize, pageNo, pageSize,
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
                            totalSize={totalSize}
                            pageNo={pageNo}
                            pageSize={pageSize}
                            scroll={{x: 1500}}
                            rowKey={item => item.id}
                            handleChangePage={this.handleChangePage}
                        />
                    </FullScreen>
                </div>
            </Fragment>
        );
    }

    componentDidMount() {
        // 页面加载时，初始化时间数据并请求一次数据
        this.initState().then(res=>{
            this.getAttendanceListDetail();
        });
    }

    /*根据列表页带过来的数据，初始化部分查询时间区间数据*/
    initState = () => {
        return new Promise((resolve, reject) => {
            const {hasParams, parse} = CommonUtils;
            if (hasParams(this.props)) {
                const {startDate, endDate} = parse(this.props);
                const searchConfig = cloneDeep(this.state.searchConfig);
                searchConfig[0].initialValue = moment(startDate);
                this.setState(
                    {
                        startDate,
                        endDate,
                        searchConfig,
                        queryDate: moment(startDate)
                    },
                    () => resolve()
                );
            }
        });
    };

    /*限制日期选择控件的开始日期和结束日期*/
    disabledDate = (current) => {
        const {startDate, endDate} = this.state;
        return (current < moment(startDate) || current > moment(endDate));
    };

    /*查询*/
    onSearch = (value) => {
        this.setState(
            {
                ...value,
                pageNo: 1,
                totalSize: 0,
            },
            this.getAttendanceListDetail,
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
        const {queryDate} = this.state;
        return {
            currentCenterId: User.currentCenterId,
            startDate: queryDate.valueOf(),
            endDate: queryDate.valueOf(),
        }
    };

    /*查询会员连续未到提醒列表*/
    getAttendanceListDetail = () => {
        const {pageNo, pageSize} = this.state;
        const params = {
            ...this.createParams(),
            pageNo, pageSize,
        };
        getAttendDetailList(params).then(res => {
            const {pageNo, pageSize, totalSize, lastSyncDatetime, list} = res;
            this.setState({
                dataSource: list,
                pageNo, pageSize, totalSize,
                lastSyncDatetime: lastSyncDatetime || Date.now()
            });
        });
    };

    /*翻页*/
    handleChangePage = (data) => {
        this.setState(
            {
                pageNo: data.pageNo,
                pageSize: data.pageSize,
            },
            this.getAttendanceListDetail,
        );
    };

    /*导出excel*/
    handleDownLoadExcel = () => {
        if (couldDownLoad(this.state.dataSource)) {
            downloadDetailTotal(this.createParams());
        }
    };
}

export default AttendanceDetail;
