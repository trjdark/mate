/**
 * desc: 申请内容高阶组件
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/11/28
 * Time: 上午10:36
 */
import React from 'react';
import {connect} from "@/common/decorator/connect";
import {selectContractApprovalStatus, selectPaymentStatus} from "@/saga/selectors/contract";

const applyContent = (WrappedComponent) => {
    @connect((state:any) => ({
        approvalStatus: selectContractApprovalStatus(state),
        paymentStatus: selectPaymentStatus(state)
    }))
    class applyContentClass extends React.Component<any, any> {
        render(){
            const {approvalStatus, paymentStatus} = this.props;
            const APPROVED = approvalStatus.filter((item:any) => item.codeValue === '已通过')[0] && approvalStatus.filter((item:any) => item.codeValue === '已通过')[0].code;
            const PAY_OFF = paymentStatus.filter((item:any) => item.codeValue === '结清')[0] && paymentStatus.filter((item:any) => item.codeValue === '结清')[0].code;
            const PART_PAY_OFF = paymentStatus.filter((item:any) => item.codeValue === '待补款')[0] && paymentStatus.filter((item:any) => item.codeValue === '待补款')[0].code;
            return(
                <WrappedComponent
                    approved={APPROVED}
                    payOff={PAY_OFF}
                    partPayOff={PART_PAY_OFF}
                    {...this.props}
                />
            )
        }
    }
    return applyContentClass;
}

export {applyContent};

