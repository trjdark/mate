/**
 * desc: description
 * User: colin.lu
 * Date: 2018/9/01
 * Time: 上午10:00
 */

import React from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {item, SearchForm} from "@/ui/component/searchForm";
import {TablePagination} from "@/ui/component/tablePagination";
import {form} from "@/common/decorator/form";
import {expensesStatus} from "../enum/contract";
import {Tabs, message, Modal} from "antd";
import {Routes} from "@/router/enum/routes";
import {User} from "@/common/beans/user";
import {
    getPayAndReceiveManagement,
    deletePayAndReceive,
    getContractDetailAmount, returnContract
} from "@redux-actions/payOrReceiveContract";
import moment from "moment";
import {CommonUtils, SafeCalculate} from "@/common/utils/commonUtils";
import history from "../../../../router/history";
import {FUNC} from "@/ui/pages/setting/enum/functions";
import {ConfirmCheck} from "@/ui/component/confirmCheck";

const TabPane = Tabs.TabPane;

const searchConfigCommon:Array<item> = [
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

class ContractActionPayPackage extends React.Component<any, any> {
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
        tabId: 'package',
        defaultActiveKey: 'package',
        activeKey: 'package',
        tagType: 'package',
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
            history.push(Routes.合同付款管理其他.path)
        }else if(activeKey === 'trans') {
            history.push(Routes.合同付款管理转中心.path)
        }else if(activeKey === 'package') {
        }
        else if(activeKey === 'refund') {
            history.push(Routes.合同付款管理部分退费.path)

        }
    };

    /**
     * delete操作
     */
    deleteDetail = (record) => {
        this.setState({
            visible: true,
            id: record.financialRecordId
        })

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
    handleChangePackage = (values:any) => {
        this.handleSearch(values)
    };

    /**
     * 分页变化
     * @param pageInfo
     */
    handleChangePagePackage = (pageInfo:any) => {
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
        const postData ={
            "aparId":record.aparId,
            "financialContent":35008,
            "leadsId":record.leadsId
        };

        // 查询收款信息
        getContractDetailAmount(postData).then((res) => {
            if(res.hasPayment === record.hasPayment){
                history.push(`${Routes.确认改包付款.link}${CommonUtils.stringify({
                    aparId:record.aparId,
                    leadsId:record.leadsId,
                    contractCode:record.contractCode,
                    contractId:record.contractId,
                    estimatedAmount:record.estimatedAmount
                })}`)
            }else{
                message.warning('该合同收付款操作已改变，刷新页面后再尝试!', 5);
                this.handleSearch({});
                return false
            }
        }, (err) => {
            // 返回请求reject
            message.error(err.msg)
        });
    };
    /**
     * 退款
     * @param record
     */
    refund = (record:any) => {
        const param = {
            id: record.aparId,
            currentCenterId: User.currentCenterId
        };
        returnContract(param).then((res) => {
            message.success('退回成功！', 2, () => {
                this.handleSearch({});
            })

        });
    };
    render() {
        const {table, visible} = this.state;
        const columns = [
            {
                title: '宝宝姓名',
                dataIndex: 'customerName',
                key: 'customerName',
            }, {
                title: '合同编号',
                dataIndex: 'contractCode',
                key: 'contractCode',
            }, {
                title: '原由',
                dataIndex: 'financialContentType',
                key: 'financialContentType',
                render(text) {
                    if(text === '0'){
                        return '';
                    }else if(text === '4'){
                        return '退课';
                    }else if(text === '2'){
                        return '改包';
                    }else if(text === '3'){
                        return '转中心';
                    }
                }
            }, {
                title: '应付金额',
                dataIndex: 'estimatedAmount',
                key: 'estimatedAmount',
                render: (num:number) => SafeCalculate.autoZero(num)
            }, {
                title: '付款金额',
                dataIndex: 'amount',
                key: 'amount',
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
            }, {
                title: '付款日期',
                dataIndex: 'financialDate',
                key: 'financialDate',
                render(text) {
                    if(text && text != null){
                        return moment(text).format('YYYY-MM-DD');
                    }else{
                        return '';
                    }
                }
            }, {
                title: '记账日期',
                dataIndex: 'lastUpdateDate', // createDate
                key: 'lastUpdateDate',
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
                render: (text:string, record:any) => (
                    <div>
                        {
                            record.hasPayment === 0 && this.state.tagType === 'package' &&
                            <div className='span-link'>
                                <button onClick={() => {this.checkStatus(record)}} className='gym-button-xxs gym-button-white mr15'>付款</button>
                                {
                                    User.permissionList.includes(FUNC['改包退回']) &&
                                    <ConfirmCheck
                                        button={'退回'}
                                        item={record}
                                        ensure={this.refund}
                                        contentText={record.isElectronic ? <span className='size14'>退回后当前流程无法再次发起，且已签电子合同需手动作废，如需补签则需要新建流程。</span> : '是否确定退款？'}
                                    />
                                }
                            </div>
                        }
                        {
                            record.hasPayment === 1 && this.state.tagType === 'package' &&
                            <div className='span-link'>
                                <button onClick={() => {this.checkStatus(record)}} className='gym-button-xxs gym-button-white'>查看</button>
                            </div>
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
                            </div>
                        </TabPane>
                        <TabPane tab="转中心" key="trans">
                            <div className='page-wrap gym-contract-tab-content'>
                            </div>
                        </TabPane>
                        <TabPane tab="改包" key="package">
                            <div className='page-wrap gym-contract-tab-content'>
                                <SearchForm
                                    items={searchConfigCommon}
                                    onSearch={this.handleChangePackage}
                                />
                                <TablePagination
                                    style={{marginTop:'-5px'}}
                                    columns={columns}
                                    rowKey={'aparId'}
                                    dataSource={table.list || []}
                                    totalSize={table.totalSize}
                                    pageSize={table.pageSize}
                                    handleChangePage={this.handleChangePagePackage}
                                    pageNo={table.pageNo}
                                />
                            </div>
                        </TabPane>
                        <TabPane tab="部分退费" key="refund">
                            <div className='page-wrap gym-contract-tab-content'>
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
                <Modal
                    title="删除"
                    visible={visible}
                    onOk={this.onOk}
                    onCancel={this.onCancel}
                >
                    <div>
                        确定是否删除这条付款记录?
                    </div>
                </Modal>
            </div>
        )
    }
}

export {ContractActionPayPackage}
