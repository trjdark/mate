/**
 * desc: 改包申请列表
 * User: colin.lu
 * Date: 2018/9/01
 * Time: 上午10:00
 */
import React from 'react';
import {TablePagination} from "@/ui/component/tablePagination";
import {SearchForm} from "@/ui/component/searchForm";
import {Routes} from "@/router/enum/routes";
import {CommonUtils, SafeCalculate} from "@/common/utils/commonUtils";
import {
    deleteChangePkg,
    contractChangePkgList,
    getChangePkgApplyDetail
} from "@redux-actions/contract";
import {connect} from "@/common/decorator/connect";
import {selectChangePkgTypes} from "@/saga/selectors/contract";
import {User} from "@/common/beans/user";
import {selectApprovalPermission} from "@/saga/selectors/home";
import {message} from "antd";
import moment from "moment";
import history from "@/router/history";
import {Modal} from "@/ui/component/customerCreateModal";

@connect((state:any) => ({
    changePkgTypes: selectChangePkgTypes(state),
    approvalPermission: selectApprovalPermission(state)
}))
class ContractActionListPkg extends React.Component<any, any> {
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
            contractLeaveDate:{},          // 请假列表对象
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
        contractChangePkgList(Object.assign({}, params, body))
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
     * 删除改包
     * @param pageInfo
     */
    cancelChangePkgRecord = () => {
        deleteChangePkg({currentCenterId: User.currentCenterId, id: this.state.id})
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
     * delete操作
     */
    deleteDetail = (record) => {
        // 查询收款信息
        getChangePkgApplyDetail({
            id:record.id,
            contractId: record.contractId,
            contractCode: record.contractCode,
            currentCenterId:User.currentCenterId,
        }).then((res) => {
            if(res.changePkgDetail.approvalStatus === record.approvalStatus){
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
     *检查状态
     */
    checkStatusApprove = (record:any) => {
        // 查询收款信息
        getChangePkgApplyDetail({
            id:record.id,
            contractId: record.contractId,
            contractCode: record.contractCode,
            currentCenterId:User.currentCenterId,
        }).then((res) => {
            if(res.changePkgDetail.approvalStatus === record.approvalStatus){
                history.push(`${Routes.合同操作详情改包.link}${CommonUtils.stringify({
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
        getChangePkgApplyDetail({
            id:record.id,
            contractId: record.contractId,
            contractCode: record.contractCode,
            currentCenterId:User.currentCenterId,
        }).then((res) => {
            if(res.changePkgDetail.approvalStatus === record.approvalStatus){
                history.push(`${Routes.合同操作详情改包.link}${CommonUtils.stringify({
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
        getChangePkgApplyDetail({
            id: record.id,
            contractId: record.contractId,
            contractCode: record.contractCode,
            currentCenterId: User.currentCenterId,
        }).then((res) => {
            if (res.changePkgDetail.approvalStatus === record.approvalStatus) {
                history.push(`${Routes.合同操作详情改包.link}${CommonUtils.stringify({
                    id: record.id,
                    contractId: record.contractId,
                    contractCode: record.contractCode,
                    status: 'view'
                })}`)
            } else {
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
    renderAction = (node:any) => {
        const {changePkgTypes = [], approvalPermission} = this.props;
        const NONE_APPROVED = changePkgTypes.filter((item:any) => item.codeValue === '待审批')[0] &&
            changePkgTypes.filter((item:any) => item.codeValue === '待审批')[0].code;
        const APPROVED = changePkgTypes.filter((item:any) => item.codeValue === '已通过')[0] &&
            changePkgTypes.filter((item:any) => item.codeValue === '已通过')[0].code;
        const REFUSE = changePkgTypes.filter((item:any) => item.codeValue === '未通过')[0] &&
            changePkgTypes.filter((item:any) => item.codeValue === '未通过')[0].code;
        const SIGNING = changePkgTypes.filter((item:any)=> item.codeValue === '签署中')[0] &&
            changePkgTypes.filter((item:any) => item.codeValue === '签署中')[0].code;

        const options:any = new Map([
            // 待审批
            [NONE_APPROVED, (id:string) => {
                return (
                    <div>
                    {
                        approvalPermission.modifyPackageApproval &&
                        <span>
                            <button onClick={() => {this.checkStatusApprove(node)}} className='gym-button-xxs gym-button-white mr5'>审批</button>
                        </span>

                    }
                    {
                        id === User.userId &&
                        <span>
                            <button onClick={() => {this.checkStatusEdit(node)}} className='gym-button-xxs gym-button-white mr5'>编辑</button>
                        </span>
                    }
                    {
                        (approvalPermission.modifyPackageApproval || id === User.userId)
                            ?
                            <span>
                                <button onClick={()=>this.deleteDetail(node)} className='gym-button-xxs gym-button-white mr5'>删除</button>
                            </span>
                            :
                            <span>
                                <button onClick={() => {this.checkStatusView(node)}} className='gym-button-xxs gym-button-white mr5'>查看</button>
                            </span>
                    }
                </div>
                )
            }],
            // 已通过
            [APPROVED, (id:string) => {
                return (
                    <span>
                        <button onClick={() => {this.checkStatusView(node)}} className='gym-button-xxs gym-button-white mr5'>查看</button>
                    </span>
                )
            }],
            // 未通过
            [REFUSE, (id:string) => {
                return (
                    <span>
                        <button onClick={() => {this.checkStatusView(node)}} className='gym-button-xxs gym-button-white mr5'>查看</button>
                    </span>
                )
            }],
            [SIGNING,(id:string)=> {
                return (
                    <span>
                        <button onClick ={()=>{this.checkStatusView(node)}} className='gym-button-xxs gym-button-white mt5'>查看</button>
                    </span>
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
        const {changePkgTypes} = this.props;
        const newApprovalStatusList = changePkgTypes.map((item:any) => ({postCode: item.code, postName: item.codeValue}))
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
                label: '审批状态',
                name: 'approvalStatus',
                placeholder: '请选择' ,
                options: newApprovalStatusList,
            },{
                type: 'text',
                label: '联系人',
                name: 'contactName',
                placeholder: '请输入'
            },{
                type: 'rangePicker',
                label: '审批日期',
                name:  'approvalDate'
            }
        ];
    };
    /**
     * 表头设置
     * @returns {({title: string; dataIndex: string; key: string; width: number} | {title: string; dataIndex: string; key: string; width: number; render: (num: number) => string} | {title: string; dataIndex: string; key: string; width: number; render: (text: string, record: any) => any} | {title: string; dataIndex: string; key: string; width: number; render: (text: number) => (string | string)} | {title: string; dataIndex: string; key: string; align: string; width: number; render: (text: string, record: any) => any})[]}
     */
    columns = () => {
        const {changePkgTypes} = this.props;
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
            title: '原课程包',
            dataIndex: 'oldPackageName',
            key: 'oldPackageName',
            width: 120,
        }, {
            title: '新课程包',
            dataIndex: 'newPackageName',
            key: 'newPackageName',
            width: 120,
        }, {
            title: '差额',
            dataIndex: 'difference',
            key: 'difference',
            width: 100,
            render: (num:number) => SafeCalculate.autoZero(num)
        }, {
            title: '审批状态',
            dataIndex: 'approvalStatus',
            key: 'approvalStatus',
            width: 120,
            render: (text:string, record:any) => {
                const res = changePkgTypes.filter((item:any) => item.code === text);
                return (
                    <div className="activity-approval-status">
                        <span className={record.approvalStatus === '23001' ? 'contract-colorGray' : record.approvalStatus === '23002' ? 'contract-colorRed' : 'contract-colorGreen'}>
                        </span>
                        <span>{res.length > 0 ? res[0].codeValue : ''}</span>
                    </div>
                )
            }
        }, {
            title: '审批日期',
            dataIndex: 'approvalDate',
            key: 'approvalDate',
            width: 150,
            render: (text:number) => {
                if(text && text !== null){
                    return moment(text).format("YYYY-MM-DD")
                }else{
                    return ''
                }
            }
        }, {
            title: 'GB',
            dataIndex: 'gbStaffName',
            key: 'gbStaffName',
            width: 80,
        }, {
            title: 'GA',
            dataIndex: 'gaStaffName',
            key: 'gaStaffName',
            width: 80,
        }, {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            align: 'left',
            width: 180,
            render: (text: string, record: any) => this.renderAction(record)
        }];
    }
    render() {
        const {searchOption, contractLeaveDate, visible} = this.state;

        return (
            <div className='page-wrap mt2 gym-contract-operation-tab-content'>
                <SearchForm items={this.searchConfig()}
                            onSearch={this.onSearch}
                />
                <TablePagination
                    columns={this.columns()}
                    rowKey={'id'}
                    dataSource={contractLeaveDate.list}
                    totalSize={contractLeaveDate.totalSize}
                    pageSize={searchOption.pageSize}
                    handleChangePage={this.handleChangePage}
                    pageNo={searchOption.pageNo}
                    scroll={{x : 'max-content'}}
                />
                <Modal
                    visible={visible}
                    handleOk={this.cancelChangePkgRecord}
                    handleCancel={this.onCancel}
                    contentText={`是否删除此记录？`}
                />
            </div>
        )
    }
}

export {ContractActionListPkg}
