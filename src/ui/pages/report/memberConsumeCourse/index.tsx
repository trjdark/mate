/**
 * desc: 会员耗课统计报表
 * User: Lyon.li@gymboglobal.com
 * Date: 2019/1/30
 * Time: 上午20：00
 */
import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {TablePagination} from "@/ui/component/tablePagination";
import FullScreen from '../components/fullScreen';
import {SearchForm} from "@/ui/component/searchForm";
import {getConsumeCourseList, downloadConsumeCourse} from "@redux-actions/report/serviceReport";
import {couldDownLoad} from "../common";
import {User} from "@/common/beans/user";

class MemberConsumeCourse extends Component<any, any> {
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
                    name: '会员排课耗课统计'
                }
            ],
            searchConfig: [
                {
                    type: 'rangePicker',
                    label: '选择日期',
                    name: 'queryDate',
                    initialValue: [moment().startOf('month'), moment(),]
                },
            ],
            columns: [
                {
                    title: '宝宝姓名',
                    dataIndex: 'babyName',
                    width: 150,
                },
                {
                    title: '月龄',
                    dataIndex: 'babyMonth',
                },
                {
                    title: '合同状态',
                    dataIndex: 'contractStatus',
                },
                {
                    title: '课程包类型',
                    dataIndex: 'packageType',
                },
                {
                    title: '课程包名称',
                    dataIndex: 'packageName',
                },
                {
                    title: '剩余课时',
                    dataIndex: 'remainingCourseNum',
                },
                {
                    title: '已上课时',
                    dataIndex: 'attendNum',
                },
                {
                    title: '选课课时',
                    dataIndex: 'selectedNum',
                },
                {
                    title: '合约频次',
                    dataIndex: 'contractFrequency',
                },
                {
                    title: '排课频次',
                    dataIndex: 'bookFrequency',
                },
                {
                    title: '出席频次',
                    dataIndex: 'attendFrequency',
                },
                {
                    title: '出席频次/排课频次',
                    dataIndex: 'attendBookFrequency',
                },
                {
                    title: '出席频次/合约频次',
                    dataIndex: 'attendContractFrequency',
                },
                {
                    title: 'GB',
                    dataIndex: 'gbStaffName',
                },
                {
                    title: 'GA',
                    dataIndex: 'gaStaffName',
                },
            ],             // 表单配置
            dataSource: [],             // 数据项
            startDate: moment().startOf('month'),
            endDate: moment().endOf('day'),
            lastSyncDatetime: null,     // 数据有效时间
            totalSize: 0,
            pageNo: 1,          // 页数
            pageSize: 10,       // 每页请求条数
        }
    }

    render() {
        const {
            breadCrumbRoutes, columns, dataSource, lastSyncDatetime,
            totalSize, pageNo, pageSize, searchConfig
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
                            rowKey={item => item.leadsId}
                            scroll={{x: 2000}}
                            handleChangePage={this.handleChangePage}
                        />
                    </FullScreen>
                </div>
            </Fragment>
        );
    }

    componentDidMount() {
        // 默认加载数据
    }

    /*查询*/
    onSearch = (value) => {
        const {queryDate} = value;
        this.setState(
            {
                startDate: queryDate[0].startOf('day'),
                endDate: queryDate[1].endOf('day'),
                pageNo: 1,
                totalSize: 0,
            },
            this.getConsumeList,
        );
    };

    /*重置*/
    onReset = (value) => {
        const {queryDate} = value;
        this.setState(
            {
                startDate: queryDate[0],
                endDate: queryDate[1],
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

    /*查询耗课列表*/
    getConsumeList = () => {
        const {pageNo, pageSize} = this.state;
        const params = {
            ...this.createParams(),
            pageNo,
            pageSize,
        };
        getConsumeCourseList(params).then(res => {
            const {list, pageNo, pageSize, totalSize} = res;
            this.setState({
                dataSource: list,
                lastSyncDatetime: Date.now(),
                pageNo, pageSize, totalSize,
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
            this.getConsumeList,
        );
    };

    /*导出excel*/
    handleDownLoadExcel = () => {
        if (couldDownLoad(this.state.dataSource)) {
            downloadConsumeCourse(this.createParams());
        }
    };
}

export default MemberConsumeCourse;
