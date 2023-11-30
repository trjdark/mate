/**
 * desc: 账户余额
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2020/3/20
 * Time: 下午2:12
 */
import React, {Component} from 'react';
import {User} from "@/common/beans/user";
import moment from 'moment';
import {TablePagination} from "@/ui/component/tablePagination";
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {getCusReportInfo, getPayHistory} from "@redux-actions/telephone/callRecords";

class Account extends Component<any, any>{
    private routes:Array<any> = [
        {
            name: '云语音',
            path: '',
            link: '#',
            id: 'telephone'
        },{
            name: '账户余额',
            path: '',
            link: '#',
            id: 'account'
        }
    ];
    private tabsConfig = [
        {
            id:1,
            name: "账户缴费记录",
            value: "1"
        },{
            id:2,
            name: "服务账单",
            value: "2"
        }
    ];
    constructor(props:any){
        super(props)
        this.state = {
            infoType: "1",
            columns: [],
            dataSource: [],
            totalSize: 0,
            pageSize: 10,
            pageNo:1,
        }
    }
    componentDidMount(){
        this.queryAccountList();
    }
    setColumnsConfig = (key:string,) => {
        const columnsConfigs:any = new Map<string, any>([
            ['1', [
                {
                    title: '缴费金额',
                    dataIndex: 'fee',
                }, {
                    title: '账户余额',
                    dataIndex: 'customerMoney',
                }, {
                    title: '缴费类型',
                    dataIndex: 'type',
                },{
                    title:'缴费时间',
                    dataIndex:'payTime',
                    render:(text)=>(text && moment(text).format('YYYY-MM-DD')),
                },{
                    title: '缴费方式',
                    dataIndex: 'payMode',
                },{
                    title: '备注',
                    dataIndex: 'memo',
                }],],
            ['2', [
                {
                    title: '计费周期',
                    dataIndex: 'costScope',
                },{
                    title: '账户余额',
                    dataIndex: 'remainingPrice',
                },{
                    title: '到期时间',
                    dataIndex: 'endTime',
                    render:(text)=>(text && moment(text).format('YYYY-MM-DD HH:mm:ss')),
                },{
                    title: '费用总计',
                    dataIndex: 'costTotalPrice',
                },{
                    title: '时长总计',
                    dataIndex: 'timeTotalNum',
                }],],
        ]);
        return columnsConfigs.get(key);
    };
    /**
     * 切换标签
     * @param {string} value
     */
    handleChangeTab = (type:string) => {
        this.setState({infoType:type, columns: this.setColumnsConfig(type)}, this.queryAccountList);
    };
    /**
     * 获取数据
     */
    queryAccountList = () => {
        const {infoType, pageSize, pageNo,} = this.state;
        const param = {
            currentCenterId: User.currentCenterId,
            pageSize,
            pageNo,
            fromType: "1"
        };
        if(infoType === '1'){
            getPayHistory(param).then((res:any) => {
                this.setState({
                    dataSource:res.list,
                    totalSize: res.totalSize,
                    columns: this.setColumnsConfig(infoType)
                })
            })
        }else if(infoType === '2'){
            getCusReportInfo(param).then((res:any) => {
                this.setState({
                    dataSource:res.list,
                    totalSize: res.totalSize,
                    columns: this.setColumnsConfig(infoType)
                })
            })
        }
    };
    /**
     * 分页
     * @param pageInfo
     */
    handleChangePage = (pageInfo) => {
        this.setState({
            pageNo: pageInfo.pageNo,
            pageSize: pageInfo.pageSize,
            selectLeads: []
        }, this.queryAccountList);
    };
    render(){
        const {infoType, columns, dataSource, totalSize} = this.state;
        return(
            <div id="gym-telephone-account" className="gym-telephone-account">
                <BreadCrumb routes={this.routes}/>
                <div className="gym-telephone-account-tabs">
                    {
                        this.tabsConfig.map((item:any, index:number) => (
                            <div
                                key={index}
                                className={`gym-telephone-account-tab ${item.value === infoType ? 'active': ''}`}
                                onClick={() => this.handleChangeTab(item.value)}
                            >
                                <span>{item.name}</span>
                            </div>
                        ))
                    }
                </div>
                <div className="page-wrap gym-telephone-account-content">
                    <TablePagination
                        dataSource={dataSource}
                        columns={columns}
                        totalSize={totalSize}
                        rowKey={(item:any, index:number) => index}
                        handleChangePage={this.handleChangePage}
                    />
                </div>
            </div>
        )
    }
}

export {Account}
