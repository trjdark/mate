/**
 * desc: 预付款余额明细
 * User: Lyon.li@gymboglobal.com
 * Date: 2019/7/4
 * Time: 上午10:38
 */
import React, {Component, Fragment} from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {Table, } from "@/ui/component/tablePagination";
import {couldDownLoad, formatterMoney as formatter, thumbText} from "@/ui/pages/report/common";
import {getAdvancePayment, downloadAdvancePayment} from "@redux-actions/report/pos";
import {SafeCalculate} from "@/common/utils/commonUtils";
import {Icon} from "@/ui/component/icon";
import {Popover} from "antd";

class AdvancePayment extends Component<any, any> {
    private breadCrumbRoutes = [
        {
            name: '报表'
        },
        {
            name: '中心查询'
        },
        {
            name: '订货额度'
        },
        {
            name: '中心欠款余额明细'
        }
    ];

    private columns = [
        {
            title: '中心编号',
            dataIndex: 'centerNo',
            width:100
        },
        {
            title: '收款公司',
            dataIndex: 'companyName',
            width: 120,
            render(text) {
                return thumbText(text, 10);
            }
        },
        {
            title: '收款项目',
            dataIndex: 'project',
            width: 80
        },
        {
            title: '单据编号',
            dataIndex: 'billNumber',
            width: 150
        },
        {
            title: '到期日',
            dataIndex: 'startDate',
            width: 120
        },
        {
            title: <Fragment>
                    <Popover content={<div className="gym-report-advance-payment-desc">账龄天数注释：正数为欠款逾期天数，负数为即将到期天数</div>}>
                        <Icon type="wenda" className="gym-report-advance-payment-icon"/>账龄（天）
                    </Popover>
                    </Fragment>,
            dataIndex: 'billAge',
            width:80
        },
        {
            title: '中心应付款',
            dataIndex: 'debitAmount',
            width:120,
            render(text) {
                return formatter(text || 0);
            }
        },
        {
            title: '中心已付款',
            dataIndex: 'loanAmount',
            width:120,
            render(text) {
                return formatter(text || 0);
            }
        },
        {
            title: '中心欠款余额',
            dataIndex: 'unwrittenAmount',
            width:120,
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
            dataSource: [],
        }
    }

    render(): React.ReactNode {
        const {dataSource} = this.state;
        return (
            <Fragment>
                <BreadCrumb routes={this.breadCrumbRoutes}/>
                <div className="page-wrap">
                        <button
                            className={`gym-button-sm mb30 ml30 ${dataSource.length > 0 ? 'gym-button-default' : 'gym-button-greyb'}`}
                            onClick={this.handleDownLoadExcel}
                        >
                            导出
                        </button>
                        <Table
                            columns={this.columns}
                            dataSource={dataSource}
                            rowKey={item => item.id}
                        />
                </div>
            </Fragment>
        )
    }

    componentDidMount(): void {
        this.getAdvancePaymentDetail();
    }

    /*获取预付款余额明细数据*/
    getAdvancePaymentDetail = () => {
        getAdvancePayment().then(res => {
            let result=res||[];
            let totalDebitAmount=[],totalLoanAmount=[],totalAnwrittenAmount=[];
            result.map((item)=>{
                const {debitAmount=0,loanAmount=0,unwrittenAmount=0}=item;
                totalDebitAmount.push(Number(debitAmount));
                totalLoanAmount.push(Number(loanAmount));
                totalAnwrittenAmount.push(Number(unwrittenAmount));
            });
            result.push({
                "billAge":'总计',
                'debitAmount':SafeCalculate.add(...totalDebitAmount),
                'loanAmount':SafeCalculate.add(...totalLoanAmount),
                'unwrittenAmount':SafeCalculate.add(...totalAnwrittenAmount),
                'id':'unique'
            });
            this.setState({
                dataSource: result
            });
        })
    };

    /* 下载 */
    handleDownLoadExcel = () => {
        if(this.state.dataSource.length<1)return;
        if (couldDownLoad(this.state.dataSource)) {
            downloadAdvancePayment(undefined)
        }
    }
}

export default AdvancePayment;
