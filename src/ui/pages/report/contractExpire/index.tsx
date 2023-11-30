/**
 * desc: 合同到期提醒报表
 * User: Lyon.li@gymboglobal.com
 * Date: 2019/1/30
 * Time: 上午20：00
 */
import React, {Component, Fragment} from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {SearchForm} from "@/ui/component/searchForm";
import {TablePagination} from "@/ui/component/tablePagination";
import FullScreen from '../components/fullScreen';
import {getContractExpireData, downloadContractExpireExcel} from "@redux-actions/report/achievement";
import {User} from "@/common/beans/user";
import {couldDownLoad, formatter} from "../common";
import {Routes} from "@/router/enum/routes";
import {CommonUtils} from "@/common/utils/commonUtils";
import moment from "moment";

class ContractExpire extends Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            breadCrumbRoutes: [
                {
                    name: '报表'
                },
                {
                    name: '业绩类报表'
                },
                {
                    name: '合同到期提醒'
                }
            ],
            searchConfig: [
                {
                    type: 'number',
                    label: '剩余课时(节次)<=',
                    name: 'remainCourseNum',
                    colon: false,   // 去掉冒号
                    props: {
                        min: 0,
                        max: 999,
                        precision: 0,
                        formatter: value => {
                            return Number.isNaN(+value) ? '' : value;
                        }
                    },
                },
                {
                    type: 'number',
                    label: '剩余有效期(月)<=',
                    name: 'remainingMonthNum',
                    colon: false,   // 去掉冒号
                    props: {
                        min: 0,
                        max: 999,
                        precision: 0,
                        formatter: value => {
                            return Number.isNaN(+value) ? '' : value;
                        }
                    },
                },
            ],
            columns: [
                {
                    title: '合同编号',
                    dataIndex: 'contractCode',
                    render: (text, record) => {
                        const {contractCode, id} = record;
                        const href = `${Routes.合同详情.link}${CommonUtils.stringify({contractCode, contractId: id})}`
                        return (
                            <a target="_blank" href={href}>
                                {text}
                            </a>
                        )
                    }
                },
                {
                    title: '宝宝姓名',
                    dataIndex: 'customerName',
                    width: 150,
                },
                {
                    title: '父亲',
                    dataIndex: 'fatherName',
                },
                {
                    title: '母亲',
                    dataIndex: 'motherName',
                },
                {
                    title: 'GB',
                    dataIndex: 'staffName',
                },
                {
                    title: 'GA',
                    dataIndex: 'gaStaffName',
                },
                {
                    title: '课程包类型',
                    dataIndex: 'packageType',
                },
                {
                    title: '课包课时',
                    dataIndex: 'packageCourse',
                },
                {
                    title: '赠课课时',
                    dataIndex: 'freeCourse',
                },
                {
                    title: '到期日',
                    dataIndex: 'endDate',
                    render: (text) => text ? moment(text).format(formatter) : '',
                },
                {
                    title: '剩余课时',
                    dataIndex: 'remainCourse',
                },
                {
                    title: '剩余有效期(天)',
                    dataIndex: 'remainDay',
                },
            ],             // 表单配置
            dataSource: [],                 // 数据项
            remainCourseNum: undefined,     // 课时数
            remainingMonthNum: undefined,   // 剩余月数
            lastSyncDatetime: null,         // 数据有效时间
            totalSize: 0,
            pageNo: 1,                      // 页数
            pageSize: 10,                   // 每页请求条数
        }
    }

    render() {
        const {
            breadCrumbRoutes, searchConfig, columns, dataSource, lastSyncDatetime,
            totalSize, pageNo, pageSize
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
    /*查询数据*/
    onSearch = (data) => {
        this.setState(
            {
                ...data,
                pageNo: 1,
                totalSize: 0,
            },
            this.getContractExpireList,
        );
    };

    /*重置查询条件*/
    onReset = (data) => {
        this.setState(
            {
                ...data,
            }
        )
    };

    /*生成参数的方法*/
    createParams = () => {
        const {remainCourseNum, remainingMonthNum} = this.state;
        return {
            remainCourseNum,
            remainingMonthNum,
            currentCenterId: User.currentCenterId,
        }
    };

    /*查询合同过期提醒列表*/
    getContractExpireList = () => {
        const { pageNo, pageSize } = this.state;
        const params = {
            ...this.createParams(),
            pageNo,
            pageSize,
        };
        getContractExpireData(params).then(res => {
            const {list, pageNo, totalSize} = res;
            this.setState({
                dataSource: list,
                pageNo,
                totalSize,
                lastSyncDatetime: Date.now(),
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
            this.getContractExpireList,
        );
    };

    /*导出excel*/
    handleDownLoadExcel = () => {
        if (couldDownLoad(this.state.dataSource)) {
            const data = this.createParams();
            downloadContractExpireExcel(data);
        }
    };
}

export default ContractExpire;
