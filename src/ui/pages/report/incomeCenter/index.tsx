/**
 * desc: 中心收入统计报表
 * User: Lyon.li@gymboglobal.com
 * Date: 2019/1/30
 * Time: 上午20：00
 */
import React, {Component, Fragment} from 'react';
import moment from "moment";
import {message} from "antd";
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {Table} from "@/ui/component/tablePagination";
import FullScreen from '../components/fullScreen';
import {SearchForm} from "@/ui/component/searchForm";
import {getIncomeCenterData, downloadIncomeCenterData} from "@redux-actions/report/financeReport";
import {User} from "@/common/beans/user";
import {couldDownLoad, formatNum} from '../common';

class IncomeCenter extends Component<any, any> {
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
                    name: '中心收入统计'
                }
            ],
            searchConfig: [
                {
                    type: 'months',
                    label: '查询年月',
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
                    title: '收付款内容',
                    dataIndex: 'incomeType',
                },
                {
                    title: '现金',
                    dataIndex: 'cash',
                    render: text => formatNum(text),
                },
                {
                    title: 'POS',
                    dataIndex: 'pos',
                    render: text => formatNum(text),
                },
                {
                    title: '支票',
                    dataIndex: 'cheque',
                    render: text => formatNum(text),
                },
                {
                    title: '银行转账',
                    dataIndex: 'transfer',
                    render: text => formatNum(text),
                },
                {
                    title: '微信支付',
                    dataIndex: 'wechatPay',
                    render: text => formatNum(text),
                },
                {
                    title: '支付宝',
                    dataIndex: 'alipay',
                    render: text => formatNum(text),
                },
                {
                    title: 'Total',
                    dataIndex: 'total',
                    render: text => formatNum(text),
                },
            ],             // 表单配置
            dataSource: [],             // 数据项
            startDate: moment(),
            endDate: moment(),
            lastSyncDatetime: null,     // 数据有效时间
        }
    }

    render() {
        const {breadCrumbRoutes, columns, dataSource, lastSyncDatetime, searchConfig} = this.state;
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
                        <div className="gym-table-wrap">
                            <Table
                                columns={columns}
                                dataSource={dataSource}
                                rowKey={item => item.incomeType}
                            />
                        </div>
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
            this.getIncomeCenterList,
        );
    };

    /*重置*/
    onReset = (value) => {
        this.setState(
            {
                ...value,
            },
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
        };
    };

    /*查询中心收入列表*/
    getIncomeCenterList = () => {
        const params = this.createParams();
        getIncomeCenterData(params).then(res => {
            const {list, lastSyncDatetime} = res;
            this.setState({
                lastSyncDatetime: lastSyncDatetime || null,
                dataSource: list,
            })
        })
    };

    /*导出excel*/
    handleDownLoadExcel = () => {
        if (couldDownLoad(this.state.dataSource)) {
            const data = this.createParams();
            downloadIncomeCenterData(data);
        }
    };
}

export default IncomeCenter;
