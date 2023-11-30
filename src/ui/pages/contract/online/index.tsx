/**
 * desc:
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2020/5/6
 * Time: 下午5:01
 */
import React from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {SearchForm} from "@/ui/component/searchForm";
import {User} from "@/common/beans/user";
import {getPaymentList, downloadPaymentExcel} from "@redux-actions/contract";
import {TablePagination} from "@/ui/component/tablePagination";
import moment from "moment";

class OnlineContractList extends React.Component<any, any>{
    private routes:Array<any> = [
        {
            name: '合同',
            path: '',
            link: '#',
            id: 'contract'
        },{
            name: '合同管理',
            path: '',
            link: '#',
            id: 'contractManagement'
        },{
            name: '线上订单交易明细',
            path: '',
            link: '#',
            id: 'contractManagementOnlineList'
        }
    ];
    constructor(props:any){
        super(props);
        this.state = {
            pageNo:1,
            pageSize: 10,
            contractCode:null,
            payStartTime:null,
            payEndTime: null
        }
    }
    componentDidMount(){
        this.handleSearch();
    }
    searchConfig:Array<any> = [
        {
            label: '合同号',
            required: false,
            type: 'text',
            placeholder: '请输入',
            name: 'contractCode'
        },{
            label: '交易日期',
            required: false,
            type: 'dates',
            name: {
                start: 'payStartTime',
                end: 'payEndTime',
            },
        },
    ];
    handleSearch = () => {
        const params = {
            pageNo: this.state.pageNo,
            pageSize: this.state.pageSize,
            currentCenterId: User.currentCenterId,
            contractCode: this.state.contractCode,
            payStartTime: this.state.payStartTime ? this.state.payStartTime.startOf('day').valueOf() : null,
            payEndTime: this.state.payEndTime ? this.state.payEndTime.endOf('day').valueOf(): null,
        };
        getPaymentList(params).then((res) => {
            this.setState({
                dataSource: res.list,
                totalSize:res.totalSize
            })
        })
    };
    onSearch = (values:any) => {
        this.setState({
            ...values,
            pageNo:1,
        },this.handleSearch);
    };
    handleChangePage = (pageInfo) => {
        this.setState(pageInfo, this.handleSearch);
    };
    columns = () => {
        const {pageNo, pageSize} = this.state;
        return [
            {
                title: '序号',
                dataIndex: 'active',
                render: (text:any, record:any, index:number) => (pageNo - 1) * pageSize + index + 1
            },{
                title: '合同号',
                dataIndex: 'contractCode',
            },{
                title: '宝宝姓名',
                dataIndex: 'babyName',
            },{
                title: '课程包',
                dataIndex: 'packageName',
            },{
                title: '课程包实付金额',
                dataIndex: 'contractRealAmount',
            },{
                title: '注册费',
                dataIndex: 'registAmount',
            },{
                title: '订单号',
                dataIndex: 'orderNo',
            },{
                title: '交易日期',
                dataIndex: 'payTime',
                render: (text:number) => text ? moment(text).format("YYYY-MM-DD") : null
            },{
                title: '交易类型',
                dataIndex: 'payType',
            },{
                title: '交易金额',
                dataIndex: 'payAmount',
            },{
                title: '交易状态',
                dataIndex: 'payStatus',
            },{
                title: '支付流水号',
                dataIndex: 'serialNo',
            },
        ];
    }
    /**
     * 导出
     */
    handleExport = () => {
        const {payStartTime, payEndTime, contractCode} = this.state;
        const param = {
            currentCenterId: User.currentCenterId,
            contractCode: contractCode,
            payStartTime:payStartTime ? payStartTime.startOf('day').valueOf() : null,
            payEndTime: payEndTime ? payEndTime.endOf('day').valueOf() : null,
        };
        downloadPaymentExcel(param);
    };
    render(){
        const {dataSource, totalSize, pageNo, pageSize} = this.state;

        return(
            <div id="gym-contract-online">
                <BreadCrumb routes={this.routes}/>
                <div className="page-wrap">
                    <SearchForm items={this.searchConfig}
                                onSearch={this.onSearch}
                    />
                    <div className="mb25">
                        <button className="gym-button-default gym-button-xs" onClick={this.handleExport}>导出</button>
                    </div>
                    <TablePagination
                        style={{marginTop:'-5px'}}
                        columns={this.columns()}
                        rowKey={'serialNo'}
                        dataSource={dataSource}
                        totalSize={totalSize}
                        pageSize={pageSize}
                        handleChangePage={this.handleChangePage}
                        pageNo={pageNo}
                        scroll={{x: 2000}}
                    />
                </div>
            </div>
        )
    }
}

export {OnlineContractList}
