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
import {
    contractGiveClassList,
    deleteFreeCourse,
    cancelFreeCourse,
    getFreeCourseApplyDetail
} from "@redux-actions/contract";
import {connect} from "@/common/decorator/connect";
import {selectContractFreeStatus} from "@/saga/selectors/contract";
import {selectApprovalPermission} from "@/saga/selectors/home";
import {User} from "@/common/beans/user";
import moment from 'moment';
import {message} from "antd";
import history from "@/router/history";
import {Modal} from "@/ui/component/customerCreateModal";
import {FUNC} from "@/ui/pages/setting/enum/functions";

@connect((state:any) => ({
    freeStatusList: selectContractFreeStatus(state),
    approvalPermission: selectApprovalPermission(state)
}))
class ContractActionListFree extends React.Component<any, any> {
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
            contractFreeDate:{},          // 请假列表对象
            visible: false,
            id: '',
            contractId: '',
            visibleUndo: false
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
        contractGiveClassList(Object.assign({}, params, body))
            .then((res:any) => {
                this.setState({contractFreeDate: res})
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
     * 删除记录
     * @param pageInfo
     */
    cancelFreeRecord = () => {
        deleteFreeCourse({currentCenterId: User.currentCenterId, id: this.state.id, contractId: this.state.contractId})
            .then((res:any) => {
                message.success('删除成功！');
                this.setState({
                    visible: false,
                    id: '',
                    contractId: '',
                });
                this.handleSearch()
            }, (err) => {
                // 返回请求reject
                message.error(err.msg);
                this.handleSearch({});
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

    onCancelUndo = () => {
        this.setState({
            visibleUndo: false,
            id: '',
            contractId: '',
        })
    };

    /**
     * delete操作
     */
    deleteDetail = (record) => {
        // 查询收款信息
        getFreeCourseApplyDetail({
            id:record.id,
            contractId: record.contractId,
            contractCode: record.contractCode,
            currentCenterId:User.currentCenterId,
        }).then((res) => {
            if(res.freeCourseDetail.approvalStatus === record.approvalStatus){
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
     * 作废
     * @param node
     */
    removeFreeRecord = () => {
        cancelFreeCourse({currentCenterId: User.currentCenterId, id: this.state.id, contractId: this.state.contractId})
            .then((res:any) => {
                message.success('作废成功！');
                this.setState({
                    visibleUndo: false,
                    id: '',
                    contractId: '',
                });
                this.handleSearch()
            }, (err) => {
                // 返回请求reject
                message.error(err.msg);
                this.handleSearch({});
            })
    };

    /**
     * delete操作
     */
    removeDetail = (record) => {
        // 查询收款信息
        getFreeCourseApplyDetail({
            id:record.id,
            contractId: record.contractId,
            contractCode: record.contractCode,
            currentCenterId:User.currentCenterId,
        }).then((res) => {
            if(res.freeCourseDetail.approvalStatus === record.approvalStatus){
                this.setState({
                    visibleUndo: true,
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
        getFreeCourseApplyDetail({
            id:record.id,
            contractId: record.contractId,
            contractCode: record.contractCode,
            currentCenterId:User.currentCenterId,
        }).then((res) => {
            if(res.freeCourseDetail.approvalStatus === record.approvalStatus){
                history.push(`${Routes.合同操作详情赠课.link}${CommonUtils.stringify({
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
        getFreeCourseApplyDetail({
            id:record.id,
            contractId: record.contractId,
            contractCode: record.contractCode,
            currentCenterId:User.currentCenterId,
        }).then((res) => {
            if(res.freeCourseDetail.approvalStatus === record.approvalStatus){
                history.push(`${Routes.合同操作详情赠课.link}${CommonUtils.stringify({
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
        getFreeCourseApplyDetail({
            id:record.id,
            contractId: record.contractId,
            contractCode: record.contractCode,
            currentCenterId:User.currentCenterId,
        }).then((res) => {
            if(res.freeCourseDetail.approvalStatus === record.approvalStatus){
                history.push(`${Routes.合同操作详情赠课.link}${CommonUtils.stringify({
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
    renderAction = (node:any) => {
        const {freeStatusList, approvalPermission} = this.props;
        const NONE_APPROVED = freeStatusList.filter((item:any) => item.codeValue === '待审批')[0] &&
            freeStatusList.filter((item:any) => item.codeValue === '待审批')[0].code;
        const NONE_FINANCD_APPROVED = freeStatusList.filter((item:any) => item.codeValue === "待财务审批")[0] &&
            freeStatusList.filter((item:any) => item.codeValue === "待财务审批")[0].code;
        const APPROVED = freeStatusList.filter((item:any) => item.codeValue === '已通过')[0] &&
            freeStatusList.filter((item:any) => item.codeValue === '已通过')[0].code;
        const REFUSE = freeStatusList.filter((item:any) => item.codeValue === '未通过')[0] &&
            freeStatusList.filter((item:any) => item.codeValue === '未通过')[0].code;
        let renderNodes = [];
        // const options:any = new Map([
        //     // 待审批
        //     [NONE_APPROVED, (createId:string) => {
        //         return <div>
        //             {
        //                 approvalPermission.freeCourseApproval &&
        //                 <span>
        //                     <button onClick={() => {this.checkStatusApprove(node)}} className='gym-button-xxs gym-button-white mr5'>审批</button>
        //                 </span>
        //             }
        //             {
        //                 createId === User.userId &&
        //                 <span className='span-link'>
        //                     <button onClick={() => {this.checkStatusEdit(node)}} className='gym-button-xxs gym-button-white mr5'>编辑</button>
        //                 </span>
        //             }
        //             {
        //                 (approvalPermission.freeCourseApproval || createId === User.userId)
        //                     ?
        //                     <span>
        //                         <button onClick={()=>this.deleteDetail(node)} className='gym-button-xxs gym-button-white mr5'>删除</button>
        //                     </span>
        //                     :
        //                     <span className='span-link'>
        //                         <button onClick={() => {this.checkStatusView(node)}} className='gym-button-xxs gym-button-white mr5'>查看</button>
        //                     </span>
        //             }
        //         </div>
        //     }],
        //     // 已通过
        //     [APPROVED, (createId:string, userNum:number) => {
        //         return (
        //             <div>
        //                 {
        //                     (userNum === 0 && node.cancelFlag === 1) &&
        //                     <span>
        //                         <button onClick={()=>this.removeDetail(node)} className='gym-button-xxs gym-button-white mr5'>作废</button>
        //                     </span>
        //                 }
        //                 <span className='span-link'>
        //                     <button onClick={() => {this.checkStatusView(node)}} className='gym-button-xxs gym-button-white mr5'>查看</button>
        //                 </span>
        //             </div>
        //         )
        //     }],
        //     // 未通过
        //     [REFUSE, () => {
        //         return (
        //             <div>
        //                 <span className='span-link'>
        //                     <button onClick={() => {this.checkStatusView(node)}} className='gym-button-xxs gym-button-white mr5'>查看</button>
        //                 </span>
        //             </div>
        //         )
        //     }],
        //
        // ]);
        // return options.get(node.approvalStatus) && options.get(node.approvalStatus)(node.createBy, node.usedFreeCourseNum)

        if( (node.approvalStatus === NONE_APPROVED && approvalPermission.freeCourseApproval ) || (node.approvalStatus === NONE_FINANCD_APPROVED && User.permissionList.includes(FUNC['赠课审批']))) {
            renderNodes.push(<button onClick={() => {this.checkStatusApprove(node)}} className='gym-button-xxs gym-button-white mr5'>审批</button>);
        }
        if(node.approvalStatus === NONE_APPROVED && node.createBy === User.userId){
            renderNodes.push(<button onClick={() => {this.checkStatusEdit(node)}} className='gym-button-xxs gym-button-white mr5'>编辑</button>)
        }
        if(node.approvalStatus === NONE_APPROVED && (node.createBy === User.userId || approvalPermission.freeCourseApproval)){
            renderNodes.push(<button onClick={()=>this.deleteDetail(node)} className='gym-button-xxs gym-button-white mr5'>删除</button>)
        }
        if(node.approvalStatus === APPROVED && node.usedFreeCourseNum === 0 && node.cancelFlag === 1){
            renderNodes.push(<button onClick={()=>this.removeDetail(node)} className='gym-button-xxs gym-button-white mr5'>作废</button>);
        }
        renderNodes.push(<button onClick={() => {this.checkStatusView(node)}} className='gym-button-xxs gym-button-white mr5'>查看</button>)
        return (
            <div>
                {renderNodes.map((item, index) => <span className='span-link' key={`${node.id}_button_${index}`}>{item}</span>)}
            </div>
        );
    };
    /**
     * 搜索配置
     * @returns {Array<any>}
     */
    searchConfig = ():Array<any> => {
        const {freeStatusList} = this.props;
        const newApprovalStatusList = freeStatusList.map((item:any) => ({postCode: item.code, postName: item.codeValue}))
        return [
            {
                type: 'text',
                label: '宝宝姓名',
                placeholder: '请输入' ,
                name: 'babyName',
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
                type: 'text',
                label: '联系人',
                placeholder: '请输入' ,
                name: 'contactName'
            },{
                type: 'rangePicker',
                label: '审批日期',
                name:  'approvalDate'
            }
        ];
    };
    /**
     * 表头配置
     * @returns {({title: string; dataIndex: string; key: string; width: number} | {title: string; dataIndex: string; key: string; width: number; render: (text: string, record: any) => any} | {title: string; dataIndex: string; key: string; width: number; render: (text: number) => (string | string)} | {title: string; dataIndex: string; key: string; align: string; width: number; render: (text: string, record: any) => any})[]}
     */
    columns = () => {
        const {freeStatusList} = this.props;
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
            title: '课程包',
            dataIndex: 'packageName',
            key: 'packageName',
            width: 120,
        }, {
            title: '赠课节数',
            dataIndex: 'freeCourseNum',
            key: 'freeCourseNum',
            width: 120,
        }, {
            title: '已使用节数',
            dataIndex: 'usedFreeCourseNum',
            key: 'usedFreeCourseNum',
            width: 150,
        }, {
            title: '审批状态',
            dataIndex: 'approvalStatus',
            key: 'approvalStatus',
            width: 120,
            render: (text:string, record:any) => {
                const res = freeStatusList.filter((item:any) => item.code === text);
                return (
                    <div className="activity-approval-status">
                        <span className={record.approvalStatus === '38001' ? 'contract-colorGray' : record.approvalStatus === '38002' ? 'contract-colorRed': record.approvalStatus === '38004'? 'contract-colorOrange': 'contract-colorGreen'}>
                        </span>
                        <span>{res.length > 0 ? res[0].codeValue : ''}</span>
                    </div>
                )
            }
        }, {
            title: '审批日期',
            dataIndex: 'approvalTime',
            key: 'approvalTime',
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
            dataIndex: 'gbstaffname',
            key: 'gbstaffname',
            width: 80,
        }, {
            title: 'GA',
            dataIndex: 'gastaffname',
            key: 'gastaffname',
            width: 80,
        }, {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            align: 'left',
            render: (text: string, record: any) => this.renderAction(record)
        }];
    };
    render() {
        const {searchOption, contractFreeDate, visible, visibleUndo} = this.state;
        return (
            <div className='page-wrap mt2 gym-contract-operation-tab-content'>
                <SearchForm items={this.searchConfig()}
                            onSearch={this.onSearch}
                />
                <TablePagination
                    columns={this.columns()}
                    rowKey={'id'}
                    dataSource={contractFreeDate.list}
                    totalSize={contractFreeDate.totalSize}
                    pageSize={searchOption.pageSize}
                    handleChangePage={this.handleChangePage}
                    pageNo={searchOption.pageNo}
                    scroll={{x : 'max-content'}}
                />
                <Modal
                    visible={visible}
                    handleOk={this.cancelFreeRecord}
                    handleCancel={this.onCancel}
                    contentText={`是否删除此记录？`}
                />
                <Modal
                    visible={visibleUndo}
                    handleOk={this.removeFreeRecord}
                    handleCancel={this.onCancelUndo}
                    contentText={`是否作废此记录？`}
                />
            </div>
        )
    }
}

export {ContractActionListFree}
