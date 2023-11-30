/**
 * desc: 合同确认
 * User: colin.lu
 * Date: 2018/9/01
 * Time: 上午10:00
 */
import React, {Component} from 'react';
import {message} from 'antd';
import {TablePagination} from "../../../component/tablePagination";
import {SearchForm} from "../../../component/searchForm";
import {contractExpireList, ensureContract, exportContractExpireList} from "@redux-actions/contract";
import {connect} from "../../../../common/decorator/connect";
import {selectExpireContractTypes} from "../../../../saga/selectors/contract";
import {User} from "../../../../common/beans/user";
import moment from 'moment';
import {ConfirmCheck} from "../../../component/confirmCheck";
import {SafeCalculate} from "@/common/utils/commonUtils";
import {selectApprovalPermission} from '@/saga/selectors/home';
import {modalWrapper} from '@/ui/pages/teaching/component/modalWrapper';


// 二次确认内容
class Msg extends Component <any, any> {
    render(){
        const {message} = this.props;

        return (
            <div>
                <div>该合同为转中心合同，目前在"{message}"中心仍有剩余课时。点击过期合同确认收入后，将会同时确认"{message}"中心的剩余课时，且无法返还！</div>
                <br/>
                <div className='c-error'>请确认是否需要继续操作。</div>
            </div>
        )
    }
}

const Modal = modalWrapper(Msg)

@connect((state:any) => ({
    expireContractStatus: selectExpireContractTypes(state),
    staffPermission:selectApprovalPermission(state),
}))
class ContractActionListOverdue extends React.Component<any, any> {
    // 默认搜索栏 处理状态为"待处理"；
    private DEFAULT_DEAL_STATUS = '0';
    constructor(props: any) {
        super(props);
        this.state = {
            searchOption : {
                pageNo: 1,
                pageSize: 10,
                babyName: null,                                 // 宝宝姓名
                contractCode: null,                             // 合同编号
                currentCenterId: User.currentCenterId,
                dealStatus: this.DEFAULT_DEAL_STATUS
            },
            contractLeaveDate:{},                               // 请假列表对象
            isTransferCenterMsg: false,                         // 合同在其他中心有过期未确认的合同信息提示
            repeatCenterCode: '',                               // 重复中心号
            confirmContract: null,
        }
    }
    componentDidMount() {
        this.handleSearch();
    }
    /**
     * 搜索条件
     * @param 搜索
     */
    onSearch = (values:any) => {
        this.setState({ searchOption: Object.assign({}, this.state.searchOption, {
                ...values,
                approvalStartDate:values.approvalStartDate? values.approvalStartDate.startOf('day').valueOf() : null,
                approvalEndDate:values.approvalEndDate? values.approvalEndDate.endOf('day').valueOf() : null,
                pageNo:1,
                pageSize:this.state.searchOption.pageSize,
            })});
        this.handleSearch(values);
    };
    /**
     * 获取
     * @param body
     */
    handleSearch = (body:any = {}) => {
        const params = Object.assign({}, this.state.searchOption, {pageNo:1});
        contractExpireList(Object.assign({}, params, body))
            .then((res:any) => {
                this.setState({contractLeaveDate: res})
            })
    };
    /**
     * 合同分页搜索搜索
     * @param pageInfo
     */
    handleChangePage = (pageInfo:any) => {
        this.setState({searchOption: Object.assign({}, this.state.searchOption, pageInfo)});
        this.handleSearch(pageInfo);
    };
    /**
     * 确认审批
     */
    confirmContract =  (node:any) => {
        ensureContract(Object.assign({}, node, {
            currentCenterId:User.currentCenterId,
            confirmTag: 0
        })).then(() => {
            message.success('合同收入成功!');
            this.handleSearch(this.state.searchOption)
        }, (err) => {
            // 如果合同在其他中心有过期未确认的合同
            if(err.code === 9527){
                this.setState({
                    confirmContract:node,
                    isTransferCenterMsg: true,
                    repeatCenterCode: err.msg
                })
            }
        })
    };
    /**
     * 二次确认
     */
    confirmSureContract = (node:any) => {
        this.setState({isTransferCenterMsg: false})
        ensureContract(Object.assign({}, node, {
            currentCenterId:User.currentCenterId,
            confirmTag: 1
        })).then(() => {
            message.success('合同收入成功!');
            this.handleSearch(this.state.searchOption)
        })
    };
    /**
     * 显示操作按钮
     * @param node
     * @returns {any}
     */
    renderAction = (node:any) => {
        const {staffPermission} = this.props;
        const { financialApproval } = staffPermission
        // 过期合同待处理的 status Code,  如果是待处理显示确认按钮
        // const NONE_DEAL = expireContractStatus.filter((item:any) => item.codeValue === '待处理')[0] &&
        //     expireContractStatus.filter((item:any) => item.codeValue === '待处理')[0].code;
        if(node.dealStatus === '待处理'){
            const data:any = {
                contractNumber:node.contractCode,
                packageNum: node.packageNum,
                freeNum:node.freeNum,
                amount:node.price
            };
            return <ConfirmCheck
                        button={<button className={financialApproval ? `gym-button-xxs gym-button-white mr5` : 'gym-button-xxs gym-button-greyb'} disabled={!financialApproval}>确认</button>}
                        item={node}
                        contentText={undefined}
                        contractText='确定要计入收入吗？'
                        contentContractInfo={data}
                        ensure={this.confirmContract}
                    />
        }
        return node.confirmStaff;
    };
    /**
     * 搜索配置
     * @returns {Array<any>}
     */
    searchConfig = ():Array<any> => {
        const {expireContractStatus} = this.props;

        const newApprovalStatusList = expireContractStatus.map((item:any) => ({postCode: item.code, postName: item.codeValue}))
        return [
            {
                type: 'text',
                label: '宝宝姓名',
                name: 'babyName',
                placeholder: '请输入'
            },{
                type: 'text',
                label: '合同编号',
                name: 'contractCode',
                placeholder: '请输入'
            },{
                type: 'select',
                label: '处理状态',
                name: 'dealStatus',
                placeholder: '请选择',
                initialValue: this.DEFAULT_DEAL_STATUS,
                options: newApprovalStatusList,
            }
        ];
    };
    /**
     * 表头设置
     * @returns {({title: string; dataIndex: string; key: string} | {title: string; dataIndex: string; key: string; render: (num: number) => string} | {title: string; dataIndex: string; key: string; render: (text: number) => string} | {title: string; dataIndex: string; key: string; render: (text: string) => string} | {title: string; dataIndex: string; key: string; render: (date: number) => string} | {title: string; dataIndex: string; key: string; align: string; render: (text: string, record: any, index: number) => any})[]}
     */
    columns = () => {
        return [{
            title: '宝宝姓名',
            dataIndex: 'babyName',
            key: 'babyName',
        }, {
            title: '合同编号',
            dataIndex: 'contractCode',
            key: 'contractCode',
        }, {
            title: '当前剩余正课',
            dataIndex: 'packageNum',
            key: 'packageNum',
        }, {
            title: '当前剩余赠课',
            dataIndex: 'freeNum',
            key: 'freeNum',
        }, {
            title: '当前剩余金额',
            dataIndex: 'price',
            key: 'price',
            render: (num:number) => SafeCalculate.autoZero(num)
        }, {
            title: '合同到期日',
            dataIndex: 'endTime',
            key: 'endTime',
            render: (text:number) => moment(text).format("YYYY-MM-DD")
        }, {
            title: '处理状态',
            dataIndex: 'dealStatus',
            key: 'dealStatus',
        }, {
            title: 'GB',
            dataIndex: 'gbStaffName',
            key: 'gbStaffName',
        }, {
            title: 'GA',
            dataIndex: 'gaStaffName',
            key: 'gaStaffName',
        },{
            title: '本次确认金额',
            dataIndex: 'confirmAmount',
            key: 'confirmAmount',
        },{
            title: '本次确认正课',
            dataIndex: 'confirmPackageNum',
            key: 'confirmPackageNum',
        },{
            title: '本次确认赠课',
            dataIndex: 'confirmFreeNum',
            key: 'confirmFreeNum',
        },{
            title: '确认时间',
            dataIndex: 'confirmDate',
            key: 'confirmDate',
            render: (date:number) => date ? moment(date).format("YYYY-MM-DD") : ''
        }, {
            title: '操作',
            dataIndex: 'action',
            align: 'left',
            render: (text: string, record: any) => this.renderAction(record)
        }];
    };
    handleExport = () => {
        const params = Object.assign({}, this.state.searchOption);
        exportContractExpireList(params);
    }
    render() {
        const {searchOption, contractLeaveDate, isTransferCenterMsg, repeatCenterCode, confirmContract} = this.state;
        return (
            <div className='page-wrap mt2 gym-contract-operation-tab-content'>
                <SearchForm items={this.searchConfig()}
                            onSearch={this.onSearch}
                />
                <button
                    className={`gym-button-sm mb15 ${(contractLeaveDate.list || []).length > 0 ? 'gym-button-default' : 'gym-button-greyb'}`}
                    onClick={this.handleExport}
                >
                    导出
                </button>
                <TablePagination
                    columns={this.columns()}
                    rowKey='contractId'
                    dataSource={contractLeaveDate.list}
                    totalSize={contractLeaveDate.totalSize}
                    pageSize={searchOption.pageSize}
                    handleChangePage={this.handleChangePage}
                    pageNo={searchOption.pageNo}
                    scroll={{x : 'max-content'}}
                />
                <Modal handleOk={() => this.confirmSureContract(confirmContract)}
                       handleCancel={() => this.setState({isTransferCenterMsg: false})}
                       visible={isTransferCenterMsg}
                       width={600}
                       message={repeatCenterCode}
                />
            </div>
        )
    }
}

export {ContractActionListOverdue}
