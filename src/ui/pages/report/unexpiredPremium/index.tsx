/**
 * desc: 未到期权益金
 * User: Lyon.li@gymboglobal.com
 * Date: 2019/7/4
 * Time: 上午10:38
 */
import React, {Component, Fragment} from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {Table, } from "@/ui/component/tablePagination";
import {couldDownLoad, formatterMoney as formatter, thumbText} from "@/ui/pages/report/common";
import {getUnexpiredPremium, downloadUnexpiredPremium} from "@redux-actions/report/pos";

class UnexpiredPremium extends Component<any, any> {
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
            name: '未到期余额明细'
        }
    ];
    private columns = [
        {
            title: '凭证号码',
            dataIndex: 'billNumber',
        },
        {
            title: '到期日',
            dataIndex: 'startDate',
        },
        {
            title: '金额',
            dataIndex: 'unwrittenAmount',
            render(text) {
                return formatter(text || 0);
            }
        },
        {
            title: '备注',
            dataIndex: 'desc',
            render(text) {
                return thumbText(text);
            }
        },
    ];

    constructor(props) {
        super(props);
        this.state = {
            dataSource: []
        }
    }

    render(): React.ReactNode {
        const {dataSource} = this.state;
        return (
            <Fragment>
                <BreadCrumb routes={this.breadCrumbRoutes}/>
                <div className="page-wrap">
                        <Table
                            columns={this.columns}
                            dataSource={dataSource}
                            rowKey={item => item.id}
                        />
                </div>
            </Fragment>
        )
    }

    componentDidMount() {
        this.getUnexpiredPremiumDetail();
    }

    /*获取未到期权益金明细*/
    getUnexpiredPremiumDetail = () => {
        getUnexpiredPremium().then(res => {
            this.setState({
                dataSource: res
            });
        });
    };

    /* 下载 */
    handleDownLoadExcel = () => {
        if(this.state.dataSource.length<1)return;
        if (couldDownLoad(this.state.dataSource)) {
            downloadUnexpiredPremium(undefined);
        }
    }
}

export default UnexpiredPremium;
