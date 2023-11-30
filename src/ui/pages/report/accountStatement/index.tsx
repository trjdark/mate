/**
 * desc: 对账单明细
 * User: Lyon.li@gymboglobal.com
 * Date: 2019/7/4
 * Time: 上午10:38
 */
import React, {Component, Fragment} from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {SearchForm} from "@/ui/component/searchForm";
import {TablePagination} from "@/ui/component/tablePagination";
import {couldDownLoad, formatterMoney as formatter, thumbText} from "@/ui/pages/report/common";
import {getAccountStatement, downloadAccountStatement} from "@redux-actions/report/pos";

class AccountStatement extends Component<any, any> {
    private breadCrumbRoutes = [
        {
            name: '报表'
        },
        {
            name: '中心查询'
        },
        {
            name: '对账单明细'
        }
    ];

    private columns = [
        {
            title: '中心编号',
            dataIndex: 'centerNo',
        },
        {
            title: '收款公司',
            dataIndex: 'companyName',
        },
        {
            title: '收支项目',
            dataIndex: 'project',
        },
        {
            title: '单据编号',
            dataIndex: 'billNumber',
        },
        {
            title: '到期日',
            dataIndex: 'startDate',
        },
        {
            title: '中心欠款',
            dataIndex: 'debitAmount',
            render(text) {
                return formatter(text || 0);
            }
        },
        {
            title: '中心已付款',
            dataIndex: 'loanAmount',
            render(text) {
                return formatter(text || 0);
            }
        },
        {
            title: '摘要',
            dataIndex: 'desc',
            render(text) {
                return thumbText(text);
            }
        },
    ];

    constructor(props) {
        super(props);
        this.state = {
            searchConfig: [
                {
                    type: 'rangePicker',
                    label: '查询期间',
                    name: 'effectDate',
                    initialValue: []
                },
            ],
            dataSource: [],
            totalSize: 0,
            endDate: undefined,
            startDate: undefined,
            pageNo: 0,
            pageSize: 10,
        }
    }

    render(): React.ReactNode {
        const {searchConfig, dataSource, totalSize, pageNo, pageSize} = this.state;
        return (
            <Fragment>
                <BreadCrumb routes={this.breadCrumbRoutes}/>
                <div className="page-wrap">
                    <SearchForm
                        items={searchConfig}
                        onSearch={this.onSearch}
                        onReset={this.onReset}
                    />
                        <button
                            className={`gym-button-sm mb30 ml30 ${dataSource.length > 0 ? 'gym-button-default' : 'gym-button-greyb'}`}
                            onClick={this.handleDownLoadExcel}
                        >
                            导出
                        </button>
                        <TablePagination
                            columns={this.columns}
                            dataSource={dataSource}
                            totalSize={totalSize}
                            pageNo={pageNo}
                            pageSize={pageSize}
                            rowKey={item => item.id}
                            handleChangePage={this.handleChangePage}
                        />
                </div>
            </Fragment>
        )
    }

    componentDidMount(): void {}

    /* 条件查询 */
    onSearch = (data) => {
        const {effectDate} = data;
        this.setState(
            {
                startDate: effectDate[0],
                endDate: effectDate[1],
            },
            this.getAccountStatementDetail
        )
    };

    /* 重置查询条件 */
    onReset = (data) => {
        const {effectDate} = data;
        this.setState(
            {
                startDate: effectDate[0],
                endDate: effectDate[1],
            }
        )
    };

    /* 生成参数 */
    createParams = () => {
        const {endDate, pageNo, pageSize, startDate} = this.state;
        return {
            startDate: startDate ? startDate.valueOf() : null,
            endDate: endDate ? endDate.valueOf() : null,
            pageNo,
            pageSize,
        }
    };

    /* 分页 */
    handleChangePage = (data) => {
        this.setState(
            {
                ...data,
            },
            this.getAccountStatementDetail
        )
    };

    /*获取对账单数据*/
    getAccountStatementDetail = () => {
        getAccountStatement(this.createParams()).then(res => {
            const {list, totalSize, pageNo} = res;
            this.setState({
                dataSource: list,
                totalSize,
                pageNo,
            });
        })
    };

    /* 下载 */
    handleDownLoadExcel = () => {
        if (couldDownLoad(this.state.dataSource)) {
            downloadAccountStatement(this.createParams());
        }
    };
}

export default AccountStatement;
