/**
 * desc: 申请请假
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/11/23
 * Time: 下午3:39
 */
import React from 'react';
import {Link} from "react-router-dom";
import {Routes} from "@/router/enum/routes";
import {PageTitle} from "@/ui/component/pageTitle";
import {CommonUtils} from "@/common/utils/commonUtils";
import {applyContent} from "./applyContent";
import {connect} from "@/common/decorator/connect";
import {selectContractLeaveStatus} from "@/saga/selectors/contract";
import moment from 'moment';
import {deleteLeave, getLeaveApplyDetail} from "@redux-actions/contract";
import {User} from "@/common/beans/user";
import {message} from "antd";
import {Table} from "@/ui/component/tablePagination";
import history from "@/router/history";
import {Modal} from "@/ui/component/customerCreateModal";

declare interface ApplyLeaveProps {
    list:Array<any>,
    contractId:string,
    contractCode:string,
    aStatus: string,         // 审批状态
    pStatus: string,         // 支付状态
    isOpe:boolean,           // 是否能申请
    approved:string,
    payOff:string,
    partPayOff:string,
    leaveStatusList?:Array<any>
}


@connect((state:any) => ({
    leaveStatusList: selectContractLeaveStatus(state),
}))
class ApplyLeaveComponet extends React.Component<ApplyLeaveProps, any> {
    constructor(props:any){
        super(props)
        this.state = {
            list: [],
            isChange:false,
            visible: false,
            id: '',
            contractId: ''
        }
    }
    static getDerivedStateFromProps(props, state){
        if(props.list.length > 0 && !state.isChange){
            return {
                isChange: true,
                list: props.list
            }
        }
        return null;
    }
    /**
     * 删除记录
     * @param pageInfo
     */
    cancelLeaveRecord = () => {
        deleteLeave({currentCenterId: User.currentCenterId, id: this.state.id, contractId: this.state.contractId})
            .then((res:any) => {
                message.success('删除成功！');
                this.setState({
                    list: this.state.list.filter((item:any) => item.id !== this.state.id),
                    visible: false,
                    id: '',
                    contractId: ''
                })
            })
    };

    /**
     * delete操作
     */
    deleteDetail = (record) => {
        // 查询收款信息
        getLeaveApplyDetail({
            id:record.id,
            contractId: record.contractId,
            contractCode: record.contractCode,
            currentCenterId:User.currentCenterId,
        }).then((res) => {
            if(res.leaveDetail.approvalStatus === record.approvalStatus){
                this.setState({
                    visible: true,
                    id: record.id,
                    contractId: record.contractId
                })
            }else{
                message.warning('该合同操作记录已变更，刷新页面后再尝试!', 5);
                window.location.reload();
                return false
            }
        }, (err) => {
            // 返回请求reject
            message.error(err.msg);
            window.location.reload();
        });
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
     *检查状态
     */
    checkStatusEdit = (record:any) => {
        /**
         * api
         * @param someParam<>
         * @method post
         */

        // 查询收款信息
        getLeaveApplyDetail({
            id:record.id,
            contractId: record.contractId,
            contractCode: record.contractCode,
            currentCenterId:User.currentCenterId,
        }).then((res) => {
            if(res.leaveDetail.approvalStatus === record.approvalStatus){
                history.push(`${Routes.合同操作详情修改请假次数.link}${CommonUtils.stringify({
                    id:record.id,
                    contractId:record.contractId,
                    contractCode: record.contractCode,
                    status: 'edit'
                })}`)
            }else{
                message.warning('该合同操作记录已变更，刷新页面后再尝试!', 5);
                window.location.reload();
                return false
            }
        }, (err) => {
            // 返回请求reject
            message.error(err.msg)
            window.location.reload();
        });
    };

    /**
     *检查状态
     */
    checkStatusView = (record:any) => {
        /**
         * api
         * @param someParam<>
         * @method post
         */

        // 查询收款信息
        getLeaveApplyDetail({
            id:record.id,
            contractId: record.contractId,
            contractCode: record.contractCode,
            currentCenterId:User.currentCenterId,
        }).then((res) => {
            if(res.leaveDetail.approvalStatus === record.approvalStatus){
                history.push(`${Routes.合同操作详情修改请假次数.link}${CommonUtils.stringify({
                    id:record.id,
                    contractId:record.contractId,
                    contractCode: record.contractCode,
                    status: 'view'
                })}`)
            }else{
                message.warning('该合同操作记录已变更，刷新页面后再尝试!', 5);
                window.location.reload();
                return false
            }
        }, (err) => {
            // 返回请求reject
            message.error(err.msg)
            window.location.reload();
        });
    };
    /**
     * 表头设置
     * @returns {({title: string; dataIndex: string; key: string} | {title: string; dataIndex: string; key: string; render: (text: string, record: any) => any} | {title: string; dataIndex: string; key: string; render: (text: string, record: any) => (string | string)} | {title: string; dataIndex: string; key: string; align: string; render: (text: string, record: any, index: number) => any})[]}
     */
    columns = () => {
        const {leaveStatusList} = this.props;
        const NONE_APPROVED = leaveStatusList.filter((item:any) => item.codeValue === '待审批')[0] && leaveStatusList.filter((item:any) => item.codeValue === '待审批')[0].code;
        return [{
            title: '宝宝姓名',
            dataIndex: 'babyName',
            key: 'babyName',
        }, {
            title: '合同编号',
            dataIndex: 'contractCode',
            key: 'contractCode',
        }, {
            title: '课程包',
            dataIndex: 'packageName',
            key: 'packageName',
        }, {
            title: '标准请假次数',
            dataIndex: 'allowLeaveTimes',
            key: 'allowLeaveTimes',
        }, {
            title: '新增请假次数',
            dataIndex: 'newLeaveTimes',
            key: 'newLeaveTimes',
        }, {
            title: '审批状态',
            dataIndex: 'approvalStatus',
            key: 'approvalStatus',
            render: (text:string, record:any) => {
                const res = leaveStatusList.filter((item:any) => item.code === text);
                return (
                    <div className="activity-approval-status">
                        <span className={record.approvalStatus === '48001' ? 'contract-colorGray' : record.approvalStatus === '48002' ? 'contract-colorRed' : 'contract-colorGreen'}>
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
            render: (text: string, record: any,) =>
                (record.createBy === User.userId && record.approvalStatus == NONE_APPROVED)
                    ? (
                        <div>
                        <span>
                            <button onClick={() => {this.checkStatusEdit(record)}} className='gym-button-xxs gym-button-white' style={{marginRight:'5px'}}>编辑</button>
                        </span>
                            <span>
                            <button onClick={()=>this.deleteDetail(record)} className='gym-button-xxs gym-button-white mr5'>删除</button>
                        </span>
                        </div>
                    )
                    : (
                        <span>
                            <button onClick={() => {this.checkStatusView(record)}} className='gym-button-xxs gym-button-white'>查看</button>
                        </span>
                    )
        }];
    };
    render(){
        const {isOpe} = this.props;
        const {list, visible} = this.state;
        return(
            <div className='gym-contract-info-wrap center mt30'>
                <PageTitle title={
                    <div className='gym-contract-info-wrap-title'>
                        <span  className='gym-contract-info-wrap-title-content'>修改请假次数记录</span>
                        {
                            // 审批通过并且，已经付清或者部分付清，才能申请赠课
                            (isOpe)
                                ?<Link to={`${Routes.申请请假.link}${CommonUtils.stringify({contractId: this.props.contractId, contractCode: this.props.contractCode})}`}
                                       className='gym-contract-info-wrap-title-button gym-button-default gym-button-lg'>
                                    申请修改请假次数
                                </Link>
                                : <button className='gym-contract-info-wrap-title-button gym-button-greyb gym-button-lg'>申请修改请假次数</button>
                        }
                    </div>
                }/>
                <div className='gym-table-wrap gym-no-bottom'>
                    <div className='gym-table-wrap-contract'>
                        <Table
                            columns={this.columns()}
                            dataSource={list}
                            rowKey={'id'}
                        />
                    </div>
                </div>
                <Modal
                    visible={visible}
                    handleOk={this.cancelLeaveRecord}
                    handleCancel={this.onCancel}
                    contentText='是否删除此记录？'
                />
            </div>
        )
    }
}

const ApplyLeave = applyContent(ApplyLeaveComponet);

export {ApplyLeave}
