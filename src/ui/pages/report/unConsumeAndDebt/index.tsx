/**
 * desc: 未消耗负债
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2019/12/6
 * Time: 上午11:21
 */

import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {SearchForm} from "@/ui/component/searchForm";
import { downloadUnConsumeAndDebt} from "@redux-actions/report/financeReport";
import FullScreen from '../components/fullScreen';
import {couldDownLoad} from "@/ui/pages/report/common";
import {TablePagination} from "@/ui/component/tablePagination";
import {User} from "@/common/beans/user";
import {getUnConsumeAndDebtList} from "@redux-actions/report/financeReport";
import {formatNum,} from "../common";


class UnConsumeAndDebt extends Component<any, any>{
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
                    name: '未耗课金额统计(合营使用)'
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
                    dataIndex: 'contractDuration',
                },{
                    title: '合同类型',
                    dataIndex: 'contractType',
                }, {
                    title: '成长伙伴',
                    dataIndex: 'gbName',
                }, {
                    title: '客户名称',
                    dataIndex: 'customerName',
                }, {
                    title: '课程包',
                    dataIndex: 'packageName',
                }, {
                    title: '课程包课时',
                    dataIndex: 'packageCourseNum',
                }, {
                    title: '课程包实收金额',
                    dataIndex: 'packageActualAmount',
                    render: text => formatNum(text),
                },{
                    title: '赠送课时',
                    dataIndex: 'contractFreeCourseNum',
                },{
                    title: '注册费',
                    dataIndex: 'registerAmount',
                    render: text =>  formatNum(text),
                },{
                    title: '上月剩余金额',
                    dataIndex: 'beginningLiabilityAmount',
                    render: text => formatNum(text),
                },{
                    title: '上月剩余课时数',
                    dataIndex: 'beginningCourseNum',
                },{
                    title: '上月剩余赠课',
                    dataIndex: 'beginningFreeCourseNum',
                },{
                    title: '合同金额',
                    dataIndex: 'newCourseAmountSign',
                    render: text =>  formatNum(text),
                },{
                    title: '转入合同金额',
                    dataIndex: 'rollinCourseAmount',
                    render: text =>  formatNum(text),
                },{
                    title: '转出合同金额',
                    dataIndex: 'rolloutCourseAmount',
                    render: text =>  formatNum(text),
                },{
                    title: '改包金额',
                    dataIndex: 'modifyPackageAmount',
                    render: text =>  formatNum(text),
                },{
                    title: '退课金额',
                    dataIndex: 'refundCourseAmount',
                    render: text =>  formatNum(text),
                },{
                    title: '总收入',
                    dataIndex: 'totalRevenue',
                    render: text =>  formatNum(text),
                },{
                    title: '课时单价',
                    dataIndex: 'currentCoursePriceFinancial',
                    render: text =>  formatNum(text),
                },{
                    title: '耗课金额',
                    dataIndex: 'consumeCourseAmountTotal',
                    render: text =>  formatNum(text),
                },{
                    title: '总耗课数',
                    dataIndex: 'consumeCourseNumTotal',
                },{
                    title: '课程耗课数',
                    dataIndex: 'consumeCourseTeach',
                },{
                    title: '活动耗课数',
                    dataIndex: 'consumeCourseActivity',
                },{
                    title: '其他耗课数',
                    dataIndex: 'consumeCourseOther',
                },{
                    title: '赠课耗课数',
                    dataIndex: 'consumeCourseNumFree',
                },{
                    title: '新增赠课数',
                    dataIndex: 'newCourseNumFree',
                },{
                    title: '新签约课时数',
                    dataIndex: 'newCourseNumSign',
                },{
                    title: '转入课时数',
                    dataIndex: 'rollinCourseNum',
                },{
                    title: '转出课时数',
                    dataIndex: 'rolloutCourseNum',
                },{
                    title: '改包课时数',
                    dataIndex: 'modifyCourseNum',
                },{
                    title: '退课课时数',
                    dataIndex: 'refundCourseNum',
                },{
                    title: '作废赠课数',
                    dataIndex: 'invalidCourseNumFree',
                },{
                    title: '本期剩余金额',
                    dataIndex: 'endingLiabilityAmount',
                    render: text =>  formatNum(text),
                },{
                    title: '本期剩余课时数',
                    dataIndex: 'endingCourseNum',
                },{
                    title: '本期剩余赠课数',
                    dataIndex: 'endingFreeCourseNum',
                },{
                    title: '课程耗课金额',
                    dataIndex: 'consumeCourseAmountCourse',
                },{
                    title: '活动耗课金额',
                    dataIndex: 'consumeCourseAmountActivity',
                },{
                    title: '其他耗课金额',
                    dataIndex: 'consumeCourseAmountOther',
                }

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
        // 加载时默认请求数据
        this.initConsumeAndDebt();
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
        getUnConsumeAndDebtList(param)
            .then((res:any) => {
                this.setState({
                    dataSource: res.list,
                    totalSize: res.totalSize,
                    lastSyncDateTime: res.lastSyncDatetime
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
            downloadUnConsumeAndDebt(data);
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

export {UnConsumeAndDebt}
