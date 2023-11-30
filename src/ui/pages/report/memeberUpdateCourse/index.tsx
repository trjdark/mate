/**
 * desc: 会员升班提醒报表
 * User: Lyon.li@gymboglobal.com
 * Date: 2019/1/30
 * Time: 上午20：00
 */
import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {SearchForm} from "@/ui/component/searchForm";
import {TablePagination} from "@/ui/component/tablePagination";
import FullScreen from '../components/fullScreen';
import {formatter, couldDownLoad} from "../common";
import {User} from "@/common/beans/user";
import {getMemberUpdateData, downloadMemberUpdate} from "@redux-actions/report/serviceReport";

class MemberUpdateCourse extends Component<any, any> {
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
                    name: '即将升班宝宝明细'
                }
            ],
            searchConfig: [
                {
                    type: 'number',
                    label: '升班日期(月)<=',
                    name: 'upgradeTime',
                    colon: false,   // 去掉冒号
                    props: {
                        min: 1,
                        max:999,
                        precision: 0,
                        formatter: value => {
                            return Number.isNaN(+value) ? '' : value;
                        }
                    }
                },
            ],
            columns: [
                {
                    title: '宝宝姓名',
                    dataIndex: 'babyName',
                    width: 150,
                },
                {
                    title: '出生日期',
                    dataIndex: 'birthday',
                    render: (text) => text ? moment(text).format(formatter) : '',
                },
                {
                    title: 'GB',
                    dataIndex: 'gbName',
                },
                {
                    title: 'GA',
                    dataIndex: 'gaName',
                },
                {
                    title: '当前课程',
                    dataIndex: 'courseCode',
                },
                {
                    title: '已上课程数',
                    dataIndex: 'attendNum',
                },
                {
                    title: '已选未上数',
                    dataIndex: 'selectNum',
                },
                {
                    title: '出勤率',
                    dataIndex: 'attendRate',
                },
                {
                    title: '升班日期',
                    dataIndex: 'nextCourseDate',
                    render: (text) => text ? moment(text).format(formatter) : '',
                },
                {
                    title: '升班课程',
                    dataIndex: 'nextCourseCode',
                },
                {
                    title: '升班课程已选未上数',
                    dataIndex: 'nextCourseselectNum',
                }
            ],             // 表单配置
            dataSource: [],             // 数据项
            updateTime: undefined,      // 升班日期
            lastSyncDatetime: null,     // 数据有效时间
            totalSize: 0,
            pageNo: 1,          // 页数
            pageSize: 10,       // 每页请求条数
        }
    }

    render() {
        const {
            breadCrumbRoutes, columns, dataSource, lastSyncDatetime,
            totalSize, pageNo, pageSize, searchConfig,
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
        const {upgradeTime} = this.state;
        return {
            currentCenterId: User.currentCenterId,
            upgradeTime,
        }
    };

    /*查询升班提醒列表*/
    getUpdateCourseList = () => {
        const {pageNo, pageSize} = this.state;
        const params = {
            ...this.createParams(),
            pageNo, pageSize,
        };
        getMemberUpdateData(params).then(res => {
            const {pageNo, totalSize, list} = res;
            this.setState({
                pageNo, totalSize,
                dataSource: list,
                lastSyncDatetime: Date.now(),
            });
        })
    };

    /*查询*/
    onSearch = (value) => {
        this.setState(
            {
                ...value,
                pageNo: 1,
                totalSize: 0,
            },
            this.getUpdateCourseList,
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
            this.getUpdateCourseList,
        );
    };

    /*导出excel*/
    handleDownLoadExcel = () => {
        if (couldDownLoad(this.state.dataSource)) {
            downloadMemberUpdate(this.createParams());
        }
    };
}

export default MemberUpdateCourse;
