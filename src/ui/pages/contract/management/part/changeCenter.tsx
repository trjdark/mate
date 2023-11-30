/**
 * desc:
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/11/23
 * Time: 下午3:25
 */
import React, {Fragment} from 'react';
import {Link} from "react-router-dom";
import {Routes} from "@/router/enum/routes";
import {PageTitle} from "@/ui/component/pageTitle";
import {CommonUtils} from "@/common/utils/commonUtils";
import {applyContent} from './applyContent';
import moment from 'moment';
import {Icon} from "@/ui/component/icon";
import {connect} from "@/common/decorator/connect";
import {selectChangeCenterTypes} from "@/saga/selectors/contract";
import {message} from "antd";
import {deleteChangeCenter, getChangeCenterDetail} from "@redux-actions/contract";
import {User} from "@/common/beans/user";
import {Table} from "@/ui/component/tablePagination";
import history from "@/router/history";
import {Modal} from "@/ui/component/customerCreateModal";
import {selectApprovalPermission} from "@/saga/selectors/home";

declare interface ApplyLeaveProps {
    contractId:string,
    contractCode:string,
    list: Array<any>,
    aStatus: string,         // 审批状态
    pStatus: string,         // 支付状态
    isOpe:boolean,           // 是否能申请
    approved:string,
    payOff:string,
    partPayOff:string,
    changeCenterStatusList?:Array<any>
    approvalPermission?:Array<any>
}

@connect((state:any) => ({
    changeCenterStatusList: selectChangeCenterTypes(state),
    approvalPermission: selectApprovalPermission(state)
}))
class ChangeCenterComponent extends React.Component<ApplyLeaveProps, any> {
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
                    list: this.state.list.filter((item:any) => item.id !== this.state.id)
                })
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
     *检查状态
     */
    checkStatusEdit = (record:any) => {
        /**
         * api
         * @param someParam<>
         * @method post
         */

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
     */
    contractColumns = () => {
        const {changeCenterStatusList, approvalPermission}:any = this.props;
        return [{
            title: '宝宝姓名',
            dataIndex: 'babyName',
            key: 'babyName',
        }, {
            title: '合同编号',
            dataIndex: 'contractCode',
            key: 'contractCode',
        }, {
            title: '转出中心',
            dataIndex: 'outCenterName',
            key: 'outCenterName',
            render: (text:string, record:any) => <span>{`${record.outCenterCode}-${text}`}</span>
        }, {
            title: '',
            dataIndex: 'trans',
            key: 'trans',
            render: () => <Icon className='gym-contract-transIcon' type='youjiantou'/>
        }, {
            title: '转入中心',
            dataIndex: 'rollInCenterName',
            key: 'rollInCenterName',
            render: (text:string, record:any) => <span>{`${record.rollInCenterCode}-${text}`}</span>
        }, {
            title: '转中心金额',
            dataIndex: 'rollOutCourseAmount',
            key: 'rollOutCourseAmount',
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
            render: (text:string, record:any) => {
                if(record.approvalDate && record.approvalDate !== ''){
                    return moment(text).format("YYYY-MM-DD")
                } else {
                    return ''
                }
            }
        },{
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            align: 'left',
            render: (text: string, node: any) => {
                const uid = User.userId, curId = User.currentCenterId;
                // key 为订单状态_是否本人创建_是否为转入中心_是否有审批/转入撤回权限_是否有 转出撤回权限; 1=是，0=否
                const key = `${node.approvalStatus}_${node.createBy ===  uid ? '1' : '0'}_${node.rollInCenterId === curId ? '1' : '0'}_${approvalPermission.transferCenterApproval ? '1' : '0'}`;
                let result;
                switch (key) {
                    case '22001_1_0_0':
                    case '22001_1_0_1':
                        result = (
                            <Fragment>
                                <button onClick={() => {this.checkStatusEdit(node)}} className='gym-button-xxs gym-button-white mr5'>编辑</button>
                                <button onClick={()=>this.deleteDetail(node)} className='gym-button-xxs gym-button-white mr5'>删除</button>
                            </Fragment>
                        );
                        break;
                    case '22001_0_0_1':
                        result = (
                            <Fragment>
                                <button onClick={() => {this.checkStatusView(node)}} className='gym-button-xxs gym-button-white mr5'>查看</button>
                                <button onClick={()=>this.deleteDetail(node)} className='gym-button-xxs gym-button-white mr5'>删除</button>
                            </Fragment>
                        );
                        break;
                    default:
                        result =  <button onClick={() => {this.checkStatusView(node)}} className='gym-button-xxs gym-button-white mr5'>查看</button>
                        break;
                }
                return result;
            }
        }];
    }
    render(){
        const {isOpe} = this.props;
        const {list, visible} = this.state;
        return(
            <div className='gym-contract-info-wrap center mt30'>
                <PageTitle title={
                    <div className='gym-contract-info-wrap-title'>
                        <span  className='gym-contract-info-wrap-title-content'>转中心记录</span>
                        {
                            // 审批通过并且，已经付清或者部分付清，才能申请赠课
                            (isOpe)
                                ?<Link to={`${Routes.申请转中心.link}${CommonUtils.stringify({contractId: this.props.contractId, contractCode: this.props.contractCode})}`}
                                       className='gym-contract-info-wrap-title-button gym-button-default gym-button-lg'>
                                    申请转中心
                                </Link>
                                : <button className='gym-contract-info-wrap-title-button gym-button-greyb gym-button-lg'>申请转中心</button>
                        }
                    </div>
                }/>
                <div className='gym-table-wrap gym-no-bottom'>
                    <div className='gym-table-wrap-contract'>
                        <Table
                            columns={this.contractColumns()}
                            dataSource={list}
                            rowKey='id'
                        />
                    </div>
                </div>
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

const ChangeCenter = applyContent(ChangeCenterComponent);

export {ChangeCenter}

