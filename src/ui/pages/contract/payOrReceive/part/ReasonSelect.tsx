/**
 * desc: 选择leads 输入框
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/11/2
 * Time: 上午10:15
 */
import React from 'react';
import ReactDOM from 'react-dom';
import {Button, Input, Modal, Table, message} from "antd";
import {Pagination} from "../../../../component/pagination";
import {form} from "../../../../../common/decorator/form";
import {
    searchLeadsInContract
} from "@redux-actions/payOrReceiveContract";
import {User} from "../../../../../common/beans/user";
import moment from "moment";

@form()

class ReasonSelect extends React.Component <any, any>{
    input: any;
    state = {
        pager:{
            currentPage: 1,
            pageSize: 10,
            totalSize:0
        },
        dataList: [],
        contractModalVisible:false,
        contractCode:'',
        contractId:'',
        contractReasonName:'',
        relatedFinancialRecordId:''
    };

    componentWillReceiveProps(nextProps){
        this.setState({
            contractReasonName: nextProps.contractReasonName
        })
    }
    /**
     * 选择leads
     */
    selectContract = () => {
        this.setState({contractModalVisible: true});
        this.props.form.resetFields();
        const inputElement:any = ReactDOM.findDOMNode(this.input);
        inputElement.blur();
        this.searchContract()
    };
    /**
     * 关闭弹窗
     */
    closeModal = () => {
        this.setState({contractModalVisible: false})
    };
    /**
     * 分页操作控制
     */
    handleChangePage = () => {
        searchLeadsInContract({
            leadsId: this.props.leadsId, //this.props.leadsId,
            currentCenterId: User.currentCenterId,
            financialContentList: [33001, 33004, 33005, 33006, 33007, 33009],
            hasPayment: 1,
            hasBinding: 0,
            isDelete: 0,
            pageNo:this.state.pager.currentPage,
            pageSize:this.state.pager.pageSize
        }).then((res:any) => {
            this.setState({
                dataList:res.list,
                pager:{
                    currentPage: res.pageNo,
                    pageSize: res.pageSize,
                    totalSize: res.totalSize
                }
            });
        }, (err:any) => {
            message.error(err.msg)
        })
    };

    /**
     * 查询合同编号
     */
    searchContract = () => {
        searchLeadsInContract({
            leadsId: this.props.leadsId, //this.props.leadsId,
            currentCenterId: User.currentCenterId,
            financialContentList: [33001, 33004, 33005, 33006, 33007, 33009],
            hasPayment: 1,
            hasBinding: 0,
            isDelete: 0,
            pageNo:this.state.pager.currentPage,
            pageSize:this.state.pager.pageSize
        }).then((res:any) => {
            this.setState({
                dataList:res.list,
                pager:{
                    currentPage: res.pageNo,
                    pageSize: res.pageSize,
                    totalSize: res.totalSize
                }
            });
        }, (err:any) => {
            message.error(err.msg)
        })
    };

    /**
     * 选择一个可以收款或者付款的合同
     */
    choose = (contract:any) => {
        let that = this;
        that.set(contract);
        that.setState({
            contractModalVisible: false,
            financialContent: contract.financialContent,
            contractId: contract.contractId,
            relatedFinancialRecordId: contract.financialId
        });

        if(contract.financialContent === 33001){
            that.setState({
                contractReasonName: '定金'
            });
        }else if(contract.financialContent === 33002){
            that.setState({
                contractReasonName: '合同'
            });
        }else if(contract.financialContent === 33003){
            that.setState({
                contractReasonName: '转中心'
            });
        }else if(contract.financialContent === 33004){
            that.setState({
                contractReasonName: '材料'
            });
        }else if(contract.financialContent === 33005){
            that.setState({
                contractReasonName: '活动'
            });
        }else if(contract.financialContent === 33006){
            that.setState({
                contractReasonName: '玩具'
            });
        }else if(contract.financialContent === 33007){
            that.setState({
                contractReasonName: '其他'
            });
        }else if(contract.financialContent === 33008){
            that.setState({
                contractReasonName: '改包'
            });
        }else if(contract.financialContent === 33009){
            that.setState({
                contractReasonName: '注册费'
            });
        }
    };

    /**
     * 赋值选中的宝宝信息
     * @param company
     */
    set = (contract:any) => {
        const { setChosenReasonByContract } = this.props;
        setChosenReasonByContract(contract);
    };

    render(){
        const {contractModalVisible, dataList, contractReasonName, pager} = this.state;
        //表格column
        const columns:any = [{
            title: '宝宝姓名',
            dataIndex: 'babyName',
            key: 'babyName',
        }, {
            title: '月龄',
            dataIndex: 'monthAge',
            key: 'monthAge'
        },{
            title: '原由',
            dataIndex: 'financialContent',
            key: 'financialContent',
            render: (text:number) => {
                const options = new Map([
                    [33001, '定金'],
                    [33002, '合同'],
                    [33003, '转中心'],
                    [33004, '材料'],
                    [33005, '活动'],
                    [33006, '玩具'],
                    [33007, '其他'],
                    [33008, '改包'],
                    [33009, '注册费'],
                ])
                return  <span>{options.get(text) ? options.get(text): ''}</span>
            }
        },{
            title: '收款金额',
            dataIndex: 'financialAmount',
            key: 'financialAmount'
        },{
            title: '合同编号',
            dataIndex: 'contractCode',
            key: 'contractCode'
        },{
            title: '已付金额',
            dataIndex: 'refundedAmount',
            key: 'refundedAmount'
        },{
            title: '收款日期',
            dataIndex: 'financialDate',
            key: 'financialDate',
            render: (text:string) => {
                return(
                    <div>
                        {
                            text
                                ? moment(parseInt(text)).format('YYYY-MM-DD')
                                : ''
                        }
                    </div>
                )
            }
        },{
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            align: 'left',
            render: (text: string, record: any) => {
                //选择某一个宝宝带出leadsId
                return (
                    <Button size={`small`} className='gym-contract-btn-default' onClick={() => this.choose(record)}>
                        选择
                    </Button>
                )
            }
        }];

        return (
            <div>
                <Modal
                    className='gym-select-leads-modal'
                    title={'选择付款原由'}
                    visible={contractModalVisible}
                    footer={false}
                    onCancel={this.closeModal}
                    centered={true}
                >
                    <div>
                        <Table
                            columns={columns}
                            pagination={false}
                            bordered={false}
                            dataSource={dataList}
                            rowKey={'financialId'}
                        />
                        <br/>
                        <Pagination
                            pageSizeOptions={['10','20','50']}
                            defaultCurrent={pager.currentPage}
                            total={pager.totalSize}
                            pageSize={pager.pageSize}
                            onChange={this.handleChangePage}
                        />
                    </div>
                </Modal>
                <Input
                    style={{width:'200px'}}
                    ref={(ref:any) => {this.input = ref}}
                    autoComplete='off'
                    placeholder={'请选择'}
                    onFocus={this.selectContract}
                    value={contractReasonName}
                    disabled={this.props.leadsId == ''}
                />
            </div>
        )
    }
}

export {ReasonSelect}
