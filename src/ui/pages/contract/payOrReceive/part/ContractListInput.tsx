/**
 * desc: 选择leads 输入框
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/11/2
 * Time: 上午10:15
 */
import React from 'react';
import ReactDOM from 'react-dom';
import {Button, Input, Modal, Table, message} from "antd";
import {form} from "@/common/decorator/form";
import {
    searchContract
} from "@redux-actions/payOrReceiveContract";
import {User} from "@/common/beans/user";
import moment from "moment";
import {contract_type__format} from "@/ui/pages/contract/filter/contractFilter";

@form()

class ContractListInput extends React.Component <any, any>{
    input: any;
    state = {
        data: null,
        dataList: [],
        contractModalVisible:false,
        contractCode:'',
        contractId:'',
    };
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
        searchContract({
            leadsId: this.props.leadsId,
            currentCenterId: User.currentCenterId
        }).then((res:any) => {
            this.setState({
                data:res
            });
        }, (err:any) => {
            message.error(err.msg)
        })
    };

    /**
     * 查询合同编号
     */
    searchContract = () => {
        searchContract({
            leadsId: this.props.leadsId,
            currentCenterId: User.currentCenterId
        }).then((res:any) => {
            this.setState({
                data:res
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
            contractCode: contract.contractCode
        });
    };

    /**
     * 赋值选中的宝宝信息
     * @param company
     */
    set = (contract:any) => {
        const { setChosenContract } = this.props;
        setChosenContract(contract);
    };

    render(){
        const {contractModalVisible, data, contractCode} = this.state;
        //表格column
        const columns:any = [{
            title: '合同编号',
            dataIndex: 'contractCode',
            key: 'contractCode',
        }, {
            title: '合同类型',
            dataIndex: 'contractType',
            key: 'contractType',
            render: (text:string) => {
                return(
                    <div>
                        {
                            text? contract_type__format(text): ''
                        }
                    </div>
                )
            }
        }, {
            title: '起始日',
            dataIndex: 'effectiveTime',
            key: 'effectiveTime',
            render: (text:number) => {
                return(
                    <div>
                        {
                            text
                                ? <span>{moment(text).format('YYYY-MM-DD')}</span>
                                : ''
                        }
                    </div>
                )
            }
        }, {
            title: '到期日',
            dataIndex: 'endTime',
            key: 'endTime',
            render: (text:number) => {
                return(
                    <div>
                        {
                            text
                                ? <span>{moment(text).format('YYYY-MM-DD')}</span>
                                : ''
                        }
                    </div>
                )
            }
        }, {
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
                    title={'选择注册费对应的合同'}
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
                            dataSource={data}
                            rowKey={'id'}
                        />
                        <br/>
                    </div>
                </Modal>
                <Input
                    ref={(ref:any) => {this.input = ref}}
                    autoComplete='off'
                    placeholder={'请选择'}
                    onFocus={this.selectContract}
                    value={contractCode}
                    style={{width:'65%'}}
                />
            </div>
        )
    }
}

export {ContractListInput}
