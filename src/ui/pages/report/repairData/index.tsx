/**
 * desc: 期初数据修复表
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2020/4/14
 * Time: 下午5:04
 */
import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {SearchForm} from "@/ui/component/searchForm";
import { downloadRepairData} from "@redux-actions/report/financeReport";
import FullScreen from '../components/fullScreen';
import {couldDownLoad} from "@/ui/pages/report/common";
import {TablePagination} from "@/ui/component/tablePagination";
import {User} from "@/common/beans/user";
import { getRepairDataList, getRepairDataUpdateTime} from "@redux-actions/report/financeReport";
import {formatNum,} from "../common";


class RepairData extends Component<any, any>{
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
                    name: '期初数据修正表'
                }
            ],
            searchConfig:  [{
                type: 'month',
                label: '查询年月',
                name: 'periodMonth',
                initialValue: moment(),
            }],
            columns: [
                {
                    title: '合同号',
                    dataIndex: 'contractCode',
                },{
                    title: '合同有效期',
                    dataIndex: 'contractActiveDate',
                },{
                    title: '合同类型',
                    dataIndex: 'contractType',
                }, {
                    title: '成长伙伴',
                    dataIndex: 'gb',
                }, {
                    title: '客户名称',
                    dataIndex: 'customerName',
                }, {
                    title: '课程包',
                    dataIndex: 'packageName',
                }, {
                    title: '课程包课时',
                    dataIndex: 'packageNum',
                }, {
                    title: '课程包实收金额',
                    dataIndex: 'reallyAfterDiscountPrice',
                }, {
                    title: '赠送课时',
                    dataIndex: 'freeCourseNum',
                },{
                    title: '注册费',
                    dataIndex: 'registeredFee',
                    render: text =>  formatNum(text),
                },{
                    title: '上月剩余金额',
                    dataIndex: 'mateNaturalRemainingAmountFinacial',
                    render: text => formatNum(text),
                },{
                    title: '上月剩余课时数',
                    dataIndex: 'mateNaturalRemainingNumTotal',
                },{
                    title: '上月剩余赠课',
                    dataIndex: 'mateNaturalRemainingNumFree',
                },{
                    title: '上月剩余金额（月结）',
                    dataIndex: 'reportMonthlyRemainingAmountFinacial',
                },{
                    title: '上月剩余课时数（月结）',
                    dataIndex: 'reportMonthlyRemainingNumTotal',
                },{
                    title: '上月剩余赠课（月结）',
                    dataIndex: 'reportMonthlyRemainingNumFree',
                },


            ],
            periodMonth: moment(new Date()),
            lastSyncDatetime: null,     // 最后截止时间
            dataSource: [],             // 表格数据
            totalSize: 0,
            pageNo: 1,                  // 页数
            pageSize: 10,               // 每页请求条数
            lastSyncDateTime: 0,        // 更新时间
        }
    }
    componentDidMount() {
        const {pageNo, pageSize, periodMonth} = this.state;
        const param = {
            currentCenterId:User.currentCenterId,
            periodMonth:periodMonth.format("YYYY-MM"),
            pageNo,
            pageSize
        }
        Promise.all([
            getRepairDataList(param),
            getRepairDataUpdateTime({currentCenterId:User.currentCenterId})
        ]).then((res:any) => {
            const [listInfo, lastSyncDateTime] = res;
            this.setState({
                dataSource:listInfo.list,
                totalSize: listInfo.totalSize,
                lastSyncDateTime: lastSyncDateTime
            })
        })
    }
    /*初始化查询报表分页数据和总计数据*/
    initConsumeAndDebt = () => {
        const {pageNo, pageSize, periodMonth} = this.state;
        const param = {
            currentCenterId:User.currentCenterId,
            periodMonth:periodMonth.format("YYYY-MM"),
            pageNo,
            pageSize
        }
        getRepairDataList(param)
            .then((res:any) => {
                this.setState({
                    dataSource: res.list,
                    totalSize: res.totalSize,
                })
            })
    };

    /*查询*/
    onSearch = (value) => {
        this.setState({
                periodMonth:value.periodMonth,
                pageNo: 1,},
            this.initConsumeAndDebt,
        );
    };

    /*重置*/
    onReset = (value) => {
        this.setState(
            {
                ...value
            }
        );
    };
    /*导出excel*/
    handleDownLoadExcel = () => {
        if (couldDownLoad(this.state.dataSource)) {
            const {periodMonth} = this.state;
            const data = {
                currentCenterId: User.currentCenterId,
                periodMonth:periodMonth.format("YYYY-MM"),
            };
            downloadRepairData(data);
        }
    };
    /**
     * 翻页
     * @param data 分页数据
     */
    handleChangePage = (data) => {
        this.setState(
            {
                pageNo: data.pageNo,
                pageSize: data.pageSize,
            },
            this.initConsumeAndDebt,
        );
    };
    render(){
        const {
            breadCrumbRoutes, searchConfig, lastSyncDateTime, dataSource,
            columns,totalSize, pageNo, pageSize
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
                        lastSyncDatetime={lastSyncDateTime}
                        handleDownLoadExcel={this.handleDownLoadExcel}
                        canDownload={dataSource.length > 0}
                    >
                        <div className="gym-table-wrap">
                            <TablePagination
                                columns={columns}
                                dataSource={dataSource}
                                totalSize={totalSize}
                                pageNo={pageNo}
                                pageSize={pageSize}
                                scroll={{x: 3500}}
                                rowKey={item => item.id}
                                handleChangePage={this.handleChangePage}
                            />
                        </div>
                    </FullScreen>
                </div>
            </Fragment>
        )
    }
}

export { RepairData };
