/**
 * desc: description
 * User: colin.lu
 * Date: 2018/9/01
 * Time: 上午10:00
 */

import React from 'react';
import {Link} from "react-router-dom";
import {BreadCrumb} from "../../../component/breadcrumb";
import {item, SearchForm} from "../../../component/searchForm";
import {TablePagination} from "../../../component/tablePagination";
import {form} from "../../../../common/decorator/form";
import {expensesStatus, payOthersReasons} from "../enum/contract";
import {Tabs, message} from "antd";
import {Modal} from "../../../component/customerCreateModal";
import {Routes} from "@/router/enum/routes";
import {User} from "../../../../common/beans/user";
import {
    getPayAndReceiveManagement,
    deletePayAndReceive, getUnContractDetail
} from "@redux-actions/payOrReceiveContract";
import moment from "moment";
import {CommonUtils} from "../../../../common/utils/commonUtils";
import history from "../../../../router/history";
import {selectTransPayReasonType} from "@/saga/selectors/contract";
import {connect} from "@/common/decorator/connect";
import {SafeCalculate} from "@/common/utils/commonUtils";

const TabPane = Tabs.TabPane;

const searchConfigOther:item[] = [
    {
        label: '宝宝姓名',
        type: 'text',
        placeholder: '请输入',
        name: 'babyName'
    },{
        label: '合同编号',
        type: 'text',
        placeholder: '请输入',
        name: 'contractCode'
    },{
        label: '收支状态',
        type: 'select',
        name: 'hasPayment',
        placeholder: '请选择',
        options: expensesStatus
    },{
        label: '原由',
        type: 'select',
        name: 'financialContent',
        options: payOthersReasons
    },{
        label: '付款日期',
        type: 'rangePicker',
        name: 'receiveDate'
    },{
        label: '记账日期',
        type: 'rangePicker',
        name: 'recordDate'
    }
];

@form()
@connect((state:any) => ({
    payReasonStatus: selectTransPayReasonType(state)
}), {})

class ContractActionPayOther extends React.Component<any, any> {
    //路由代码块
    private routes:Array<any> = [
        {
            name: '合同',
            path: '',
            link: '#',
            id: 'contract'
        },{
            name: '收付款管理',
            path: '',
            link: '#',
            id: 'contractManagement'
        },{
            name: '付款管理',
            path: '',
            link: '#',
            id: 'contractManagementPayReceive'
        }
    ];

    constructor(props: any) {
        super(props);
    }

    state = {
        table:{
            list: [],
            //分页的数据
            pageNo: 1,
            pageSize: 10,
            totalSize: 0,
        },
        //tab切换
        tabId: 'other',
        defaultActiveKey: 'other',
        activeKey: 'other',
        tagType: 'other',
        //modal
        visible: false,
        id: '',
        financialContent:'',
        contractCode:'',
        hasPayment:'',
        babyName:'',
        payStartDate: null,
        payEndDate: null,
        createStartDate: null,
        createEndDate: null,
    };

    componentDidMount() {
        this.handleSearch({});
    }

    /**
     * 改变tab key
     */
    onChangeTab = (activeKey) => {
        if(activeKey === 'contract'){
            history.push(Routes.合同付款管理合同.path)
        }else if(activeKey === 'other') {

        }else if(activeKey === 'trans') {
            history.push(Routes.合同付款管理转中心.path)
        }else if(activeKey === 'package') {
            history.push(Routes.合同付款管理改包.path)
        }else if(activeKey === 'refund') {
            history.push(Routes.合同付款管理部分退费.path)
        }
    };

    /**
     * delete操作
     */
    deleteDetail = (record) => {
        // 查询收款信息
        getUnContractDetail({
            currentCenterId:User.currentCenterId,
            id:record.financialRecordId
        }).then((res) => {
            if(res.hasPayment === record.hasPayment){
                this.setState({
                    visible: true,
                    id: record.financialRecordId
                })
            }else{
                message.warning('该其他收付款操作已改变，请刷新页面后再尝试!', 5);
                this.handleSearch({});
                return false
            }
        }, (err) => {
            // 返回请求reject
            message.error(err.msg)
        });
    };

    onCancel = () => {
        this.setState({
            visible: false,
            id: ''
        })
    };

    onOk = () => {
        this.setState({
            visible: false,
        });

        const postData = {
            id: this.state.id,
            currentCenterId: User.currentCenterId
        };

        deletePayAndReceive(postData).then(()=>{
            message.success('删除付款记录成功!');
            this.handleSearch({})
        }, (err:any) => {
            message.error(err)
        })
    };

    /**
     *查询列表
     */
    handleSearch = (body:any) => {
        this.setState({
            financialContent: body.financialContent,
            contractCode: body.contractCode,
            hasPayment: body.hasPayment,
            babyName: body.babyName,
            payStartDate: body.receiveDate != undefined?moment(body.receiveDate[0]).startOf('day').valueOf():undefined,
            payEndDate: body.receiveDate != undefined?moment(body.receiveDate[1]).endOf('day').valueOf():undefined,
            createStartDate: body.recordDate != undefined?moment(body.recordDate[0]).startOf('day').valueOf():undefined,
            createEndDate: body.recordDate != undefined?moment(body.recordDate[1]).endOf('day').valueOf():undefined
        });

        let postData = {};
        if(this.state.tagType === 'other'){
            postData = {
                intent: 'withdraw',
                tagType: this.state.tagType,
                financialContent: body.financialContent,
                pageNo: 1,
                pageSize: this.state.table.pageSize,
                currentCenterId: User.currentCenterId,
                contractCode: body.contractCode,
                hasPayment: body.hasPayment,
                babyName: body.babyName,
                payStartDate: body.receiveDate != undefined?moment(body.receiveDate[0]).startOf('day').valueOf():undefined,
                payEndDate: body.receiveDate != undefined?moment(body.receiveDate[1]).endOf('day').valueOf():undefined,
                createStartDate: body.recordDate != undefined?moment(body.recordDate[0]).startOf('day').valueOf():undefined,
                createEndDate: body.recordDate != undefined?moment(body.recordDate[1]).endOf('day').valueOf():undefined
            };
        }else{
            postData = {
                intent: 'withdraw',
                tagType: this.state.tagType,
                financialContent: body.financialContent,
                pageNo: 1,
                pageSize: this.state.table.pageSize,
                currentCenterId: User.currentCenterId,
                contractCode: body.contractCode,
                hasPayment: body.hasPayment,
                babyName: body.babyName,
                payStartDate: body.receiveDate != undefined?moment(body.receiveDate[0]).startOf('day').valueOf():undefined,
                payEndDate: body.receiveDate != undefined?moment(body.receiveDate[1]).endOf('day').valueOf():undefined,
                createStartDate: body.recordDate != undefined?moment(body.recordDate[0]).startOf('day').valueOf():undefined,
                createEndDate: body.recordDate != undefined?moment(body.recordDate[1]).endOf('day').valueOf():undefined
            };
        }
        /**
         * 收付款列表
         * @param someParam<>
         * @method post
         * @response  res<>
         */
        this.setState({
            table:{
                list:[]
            }
        });
        getPayAndReceiveManagement(postData).then((res) => {
            this.setState({
                table:res
            })
        }, (err) => {
            //返回请求reject
            message.error(err)
        })
    };

    handleTableChange = (body:any) => {
        let postData = {};
        if(this.state.tagType === 'other'){
            postData = {
                intent: 'withdraw',
                tagType: this.state.tagType,
                financialContent: this.state.financialContent,
                pageNo: this.state.table.pageNo,
                pageSize: this.state.table.pageSize,
                currentCenterId: User.currentCenterId,
                contractCode: this.state.contractCode,
                hasPayment: this.state.hasPayment,
                babyName: this.state.babyName,
                payStartDate: this.state.payStartDate,
                payEndDate: this.state.payEndDate,
                createStartDate: this.state.createStartDate,
                createEndDate: this.state.createEndDate,
            }
        }else{
            postData = {
                intent: 'withdraw',
                tagType: this.state.tagType,
                financialContent: this.state.financialContent,
                pageNo: this.state.table.pageNo,
                pageSize: this.state.table.pageSize,
                currentCenterId: User.currentCenterId,
                contractCode: this.state.contractCode,
                hasPayment: this.state.hasPayment,
                babyName: this.state.babyName,
                payStartDate: this.state.payStartDate,
                payEndDate: this.state.payEndDate,
                createStartDate: this.state.createStartDate,
                createEndDate: this.state.createEndDate
            }
        }

        /**
         * 收付款列表
         * @param someParam<>
         * @method post
         * @response  res<>
         */
        getPayAndReceiveManagement(postData).then((res) => {
            this.setState({
                table:res
            })
        }, (err) => {
            //返回请求reject
            message.error(err)
        })
    };

    /**
     * 查询
     */
    handleChangeOther = (values:any) => {
        this.handleSearch(values)
    };

    /**
     * 分页变化
     * @param pageInfo
     */
    handleChangePageOther = (pageInfo:any) => {
        this.state.table.pageNo = pageInfo.pageNo;
        this.state.table.pageSize = pageInfo.pageSize;
        this.setState({
            table: {
                pageNo: this.state.table.pageNo,
                pageSize: this.state.table.pageSize,
            }
        });
        this.handleTableChange({});
    };

    /**
     *检查状态
     */
    checkStatus = (record:any) => {
        /**
         * api
         * @param someParam<>
         * @method post
         */

        // 查询收款信息
        getUnContractDetail({
            currentCenterId:User.currentCenterId,
            id:record.financialRecordId
        }).then((res) => {
            if(res.hasPayment === record.hasPayment){
                history.push(`${Routes.确认其他付款.link}${CommonUtils.stringify({
                    leadsId:record.leadsId,
                    contractCode:record.contractCode,
                    contractId:record.contractId,
                    financialContent:record.financialContent,
                    financialRecordId:record.financialRecordId,
                    gbName:record.gbName,
                    monthAge:record.monthAge,
                    customerName:record.customerName,
                })}`)
            }else{
                message.warning('该其他收付款操作已改变，刷新页面后再尝试!', 5);
                this.handleSearch({});
                return false
            }
        }, (err) => {
            //返回请求reject
            message.error(err.msg)
        });
    };

    render() {
        const {table, visible} = this.state;
        const {payReasonStatus} = this.props;

        const columnsOther = [
            {
                title: '宝宝姓名',
                dataIndex: 'customerName',
                key: 'customerName',
                width: 150
            }, {
                title: '合同编号',
                dataIndex: 'contractCode',
                key: 'contractCode',
                className:'gym-contract-other-column-width'
            }, {
                title: '原由',
                dataIndex: 'financialContent',
                key: 'financialContent',
                width: 90,
                render: (text:string) => {
                    const res = payReasonStatus.filter((item:any) => item.code === text);
                    return res.length > 0 ? res[0].codeValue : '-';
                }
            }, {
                title: '应付金额',
                dataIndex: 'estimatedAmount',
                key: 'estimatedAmount',
                width: 150,
                render: (num:number) => SafeCalculate.autoZero(num)
            }, {
                title: '付款金额',
                dataIndex: 'amount',
                key: 'amount',
                width: 150,
                render(text:number, record:any) {
                    if(record.hasPayment === 1){
                        return SafeCalculate.autoZero(text)
                    }else{
                        return '';
                    }
                }
            }, {
                title: '收支状态',
                dataIndex: 'hasPaymentName',
                key: 'hasPaymentName',
                width: 100
            }, {
                title: '付款日期',
                dataIndex: 'financialDate',
                key: 'financialDate',
                width: 150,
                render(text:string, record:any) {
                    if(text && text !== ''){
                        return moment(text).format('YYYY-MM-DD');
                    }else{
                        return ''
                    }
                }
            }, {
                title: '记账日期',
                dataIndex: 'lastUpdateDate', // createDate
                key: 'lastUpdateDate',
                width: 150,
                render(text:any, record:any) {
                    if(text && record.hasPayment === 1){
                        return moment(text).format('YYYY-MM-DD');
                    }else{
                        return '';
                    }
                }
            }, {
                title: 'GB',
                dataIndex: 'gbName',
                key: 'gbName',
                width: 150
            }, {
                title: 'GA',
                dataIndex: 'gaName',
                key: 'gaName',
                width: 150
            }, {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                width: 250,
                render: (text:string, record:any) => (
                    <div>
                        {
                            record.hasPayment === 0 &&
                            <span className='span-link'>
                                <button onClick={() => {this.checkStatus(record)}} className='gym-button-xxs gym-button-white mr5'>付款</button>
                            </span>
                        }
                        {
                            record.hasPayment === 1 &&
                            <span className='span-link'>
                                <button onClick={() => {this.checkStatus(record)}} className='gym-button-xxs gym-button-white mr5'>查看</button>
                            </span>
                        }
                        {
                            record.hasPayment === 0 &&
                            <button onClick={()=>this.deleteDetail(record)} className='gym-button-xxs gym-button-white mr5'>删除</button>
                        }
                    </div>
                )
            }];

        return (
            <div id={`gym-contract-receive`}>
                <BreadCrumb routes={this.routes} />
                <div className='gym-contract'>
                    <Tabs
                        defaultActiveKey={this.state.defaultActiveKey}
                        onChange={this.onChangeTab}
                        activeKey={this.state.activeKey}
                        type="card"
                        tabBarGutter={10}
                    >
                        <TabPane tab="合同" key="contract">
                            <div className='page-wrap gym-contract-tab-content'>
                            </div>
                        </TabPane>
                        <TabPane tab="其他" key="other">
                            <div className='page-wrap gym-contract-tab-content'>
                                <SearchForm
                                    items={searchConfigOther}
                                    onSearch={this.handleChangeOther}
                                />
                                <Link to={`${Routes.新建付款申请.path}?type=pay`}>
                                    <button  className='gym-button-xs gym-button-default mb20 ml30'>+&nbsp;新增</button>
                                </Link>
                                <TablePagination
                                    columns={columnsOther}
                                    rowKey={'financialRecordId'}
                                    dataSource={table.list || []}
                                    totalSize={table.totalSize}
                                    pageSize={table.pageSize}
                                    handleChangePage={this.handleChangePageOther}
                                    pageNo={table.pageNo}
                                />
                            </div>
                        </TabPane>
                        <TabPane tab="转中心" key="trans">
                            <div className='page-wrap gym-contract-tab-content'>
                            </div>
                        </TabPane>
                        <TabPane tab="改包" key="package">
                            <div className='page-wrap gym-contract-tab-content'>
                            </div>
                        </TabPane>
                        <TabPane tab="部分退费" key="refund">
                            <div className='page-wrap gym-contract-tab-content'>
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
                <Modal
                    visible={visible}
                    handleOk={this.onOk}
                    handleCancel={this.onCancel}
                    contentText={`是否确认删除？`}
                />
            </div>
        )
    }
}

export {ContractActionPayOther}
