/**
 * desc: 部分退费
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2023/8/16
 * Time: 10:37
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
import {FUNC} from "@/ui/pages/setting/enum/functions";

class PartRefund extends React.Component<any, any> {
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
        return [{
            title: '宝宝姓名',
            dataIndex: 'customerName',
        }, {
            title: '合同编号',
            dataIndex: 'contractCode',
        }, {
            title: '课程包',
            dataIndex: 'centerPackageName',
        }, {
            title: '部分退费正课',
            dataIndex: 'partRefundCourseNum',
        }, {
            title: '部分退费赠课',
            dataIndex: 'partRefundFreeCourseNum',
        }, {
            title: '部分退费金额',
            dataIndex: 'partRefundCoursePrice',
        },{
            title: '审批状态',
            dataIndex: 'approvalStatus',
        }, {
            title: '审批日期',
            dataIndex: 'approvalDate',
            key: 'approvalDate',
            render: (text:number) => text ? moment(text).format("YYYY-MM-DD") : '-'
        }, {
            title: 'GB',
            dataIndex: 'gbName',
        },{
            title: 'GA',
            dataIndex: 'gaName',
        },{
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            align: 'left',
            render: (text: string, record: any) => {
                // 待审批单子，可以取消
                return <Fragment>
                    <Link to={`${Routes.合同操作详情部分退费.link}${CommonUtils.stringify({id: record.id, contractId: record.contractId, contractCode: record.contractCode})}`}>
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
        const {isOpe, contractId, price, contractCode, signTime, reallyAfterDiscountPrice, effectiveTime} = this.props;
        return <div className='gym-contract-info-wrap center mt30'>
            <PageTitle title={
                <div className='gym-contract-info-wrap-title'>
                    <span  className='gym-contract-info-wrap-title-content'>部分退费</span>
                    {
                        (isOpe && User.permissionList.includes(FUNC['部分退费申请']))
                            ? <Link to={`${Routes.申请部分退费.link}${CommonUtils.stringify({
                                contractId: contractId,
                                contractCode: contractCode,
                            })}`}
                                    className='gym-contract-info-wrap-title-button gym-button-default gym-button-lg'>
                                申请部分退费
                            </Link>
                            : <button className='gym-contract-info-wrap-title-button gym-button-greyb gym-button-lg'>申请部分退费</button>
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

export {PartRefund}
