/**
 * desc: description
 * User: colin.lu
 * Date: 2018/9/01
 * Time: 上午10:00
 */

import React from 'react';
import {TablePagination} from "@/ui/component/tablePagination";
import {SearchForm} from "@/ui/component/searchForm";
import {Routes} from "@/router/enum/routes";
import {CommonUtils} from "@/common/utils/commonUtils";
import history from "../../../../router/history";
import {contractDelayList, deleteDelay, getDelayApplyDetail} from "@redux-actions/contract";
import {connect} from "@/common/decorator/connect";
import {selectContractDelayStatus} from "@/saga/selectors/contract";
import {selectApprovalPermission} from "@/saga/selectors/home";
import {User} from "@/common/beans/user";
import moment from 'moment';
import {message} from "antd";
import {Modal} from "@/ui/component/customerCreateModal";

@connect((state:any) => ({
    delayStatusList: selectContractDelayStatus(state),
    approvalPermission: selectApprovalPermission(state)
}))
class ContractActionListDelay extends React.Component<any, any> {

    constructor(props: any) {
        super(props);

        this.state = {
            searchOption : {
                pageNo: 1,
                pageSize: 10,
                babyName: "",             // 宝宝姓名
                contractCode: "",                 // 合同编号
                approvalStatus: "",             // 审批状态
                contactName: "",           // 联系人姓名
                approvalStartDate:null,
                approvalEndDate:null,
                currentCenterId: User.currentCenterId
            },
            contractDelayDate:{},          // 请假列表对象
            visible: false,
            id: '',
            contractId: ''
        }
    }

    componentDidMount() {
        this.handleSearch()
    }
    /**
     * 搜索条件
     * @param 搜索
     */
    onSearch = (values:any) => {
        this.setState({ searchOption: Object.assign({}, this.state.searchOption, {
                ...values,
                approvalStartDate:values.approvalDate != null ? values.approvalDate[0].startOf('day').valueOf() : null,
                approvalEndDate:values.approvalDate != null ? values.approvalDate[1].endOf('day').valueOf() : null,
                pageNo:1,
                pageSize:this.state.searchOption.pageSize,
            })});

        let postData = {
            ...values,
            approvalStartDate:values.approvalDate != null ? values.approvalDate[0].startOf('day').valueOf() : null,
            approvalEndDate:values.approvalDate != null ? values.approvalDate[1].endOf('day').valueOf() : null,
            pageNo:1,
            pageSize:this.state.searchOption.pageSize,
        };
        this.handleSearch(postData);
    };
    /**
     * 获取
     * @param body
     */
    handleSearch = (body:any = {}) => {
        const params = Object.assign({}, this.state.searchOption, {pageNo:1})
        contractDelayList(Object.assign({}, params, body))
            .then((res:any) => {
                this.setState({contractDelayDate: res})
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
     * 删除合同延期申请
     * @param pageInfo
     */
    cancelDelayRecord = () => {
        deleteDelay({currentCenterId: User.currentCenterId, id: this.state.id, contractId: this.state.contractId})
            .then((res:any) => {
                message.success('删除成功！');
                this.setState({
                    visible: false,
                    id: '',
                    contractId: '',
                });
                this.handleSearch()
            })
    };

    /**
     * 关闭
     * @param pageInfo
     */
    onCancel = () => {
        this.setState({
            visible: false,
            id: '',
            contractId: '',
        })
    };

    /**
     * delete操作
     */
    deleteDetail = (record) => {
        // 查询收款信息
        getDelayApplyDetail({
            id:record.id,
            contractId: record.contractId,
            contractCode: record.contractCode,
            currentCenterId:User.currentCenterId,
        }).then((res) => {
            if(res.delayDetail.approvalStatus === record.approvalStatus){
                this.setState({
                    visible: true,
                    id: record.id,
                    contractId: record.contractId
                })
            }else{
                message.warning('该合同操作记录已变更，刷新页面后再尝试!', 5);
                this.handleSearch();
                return false
            }
        }, (err) => {
            // 返回请求reject
            message.error(err.msg);
            this.handleSearch({});
        });
    };

    /**
     * 查看详情跳转
     * @param pageInfo
     */
    detail = (id:any) => {
        history.push(`${Routes.合同操作详情修改请假次数.link}/${CommonUtils.stringify({id: id})}`)
    };

    /**
     *检查状态
     */
    checkStatusApprove = (record:any) => {
        // 查询收款信息
        getDelayApplyDetail({
            id:record.id,
            contractId: record.contractId,
            contractCode: record.contractCode,
            currentCenterId:User.currentCenterId,
        }).then((res) => {
            if(res.delayDetail.approvalStatus === record.approvalStatus){
                history.push(`${Routes.合同操作详情延期.link}${CommonUtils.stringify({
                    id:record.id,
                    contractId:record.contractId,
                    contractCode: record.contractCode,
                    status: 'approve'
                })}`)
            }else{
                message.warning('该合同操作记录已变更，刷新页面后再尝试!', 5);
                this.handleSearch({});
                return false
            }
        }, (err) => {
            // 返回请求reject
            message.error(err.msg)
            this.handleSearch({});
        });
    };

    /**
     *检查状态
     */
    checkStatusEdit = (record:any) => {
        // 查询收款信息
        getDelayApplyDetail({
            id:record.id,
            contractId: record.contractId,
            contractCode: record.contractCode,
            currentCenterId:User.currentCenterId,
        }).then((res) => {
            if(res.delayDetail.approvalStatus === record.approvalStatus){
                history.push(`${Routes.合同操作详情延期.link}${CommonUtils.stringify({
                    id:record.id,
                    contractId:record.contractId,
                    contractCode: record.contractCode,
                    status: 'edit'
                })}`)
            }else{
                message.warning('该合同操作记录已变更，刷新页面后再尝试!', 5);
                this.handleSearch({});
                return false
            }
        }, (err) => {
            // 返回请求reject
            message.error(err.msg)
            this.handleSearch({});
        });
    };

    /**
     *检查状态
     */
    checkStatusView = (record:any) => {
        // 查询收款信息
        getDelayApplyDetail({
            id:record.id,
            contractId: record.contractId,
            contractCode: record.contractCode,
            currentCenterId:User.currentCenterId,
        }).then((res) => {
            if(res.delayDetail.approvalStatus === record.approvalStatus){
                history.push(`${Routes.合同操作详情延期.link}${CommonUtils.stringify({
                    id:record.id,
                    contractId:record.contractId,
                    contractCode: record.contractCode,
                    status: 'view'
                })}`)
            }else{
                message.warning('该合同操作记录已变更，刷新页面后再尝试!', 5);
                this.handleSearch({});
                return false
            }
        }, (err) => {
            // 返回请求reject
            message.error(err.msg)
            this.handleSearch({});
        });
    };

    /**
     * 显示操作
     * @param node
     */
    renderAction =(node:any) => {
        const {delayStatusList, approvalPermission} = this.props;
        const NONE_APPROVED = delayStatusList.filter((item:any) => item.codeValue === '待审批')[0] &&
            delayStatusList.filter((item:any) => item.codeValue === '待审批')[0].code;
        const APPROVED = delayStatusList.filter((item:any) => item.codeValue === '已通过')[0] &&
            delayStatusList.filter((item:any) => item.codeValue === '已通过')[0].code;
        const REFUSE = delayStatusList.filter((item:any) => item.codeValue === '未通过')[0] &&
            delayStatusList.filter((item:any) => item.codeValue === '未通过')[0].code;
        const options:any = new Map([
            // 待审批
            [NONE_APPROVED, (id:string) => {
                return (
                    <div>
                        {
                            approvalPermission.extendContractApproval &&
                            <span>
                                <button onClick={() => {this.checkStatusApprove(node)}} className='gym-button-xxs gym-button-white mr5'>审批</button>
                            </span>
                        }
                        {
                            id === User.userId &&
                            <span className='span-link'>
                                <button onClick={() => {this.checkStatusEdit(node)}} className='gym-button-xxs gym-button-white mr5'>编辑</button>
                            </span>
                        }
                        {
                            (approvalPermission.extendContractApproval || id === User.userId)
                                ?
                                <span>
                                    <button onClick={()=>this.deleteDetail(node)} className='gym-button-xxs gym-button-white mr5'>删除</button>
                                </span>
                                :
                                <span className='span-link'>
                                    <button onClick={() => {this.checkStatusView(node)}} className='gym-button-xxs gym-button-white mr5'>查看</button>
                                </span>
                        }
                    </div>
                )
            }],
            // 已通过
            [APPROVED, (id:string) => {
                return (
                    <div>
                        <span className='span-link'>
                            <button onClick={() => {this.checkStatusView(node)}} className='gym-button-xxs gym-button-white mr5'>查看</button>
                        </span>
                    </div>
                )
            }],
            // 未通过
            [REFUSE, (id:string) => {
                return (
                    <div>
                        <span className='span-link'>
                            <button onClick={() => {this.checkStatusView(node)}} className='gym-button-xxs gym-button-white mr5'>查看</button>
                        </span>
                    </div>
                )
            }]
        ]);
        return options.get(node.approvalStatus) && options.get(node.approvalStatus)(node.createBy)
    };
    /**
     * 搜索配置
     * @returns {Array<any>}
     */
    searchConfig = ():Array<any> => {
        const {delayStatusList} = this.props;
        const newApprovalStatusList = delayStatusList.map((item:any) => ({postCode: item.code, postName: item.codeValue}))
        return [
            {
                type: 'text',
                label: '宝宝姓名',
                name: 'babyName',
                placeholder: '请输入' ,
            },{
                type: 'text',
                label: '合同编号',
                name: 'contractCode',
                placeholder: '请输入' ,
            },{
                type: 'select',
                label: '审批状态',
                name: 'approvalStatus',
                placeholder: '请选择',
                options: newApprovalStatusList,
            },{
                type: 'text',
                label: '联系人',
                name: 'contactName',
                placeholder: '请输入' ,
            },{
                type: 'rangePicker',
                label: '审批日期',
                name:  'approvalDate'
            }
        ];
    };
    /**
     * 表头配置
     * @returns {({title: string; dataIndex: string; key: string} | {title: string; dataIndex: string; key: string; render: (text: number) => string} | {title: string; dataIndex: string; key: string; render: (text: number) => string} | {title: string; dataIndex: string; key: string; render: (text: string, record: any) => any} | {title: string; dataIndex: string; key: string; render: (text: string, record: any) => (string | string)} | {title: string; dataIndex: string; key: string; align: string; width: number; render: (text: string, record: any) => any})[]}
     */
    columns = () => {
        const {delayStatusList} = this.props;
        return [{
            title: '宝宝姓名',
            dataIndex: 'babyName',
            key: 'babyName',
        }, {
            title: '合同编号',
            dataIndex: 'contractCode',
            key: 'contractCode',
        }, {
            title: '原到期日',
            dataIndex: 'oldEndTime',
            key: 'oldEndTime',
            render: (text:number) => moment(text).format("YYYY-MM-DD")
        }, {
            title: '新到期日',
            dataIndex: 'newEndTime',
            key: 'newEndTime',
            render: (text:number) => moment(text).format("YYYY-MM-DD")
        }, {
            title: '审批状态',
            dataIndex: 'approvalStatus',
            key: 'approvalStatus',
            render: (text:string, record:any) => {
                const res = delayStatusList.filter((item:any) => item.code === text);
                return (
                    <div className="activity-approval-status">
                        <span className={record.approvalStatus === '21001' ? 'contract-colorGray' : record.approvalStatus === '21002' ? 'contract-colorRed' : 'contract-colorGreen'}>
                        </span>
                        <span>{res.length > 0 ? res[0].codeValue : ''}</span>
                    </div>
                )
            }
        }, {
            title: '审批日期',
            dataIndex: 'approvalTime',
            key: 'approvalTime',
            render: (text:string, record:any) => {
                if(record.approvalTime && record.approvalTime !== ''){
                    return moment(text).format("YYYY-MM-DD")
                } else {
                    return ''
                }
            }
        }, {
            title: 'GB',
            dataIndex: 'gbstaffname',
            key: 'gbstaffname',
        }, {
            title: 'GA',
            dataIndex: 'gastaffname',
            key: 'gastaffname',
        }, {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            align: 'left',
            width: 220,
            render: (text: string, record: any) => this.renderAction(record)
        }];
    }
    render() {
        const {searchOption, contractDelayDate, visible} = this.state;
        return (
            <div className='page-wrap mt2 gym-contract-operation-tab-content'>
                <SearchForm items={this.searchConfig()}
                            onSearch={this.onSearch}
                />
                <TablePagination
                    columns={this.columns()}
                    rowKey={'id'}
                    dataSource={contractDelayDate.list}
                    totalSize={contractDelayDate.totalSize}
                    pageSize={searchOption.pageSize}
                    handleChangePage={this.handleChangePage}
                    pageNo={searchOption.pageNo}
                    scroll={{x : 'max-content'}}
                />
                <Modal
                    visible={visible}
                    handleOk={this.cancelDelayRecord}
                    handleCancel={this.onCancel}
                    contentText={`是否删除此记录？`}
                />
            </div>
        )
    }
}

export {ContractActionListDelay}

