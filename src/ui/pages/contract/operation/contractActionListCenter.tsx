/**
 * desc: 转中心申请列表
 * User: colin.lu
 * Date: 2018/9/01
 * Time: 上午10:00
 */

import React, {Fragment} from 'react';
import {TablePagination} from "@/ui/component/tablePagination";
import {SearchForm} from "@/ui/component/searchForm";
import {Routes} from "@/router/enum/routes";
import {CommonUtils} from "@/common/utils/commonUtils";
import {Icon} from "@/ui/component/icon";
import {
    contractChangeCenterList, deleteChangeCenter,
    getChangeCenterDetail,
    transferInRetractChangeCenter,
    transferOutNewRetractChangeCenter
} from "@redux-actions/contract";
import {connect} from "@/common/decorator/connect";
import {selectChangeCenterTypes} from "@/saga/selectors/contract";
import {User} from "@/common/beans/user";
import {message} from "antd";
import {selectApprovalPermission} from "@/saga/selectors/home";
import moment from 'moment';
import history from "@/router/history";
import {Modal} from "@/ui/component/customerCreateModal";
import {ConfirmCheck} from "@/ui/component/confirmCheck";

const centerStatusList =[
    {
        key: 'in',
        text: '转入',
        postName: '转入',
        postCode: 'in'
    },
    {
        key: 'out',
        text: '转出',
        postName: '转出',
        postCode: 'out'
    }
];

@connect((state:any) => ({
    changeCenterStatusList: selectChangeCenterTypes(state),
    approvalPermission: selectApprovalPermission(state)
}))
class ContractActionListCenter extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            searchOption : {
                pageNo: 1,
                pageSize: 10,
                babyName: "",                             // 宝宝姓名
                contractCode: "",                         // 合同编号
                approvalStatus: "",                       // 审批状态
                contactName: "",                          // 联系人姓名
                approvalStartDate:null,
                approvalEndDate:null,
                currentCenterId: User.currentCenterId
            },
            contractLeaveDate:{},                         // 请假列表对象
            visible: false,
            id: '',
            contractId: ''
        }
    }

    componentDidMount() {
        this.handleSearch({})
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
        contractChangeCenterList(Object.assign({}, params, body))
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
     * 删除转中心
     * @param pageInfo
     */
    cancelChangeCenterRecord = () => {
        deleteChangeCenter({currentCenterId: User.currentCenterId, id: this.state.id, contractId: this.state.contractId})
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
        getChangeCenterDetail({
            id:record.id,
            contractId: record.contractId,
            contractCode: record.contractCode,
            currentCenterId:User.currentCenterId,
        }).then((res) => {
            if(res.changeCenterCourseDetail.approvalStatus === record.approvalStatus){
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
            this.handleSearch();
        });
    };

    /**
     * 检查状态
     */
    checkStatusApprove = (record:any) => {
        // 查询收款信息
        getChangeCenterDetail({
            id:record.id,
            contractId: record.contractId,
            contractCode: record.contractCode,
            currentCenterId:User.currentCenterId,
        }).then((res) => {
            if(res.changeCenterCourseDetail.approvalStatus === record.approvalStatus){
                history.push(`${Routes.合同操作详情转中心.link}${CommonUtils.stringify({
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
     * 检查状态
     */
    checkStatusApproveIn = (record:any) => {
        // 查询收款信息
        getChangeCenterDetail({
            id:record.id,
            contractId: record.contractId,
            contractCode: record.contractCode,
            currentCenterId:User.currentCenterId,
        }).then((res) => {
            if(res.changeCenterCourseDetail.approvalStatus === record.approvalStatus){
                history.push(`${Routes.合同操作详情转中心.link}${CommonUtils.stringify({
                    id:record.id,
                    contractId:record.contractId,
                    contractCode: record.contractCode,
                    status: 'approve-in'
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
     * 检查状态
     */
    checkStatusEdit = (record:any) => {
        // 查询收款信息
        getChangeCenterDetail({
            id:record.id,
            contractId: record.contractId,
            contractCode: record.contractCode,
            currentCenterId:User.currentCenterId,
        }).then((res) => {
            if(res.changeCenterCourseDetail.approvalStatus === record.approvalStatus){
                history.push(`${Routes.合同操作详情转中心.link}${CommonUtils.stringify({
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
        },      (err) => {
            // 返回请求reject
            message.error(err.msg)
            this.handleSearch({});
        });
    };

    /**
     * 检查状态
     */
    checkStatusView = (record:any) => {
        // 查询收款信息
        getChangeCenterDetail({
            id:record.id,
            contractId: record.contractId,
            contractCode: record.contractCode,
            currentCenterId:User.currentCenterId,
        }).then((res) => {
            if(res.changeCenterCourseDetail.approvalStatus === record.approvalStatus){


                history.push(`${Routes.合同操作详情转中心.link}${CommonUtils.stringify({
                    id:record.id,
                    contractId:record.contractId,
                    contractCode: record.contractCode,
                    status: 'view'
                })}`)
            }else{
                message.warning('该合同操作记录已变更，请刷新页面后再尝试!', 5);
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
     * 转出撤回
     * @param record
     */
    transferOutRetract = (record:any) => {
        const param = {
            id: record.id,
            currentCenterId: User.currentCenterId,
        }
        transferOutNewRetractChangeCenter(param).then( () => {
            message.success('撤回成功！');
            this.handleSearch({});
        })
    };
    /**
     * 转入撤回
     */
    transferInRetract = (record:any) => {
        const param = {
            id: record.id,
            currentCenterId: User.currentCenterId,
        }
        transferInRetractChangeCenter(param).then( () => {
            message.success('撤回成功！');
            this.handleSearch({});
        })
    }

    /**
     * 操作显示按钮
     * @param node
     * @returns {any}
     */
    renderAction = (node:any) => {
        const uid = User.userId, curId = User.currentCenterId;
        const {approvalPermission} = this.props;
        // key 为订单状态_是否本人创建_是否为转入中心_是否有审批/转入撤回权限_是否有 转出撤回权限; 1=是，0=否
        const key = `${node.approvalStatus}_${node.createBy ===  uid ? '1' : '0'}_${node.rollInCenterId === curId ? '1' : '0'}_${approvalPermission.transferCenterApproval ? '1' : '0'}`;
        let result;
        switch (key) {
            case '22001_1_0_0':
                result = (
                    <Fragment>
                        <button onClick={() => {this.checkStatusEdit(node)}} className='gym-button-xxs gym-button-white mr5'>编辑</button>
                        <button onClick={()=>this.deleteDetail(node)} className='gym-button-xxs gym-button-white mr5'>删除</button>
                    </Fragment>
                );
                break;
            case '22001_1_0_1':
                result = (
                    <Fragment>
                        <button onClick={() => {this.checkStatusEdit(node)}} className='gym-button-xxs gym-button-white mr5'>编辑</button>
                        <button onClick={() => {this.checkStatusApprove(node)}} className='gym-button-xxs gym-button-white mr5'>审批</button>
                        <button onClick={()=>this.deleteDetail(node)} className='gym-button-xxs gym-button-white mr5'>删除</button>
                    </Fragment>
                );
                break;
            case '22001_0_0_1':
                result = (
                    <Fragment>
                        <button onClick={() => {this.checkStatusApprove(node)}} className='gym-button-xxs gym-button-white mr5'>审批</button>
                        <button onClick={()=>this.deleteDetail(node)} className='gym-button-xxs gym-button-white mr5'>删除</button>
                    </Fragment>
                );
                break;
            case '22002_0_0_1':
            case '22002_1_0_1':
                result = (
                    <Fragment>
                        <ConfirmCheck
                            item={node}
                            ensure={(node) => this.transferOutRetract(node)}
                            contentText='是否撤回此次转中心操作？'
                            button='撤回'
                        />
                        <button onClick={() => {this.checkStatusView(node)}} className='gym-button-xxs gym-button-white mr5'>查看</button>
                    </Fragment>
                );
                break;
            case '22002_0_1_1':
            case '22002_1_1_1':
                result = (
                    <Fragment>
                        <button onClick={() => {this.checkStatusApproveIn(node)}} className='gym-button-xxs gym-button-white mr5'>审批</button>
                        <button onClick={() => {this.checkStatusView(node)}} className='gym-button-xxs gym-button-white mr5'>查看</button>
                    </Fragment>
                );
                break;
            case '22003_0_1_1':
            case '22003_1_1_1':
                result = (
                    <Fragment>
                        <ConfirmCheck
                            item={node}
                            ensure={(node) => this.transferInRetract(node)}
                            contentText='是否撤回此次转中心操作？'
                            button='撤回'
                        />
                        <button onClick={() => {this.checkStatusView(node)}} className='gym-button-xxs gym-button-white mr5'>查看</button>
                    </Fragment>
                );
                break;
            default:
                result =  <button onClick={() => {this.checkStatusView(node)}} className='gym-button-xxs gym-button-white mr5'>查看</button>
                break;
        }
        return result;
    };
    /**
     * 搜索配置
     * @returns {Array<any>}
     */
    searchConfig = ():Array<any> => {
        const {changeCenterStatusList} = this.props;
        const newApprovalStatusList = changeCenterStatusList.map((item:any) => ({postCode: item.code, postName: item.codeValue}));
        return [
            {
                type: 'text',
                label: '宝宝姓名',
                name: 'babyName',
                placeholder: '请输入'
            },{
                type: 'text',
                label: '合同编号',
                placeholder: '请输入' ,
                name: 'contractCode',
            },{
                type: 'select',
                label: '审批状态',
                name: 'approvalStatus',
                placeholder: '请选择' ,
                options: newApprovalStatusList,
            },{
                type: 'rangePicker',
                label: '审批日期',
                name:  'approvalDate'
            },{
                type: 'select',
                label: '转中心类型',
                placeholder: '请选择' ,
                options: centerStatusList,
                name: 'transMode'
            }
        ];
    }
    /**
     * 表头配置
     * @returns {({title: string; dataIndex: string; key: string; width: number} | {title: string; dataIndex: string; key: string; width: number; render: (text: string, record: any) => any} | {title: string; dataIndex: string; key: string; render: () => any} | {title: string; dataIndex: string; key: string; width: number; render: (text: string, record: any) => any} | {title: string; dataIndex: string; key: string; width: number; render: (text, record) => string} | {title: string; dataIndex: string; key: string; width: number; render: (text: string, record: any) => any} | {title: string; dataIndex: string; key: string; width: number; render: (date: number) => string} | {title: string; dataIndex: string; key: string; align: string; width: number; render: (text: string, record: any) => any})[]}
     */
    columns = () => {
        const {changeCenterStatusList} = this.props;
        return [{
            title: '宝宝姓名',
            dataIndex: 'babyName',
            key: 'babyName',
            width: 120,
        }, {
            title: '合同编号',
            dataIndex: 'contractCode',
            key: 'contractCode',
            width: 150,
        }, {
            title: '转中心方式',
            dataIndex: 'transferCenterTypeName',
            key: 'transferCenterTypeName',
        }, {
            title: '转出中心',
            dataIndex: 'outCenterName',
            key: 'outCenterName',
            width: 150,
            render: (text:string, record:any) => <span>{`${record.outCenterCode}-${text}`}</span>
        }, {
            title: '',
            dataIndex: 'trans',
            key: 'trans',
            render: (text, record) => <Icon className={`gym-contract-transIcon ${record.outCenterCode === User.centerCode ? 'out' : ''}`} type='youjiantou'/>
        }, {
            title: '转入中心',
            dataIndex: 'rollInCenterName',
            key: 'rollInCenterName',
            width: 150,
            render: (text:string, record:any) => <span>{`${record.rollInCenterCode}-${text}`}</span>
        }, {
            title: '转中心金额',
            dataIndex: 'rollOutCourseAmount',
            key: 'rollOutCourseAmount',
            width: 140,
            render:(text,record)=>(Number(record.rollOutCourseAmount?record.rollOutCourseAmount:0).toFixed(2))
        }, {
            title: '审批状态',
            dataIndex: 'approvalStatus',
            key: 'approvalStatus',
            width: 150,
            render: (text:string, record:any) => {
                const res = changeCenterStatusList.filter((item:any) => item.code === text);
                const options = new Map([
                    ['22001', 'contract-colorGray'],
                    ['22002', 'contract-colorBlue'],
                    ['22003', 'contract-colorBlue'],
                    ['1205001', 'contract-colorRed'],
                    ['1205002', 'contract-colorRed'],
                    ['1205003', 'contract-colorGreen'],
                    ['1205004', 'contract-colorRed'],
                    ['1205005', 'contract-colorGreen'],
                    ['default', 'contract-colorGreen'],
                ]);
                return (
                    <div className="activity-approval-status">
                        <span className={options.get(record.approvalStatus) ? options.get(record.approvalStatus) : options.get('default')}>
                        </span>
                        <span>{res.length > 0 ? res[0].codeValue : ''}</span>
                    </div>
                )
            }
        }, {
            title: '审批日期',
            dataIndex: 'approvalDate',
            key: 'approvalDate',
            width: 160,
            render:(date:number) => date ? moment(date).format('YYYY-MM-DD') : ''
        },{
            title: 'GB',
            dataIndex: 'gbStaffName',
            key: 'gbStaffName',
        },{
            title: 'GA',
            dataIndex: 'gaStaffName',
            key: 'gaStaffName',
        }, {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            align: 'left',
            width: 220,
            render: (text: string, record: any) => this.renderAction(record),
        }];
    }
    render() {
        const {searchOption, contractLeaveDate, visible} = this.state;
        return (
            <div className='page-wrap gym-contract gym-operation mt2 gym-contract-operation-tab-content'>
                <SearchForm items={this.searchConfig()} onSearch={this.onSearch}/>
                <TablePagination
                    columns={this.columns()}
                    rowKey='id'
                    dataSource={contractLeaveDate.list}
                    totalSize={contractLeaveDate.totalSize}
                    pageSize={searchOption.pageSize}
                    handleChangePage={this.handleChangePage}
                    pageNo={searchOption.pageNo}
                    scroll={{x : 'max-content'}}
                />
                <Modal
                    visible={visible}
                    handleOk={this.cancelChangeCenterRecord}
                    handleCancel={this.onCancel}
                    contentText={`是否删除此记录？`}
                />
            </div>
        )
    }
}

export {ContractActionListCenter}

