/**
 * desc: 未发货订单明细
 * User: Lyon.li@gymboglobal.com
 * Date: 2019/7/4
 * Time: 上午10:38
 */
import React, {Component, Fragment} from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {couldDownLoad, formatterMoney as formatter, thumbText} from "@/ui/pages/report/common";
import {Table, } from "@/ui/component/tablePagination";
import {getUnShippedOrder, downloadUnShippedOrder} from "@redux-actions/report/pos";
import {CommonUtils, SafeCalculate} from "@/common/utils/commonUtils";

class UnshippedOrder extends Component<any, any> {
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
            name: '未发货订单明细'
        }
    ];
    private columns = [
        {
            title: '订单编号',
            dataIndex: 'ppsNumber',
        },
        {
            title: '订单日期',
            dataIndex: 'recordDate',
        },
        {
            title: '商品编号',
            dataIndex: 'materialNumber',
        },
        {
            title: '商品名称',
            dataIndex: 'materialDesc',
            render(text) {
                return thumbText(text);
            }
        },
        {
            title: '商品数量',
            dataIndex: 'count',
        },
        {
            title: '商品单价',
            dataIndex: 'price',
            render(text) {
                return text === "总计" ? text : formatter(text || 0);
            }
        },
        {
            title: '商品金额',
            dataIndex: 'excludTaxValue',
            render(text) {
                return formatter(text || 0);
            }
        },
    ];

    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            companyCode:'',
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
        if (CommonUtils.hasParams(this.props)) {
            const routerParams = CommonUtils.parse(this.props);
            if (routerParams.hasOwnProperty('companyCode')) {
                const {companyCode} = routerParams;
                this.setState({
                    companyCode
                },function(){
                    this.getUnShippedOrderDetail();
                });
            }
        }
    }

    /* 获取未发货订单明细 */
    getUnShippedOrderDetail = () => {
        const {companyCode} = this.state;
        const params = {
            companyCode,
        }
        getUnShippedOrder(params).then(res => {
            let data=res||[];
            if(data.length){
                const totalArr=res.map((item)=>(item.excludTaxValue||0));

                data.push({
                    price:'总计',
                    excludTaxValue:SafeCalculate.add(...totalArr)
                });
            }
            this.setState({
                dataSource: data
            });
        })
    };

    /* 下载 */
    handleDownLoadExcel = () => {
        const {companyCode} = this.state;
        const params = {
            companyCode,
        }
        if(this.state.dataSource.length<1)return;
        if(couldDownLoad(this.state.dataSource)){
            downloadUnShippedOrder(params);
        }
    };
}

export default UnshippedOrder;
