/**
 * desc:
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2022/9/27
 * Time: 下午3:38
 */
import React, {Fragment} from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {CommonUtils} from "@/common/utils/commonUtils";
import {User} from "@/common/beans/user";
import {queryArBillDetail, exportBillDetail} from "@redux-actions/report/pos";
import {Table} from "@/ui/component/tablePagination";
import {Icon} from "@/ui/component/icon";
import {Popover} from "antd";

export class ARBillDetail extends React.Component<any, any>{
    BREAD_CRUMB_ROUTE = [
        {name: '报表', id: 'report'},
        {name: '中心管理', id: 'center-manager'},
        {name: '月度AR账单', id: 'bill'},
        {name: '月度AR明细', id: 'bill-detail'}
    ];
    companyCode:string = null;
    endMonth:number = null;
    constructor(props){
        super(props)
        if(CommonUtils.hasParams(props)){
            this.companyCode = CommonUtils.parse(props).companyCode;
            this.endMonth = CommonUtils.parse(props).endMonth;
        }
        this.state = {
            dataSource: []
        }
    }
    componentDidMount(){
        const param = {
            endMonth: this.endMonth,
            companyCode: this.companyCode,
            centerNo: User.centerCode
        }
        queryArBillDetail(param).then(res => {
            this.setState({dataSource: res})
        })
    }
    columns = [
        {
            title: '中心编号',
            dataIndex: 'centerCode'
        },{
            title: '收款公司',
            dataIndex: 'companyName'
        },{
            title: '收款项目',
            dataIndex: 'projectName'
        },{
            title: '清账日期',
            dataIndex: 'augDate'
        },{
            title: '到期日',
            dataIndex: 'endDate'
        },{
            title: <Fragment>
                <Popover content={<div className="gym-report-advance-payment-desc">账龄天数注释：正数为欠款逾期天数，负数为即将到期天数</div>}>
                    <Icon type="wenda" className="gym-report-advance-payment-icon"/>账龄（天）
                </Popover>
            </Fragment>,
            dataIndex: 'billAge'
        },{
            title: '金额',
            dataIndex: 'credit',
            render: (text:number) => <span>{CommonUtils.toThousands(text)}</span>
        },{
            title: '摘要',
            dataIndex: 'desc'
        },
    ];
    /**
     * 导出明细
     */
    handleExport = () => {
        const param = {
            endMonth: this.endMonth,
            companyCode: this.companyCode,
            centerNo: User.centerCode
        }
        exportBillDetail(param)
    };
    render(){
        const {dataSource} = this.state;
        return(
            <Fragment>
                <BreadCrumb routes={this.BREAD_CRUMB_ROUTE}/>
                <div className='page-wrap'>
                    <button className="gym-button-sm gym-button-default mb25" onClick={this.handleExport}>导出</button>
                    <Table
                        dataSource={dataSource}
                        columns={this.columns}
                        rowKey='id'
                    />
                </div>
            </Fragment>
        )
    }
}
