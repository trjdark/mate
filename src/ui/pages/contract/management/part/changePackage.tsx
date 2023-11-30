/**
 * desc: 改包
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/11/26
 * Time: 下午7:48
 */
import React from 'react';
import {Link} from "react-router-dom";
import {Routes} from "@/router/enum/routes";
import {PageTitle} from "@/ui/component/pageTitle";
import {CommonUtils} from "@/common/utils/commonUtils";
import {connect} from "@/common/decorator/connect";
import {selectChangePkgTypes} from "@/saga/selectors/contract";
import {applyContent} from "./applyContent";
import {User} from "@/common/beans/user";
import {message} from "antd";
import {deleteChangePkg, getChangePkgApplyDetail} from "@redux-actions/contract";
import {Icon} from "@/ui/component/icon";
import {Table} from "@/ui/component/tablePagination";
import * as moment from "moment";
import history from "@/router/history";
import {Modal} from "@/ui/component/customerCreateModal";


declare interface ChangePackageComponentProps {
    contractId:string,
    contractCode:string,
    signTime:number,
    price: number,
    effectiveTime: number,
    reallyAfterDiscountPrice:number,
    aStatus: string,         // 审批状态
    pStatus: string,         // 支付状态
    isOpe:boolean,           // 是否能申请
    approved:string,
    payOff:string,
    partPayOff:string,
    list:Array<any>,
    changePkgStatus?:Array<any>
}

@connect((state:any) => ({
    changePkgStatus: selectChangePkgTypes(state),
    changePkgTypes: selectChangePkgTypes(state)
}))
class ChangePackageComponent extends React.Component<ChangePackageComponentProps, any> {
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
    checkStatusView = (record:any) => {
        /**
         * api
         * @param someParam<>
         * @method post
         */

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
                window.location.reload();
                return false
            }
        }, (err) => {
            // 返回请求reject
            message.error(err.msg);
            window.location.reload();
        });
    };
    columns = () => {
        const {changePkgStatus} = this.props;
        const NONE_APPROVED = changePkgStatus.filter((item:any) => item.codeValue === '待审批')[0] &&
            changePkgStatus.filter((item:any) => item.codeValue === '待审批')[0].code;
        return [{
            title: '宝宝姓名',
            dataIndex: 'babyName',
            key: 'babyName',
        }, {
            title: '合同编号',
            dataIndex: 'contractCode',
            key: 'contractCode',
        }, {
            title: '原课程包',
            dataIndex: 'oldPackageName',
            key: 'oldPackageName',
        }, {
            title: '',
            dataIndex: 'trans',
            key: 'trans',
            render: () => <Icon className='gym-contract-transIcon' type='youjiantou'/>
        }, {
            title: '新课程包',
            dataIndex: 'newPackageName',
            key: 'newPackageName',
        }, {
            title: '差额',
            dataIndex: 'difference',
            key: 'difference',
        }, {
            title: '审批状态',
            dataIndex: 'approvalStatus',
            key: 'approvalStatus',
            render: (text:string, record:any) => {
                const res = changePkgStatus.filter((item:any) => item.code === text);
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
            render: (text:string, record:any) => {
                if(record.approvalDate && record.approvalDate !== ''){
                    return moment(text).format("YYYY-MM-DD")
                } else {
                    return ''
                }
            }
        }, {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            align: 'left',
            render: (text: string, record: any, index: number) =>
                // 申请状态为'未通过'，并且是自己是申请人的情况下
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
    }
    render(){
        const {isOpe} = this.props;
        const {list, visible} = this.state;
        return(
            <div className='gym-contract-info-wrap center mt30'>
                <PageTitle title={
                    <div className='gym-contract-info-wrap-title'>
                        <span  className='gym-contract-info-wrap-title-content'>改课程包</span>
                        {/*Todo 以后其他记录；特殊课程包*/}
                        {
                            // 审批通过并且，已经付清或者部分付清，才能申请赠课
                            (isOpe)
                                ?
                                <Link to={`${Routes.申请改课程包.link}${CommonUtils.stringify({
                                    contractId: this.props.contractId,
                                    price:this.props.price,
                                    contractCode: this.props.contractCode,
                                    signTime: this.props.signTime,
                                    reallyAfterDiscountPrice: this.props.reallyAfterDiscountPrice,
                                    effectiveTime:this.props.effectiveTime
                                })}`}
                                       className='gym-contract-info-wrap-title-button gym-button-default gym-button-lg'>
                                    申请改课程包
                                </Link>
                                : <button className='gym-contract-info-wrap-title-button gym-button-greyb gym-button-lg'>申请改课程包</button>
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
                    handleOk={this.cancelChangePkgRecord}
                    handleCancel={this.onCancel}
                    contentText='是否删除此记录？'
                />
            </div>
        )
    }
}
const ChangePackage = applyContent(ChangePackageComponent);


export {ChangePackage}
