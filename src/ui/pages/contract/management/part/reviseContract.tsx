/**
 * desc: 合同调整模块
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2021/5/26
 * Time: 上午10:59
 */
import React, {Fragment} from 'react';
import {Link} from "react-router-dom";
import {Routes} from "@/router/enum/routes";
import {CommonUtils} from "@/common/utils/commonUtils";
import {PageTitle} from "@/ui/component/pageTitle";
import {Table} from "@/ui/component/tablePagination";
import moment from 'moment';
import {ConfirmCheck} from "@/ui/component/confirmCheck";
import {cancelContractRevise} from "@redux-actions/contract";
import {User} from "@/common/beans/user";
import {Message} from "@/ui/component/message/message";
import {connect} from "@/common/decorator/connect";
import {
    selectContractReviseStatus,
} from "@/saga/selectors/contract";

@connect((state:any) => ({
    reviseStatus: selectContractReviseStatus(state),
}))
class ReviseContract extends React.Component<any, any> {
    constructor(props:any){
        super(props)
        this.state = {
            list: [],
            isChange:false
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
     * 格式化审批状态
     * @param {string} status
     * @returns {any}
     */
    formatReviseStatus = (status:string) => {
        const {reviseStatus} = this.props;
        const date = reviseStatus.filter(item => item.code === status);
        return date.length > 0 ? date[0].codeValue : '-';
    };
    columns = () => {
        const { reviseTypes, reviseStatus} = this.props;
        return [{
            title: '调整类型',
            dataIndex: 'adjType',
            render:(type:string) => {
                const date = reviseTypes.filter(item => item.code === type);
                return date.length > 0 ? date[0].codeValue : '-';
            }
        }, {
            title: '调整正课课时',
            dataIndex: 'adjustCourseNum',
        }, {
            title: '调整赠课课时',
            dataIndex: 'adjustFreeCourseNum',
        }, {
            title: '调整金额',
            dataIndex: 'adjustCoursePrice',
        }, {
            title: '申请日期',
            dataIndex: 'applyDate',
            render: (time:number) => time ? moment(time).format("YYYY-MM-DD"): null
        }, {
            title: '审批状态',
            dataIndex: 'adjStatus',
            render:(status:string) => {
                const date = reviseStatus.filter(item => item.code === status);
                return date.length > 0 ? date[0].codeValue : '-';
            }
        }, {
            title: '审批日期',
            dataIndex: 'approvalTime',
            key: 'approvalTime',
            render: (text:number) => text ? moment(text).format("YYYY-MM-DD") : '-'
        }, {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            align: 'left',
            render: (text: string, record: any) => {
                // 待审批单子，可以取消
                const NONE_APPROVED = reviseStatus.filter(item => item.codeValue === '待审批')[0];
                if(!NONE_APPROVED){
                    return '-'
                }
                return <Fragment>
                        {
                            (
                                (
                                    record.adjStatus === '1' &&
                                    record.applyBy === User.userId
                                ) || (
                                    (this.formatReviseStatus(record.adjStatus) === '待中心审批') &&
                                    record.applyBy === User.userId
                                )
                            )&&
                            <ConfirmCheck
                                item={record}
                                ensure={this.handleCancel}
                                contentText='是否取消此调整申请？'
                                button={<button className='gym-button-default gym-button-xxs mr15'>取消</button>}
                            />
                        }
                        <Link to={`${Routes.合同操作详情调整.link}${CommonUtils.stringify({id: record.id})}`}>
                            <button className='gym-button-xxs gym-button-white mr10'>查看</button>
                        </Link>
                    </Fragment>
            }
        }];
    };
    handleCancel = (record) => {
        const param = {
            id: record.id,
            currentCenterId: User.currentCenterId
        };
        cancelContractRevise(param).then(() => {
            Message.success('取消成功！', 3, () => {
                window.location.reload();
            })
        })
    };
    render(){
        const {list} = this.state;
        const {isOpe} = this.props;
        return <div className='gym-contract-info-wrap center mt30'>
            <PageTitle title={
                <div className='gym-contract-info-wrap-title'>
                    <span  className='gym-contract-info-wrap-title-content'>合同调整记录</span>
                    {
                        isOpe
                        ? <Link to={`${Routes.申请合同调整.link}${CommonUtils.stringify({
                                contractId: this.props.contractId,
                                price:this.props.price,
                                contractCode: this.props.contractCode,
                                signTime: this.props.signTime,
                                reallyAfterDiscountPrice: this.props.reallyAfterDiscountPrice,
                                effectiveTime:this.props.effectiveTime
                            })}`}
                                className='gym-contract-info-wrap-title-button gym-button-default gym-button-lg'>
                                申请合同调整
                            </Link>
                        : <button className='gym-contract-info-wrap-title-button gym-button-greyb gym-button-lg'>申请合同调整</button>
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
        </div>
    }
}

export {ReviseContract}

