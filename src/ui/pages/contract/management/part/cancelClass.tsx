/**
 * desc: 退课
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/11/27
 * Time: 上午9:59
 */
import React from 'react';
import {Link} from "react-router-dom";
import {Routes} from "@/router/enum/routes";
import {PageTitle} from "@/ui/component/pageTitle";
import {CommonUtils, SafeCalculate} from "@/common/utils/commonUtils";
import {applyContent} from './applyContent';
import {connect} from "@/common/decorator/connect";
import {selectContractReturnStatus} from "@/saga/selectors/contract";
import {cancelCancelClass, getOutApplyDetail} from "@redux-actions/contract";
import {User} from "@/common/beans/user";
import {message} from "antd";
import {Table} from "@/ui/component/tablePagination";
import moment from "moment";
import {Modal} from "@/ui/component/customerCreateModal";
import history from "@/router/history";

declare interface ApplyLeaveProps {
    contractId:string,
    contractCode:string,
    aStatus: string,         // 审批状态
    pStatus: string,         // 支付状态
    isOpe:boolean,           // 是否能申请
    approved:string,
    payOff:string,
    partPayOff:string,
    list:Array<any>,
    outStatusList: Array<any>,
}

@connect((state:any) => ({
    outStatusList: selectContractReturnStatus(state),
}))
class CancelClassComponent extends React.Component<ApplyLeaveProps, any> {
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
    cancelOutRecord = () => {
        cancelCancelClass({currentCenterId: User.currentCenterId, id: this.state.id, contractId: this.state.contractId})
            .then((res:any) => {
                message.success('删除成功！');
                this.setState({
                    visible: false,
                    id: '',
                    contractId: '',
                    list: this.state.list.filter((item:any) => item.id !== this.state.id)
                });
            })
    };

    /**
     * delete操作
     */
    deleteDetail = (record) => {
        // 查询收款信息
        getOutApplyDetail({
            id:record.id,
            contractId: record.contractId,
            contractCode: record.contractCode,
            currentCenterId:User.currentCenterId,
        }).then((res) => {
            if(res.outCourseDetail.approvalStatus === record.approvalStatus){
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
        getOutApplyDetail({
            id:record.id,
            contractId: record.contractId,
            contractCode: record.contractCode,
            currentCenterId:User.currentCenterId,
        }).then((res) => {
            if(res.outCourseDetail.approvalStatus === record.approvalStatus){
                history.push(`${Routes.合同操作详情退课.link}${CommonUtils.stringify({
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
        getOutApplyDetail({
            id:record.id,
            contractId: record.contractId,
            contractCode: record.contractCode,
            currentCenterId:User.currentCenterId,
        }).then((res) => {
            if(res.outCourseDetail.approvalStatus === record.approvalStatus){
                history.push(`${Routes.合同操作详情退课.link}${CommonUtils.stringify({
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

    columns = () => {
        const {outStatusList} = this.props;

        const NONE_APPROVED = outStatusList.filter((item:any) => item.codeValue === '待审批')[0] &&
            outStatusList.filter((item:any) => item.codeValue === '待审批')[0].code;
        return  [{
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
            title: '退课课时',
            dataIndex: 'realityReturnedCourseNum',
            key: 'realityReturnedCourseNum',
        }, {
            title: '退课金额',
            dataIndex: 'refundAmount',
            key: 'refundAmount',
            render: (num:number) => SafeCalculate.autoZero(num)
        }, {
            title: '审批状态',
            dataIndex: 'approvalStatus',
            key: 'approvalStatus',
            render: (text:string, record:any) => {
                const res = outStatusList.filter((item:any) => item.code === text);
                return (
                    <div className="activity-approval-status">
                        <span className={record.approvalStatus === '24001' ? 'contract-colorGray' : record.approvalStatus === '24002' ? 'contract-colorRed' : 'contract-colorGreen'}>
                        </span>
                        <span>{res.length > 0 ? res[0].codeValue : ''}</span>
                    </div>
                )
            }
        }, {
            title: '审批日期',
            dataIndex: 'approvalDate',
            key: 'approvalDate',
            render: (text:string, record:any) => {
                if(record.approvalDate && record.approvalDate !== ''){
                    return moment(text).format("YYYY-MM-DD")
                } else {
                    return ''
                }
            }
        }, {
            title: 'GB',
            dataIndex: 'gbStaffName',
            key: 'gbStaffName',
        }, {
            title: 'GA',
            dataIndex: 'gaStaffName',
            key: 'gaStaffName',
        }, {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            align: 'left',
            render: (text: string, record: any, index: number) =>
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
                    : (<span>
                        <button onClick={() => {this.checkStatusView(record)}} className='gym-button-xxs gym-button-white'>查看</button>
                    </span>)
        }];
    };
    render(){
        const {isOpe} = this.props;
        const {list, visible} = this.state;
        return(
            <div className='gym-contract-info-wrap center mt30'>
                <PageTitle title={
                    <div className='gym-contract-info-wrap-title'>
                        <span  className='gym-contract-info-wrap-title-content'>退课记录</span>
                        {
                            // 审批通过并且，已经付清或者部分付清，才能申请赠课
                            (isOpe)
                                ?<Link to={`${Routes.申请退课.link}${CommonUtils.stringify({contractId: this.props.contractId, contractCode: this.props.contractCode})}`}
                                       className='gym-contract-info-wrap-title-button gym-button-default gym-button-lg'>
                                    申请退课
                                </Link>
                                : <button className='gym-contract-info-wrap-title-button gym-button-greyb gym-button-lg'>申请退课</button>
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
                    handleOk={this.cancelOutRecord}
                    handleCancel={this.onCancel}
                    contentText='是否删除此记录？'
                />
            </div>
        )
    }
}

const CancelClass = applyContent(CancelClassComponent);

export {CancelClass}
