/**
*Desc: 新建客户成功 modal
*User: dave.zhang
*Date: 2018/9/26,
*Time: 下午12:16
*/
import React from 'react'
import {Modal as AntModal} from 'antd';
import './modal.scss'
import {Icon} from "@/ui/component/icon";

const Success=(option)=>{
    const finalOption=Object.assign({},{
        width:352,
        className:'gym-confirm-modal',
        icon:<Icon type="yitongguo" className='topIcon'/>,
        okButtonProps:{className:'gym-button-default-xs'},
    },option);
    return AntModal.success(finalOption);
};
export const Confirm=(option)=>{
    const finalOption=Object.assign({},{
        width:352,
        className:'gym-confirm-modal',
        icon: <div className="confirm-topIcon">?</div>,
        okButtonProps:{className:'gym-button-default-xs'},
        cancelButtonProps:{className:'gym-button-white-xs'},
    },option);
    return AntModal.confirm(finalOption)
}
declare interface ModalProps {
    handleOk: (res:any) => void,
    handleCancel: () => void,
    visible: boolean,
    contentText?: string | React.ReactNode,
    contentTitle?:string,
    contractText?:string,
    contentContractInfo?:any,
    hasCancel?:number,
    [propsName:string]:any,
}

class Modal extends React.Component <ModalProps, any>{
    constructor(props) {
        super(props);
    }
    static confirm = AntModal.confirm;
    render() {
        // 组件 props
        const {
          handleOk,
          handleCancel,
          visible,
          contentText,
          contentTitle,
          contentContractInfo,
          contractText,
          hasCancel,
            children,
            ...rest
        } = this.props;

        return(
            <AntModal
              visible={visible}
              onOk={handleOk}
              onCancel={handleCancel}
              wrapClassName='gym-customer-create-specified-modal'
              width={400}
              centered
              closable={false}
              maskClosable={false}
              cancelButtonProps={hasCancel===0?{style:{display:'none'}}:{}}
              {...rest}
            >
                <div className="topIcon">?</div>
                {
                    contentContractInfo &&
                    <div className='gym-contract-confirm-modal'>
                        {
                            contentContractInfo.contractNumber
                            ? (
                                <div className='gym-contract-confirm-modal-content'>
                                    <span className='gym-contract-confirm-modal-label'>合同编号:</span>
                                    <span className='gym-contract-confirm-modal-value gym-contract-confirm-modal-marginLeft'>{contentContractInfo.contractNumber}</span>
                                </div>
                            )
                            : null
                        }
                        {
                            contentContractInfo.time !== undefined
                            ? (
                                <div className='gym-contract-confirm-modal-content'>
                                    <span className='gym-contract-confirm-modal-label'>剩余课时数:</span>
                                    <span className='gym-contract-confirm-modal-value gym-contract-confirm-modal-marginLeft2'>{contentContractInfo.time}</span>
                                </div>
                            )
                            : null
                        }
                        {
                            contentContractInfo.packageNum !== undefined
                                ? (
                                    <div className='gym-contract-confirm-modal-content'>
                                        <span className='gym-contract-confirm-modal-label'>剩余正课时数:</span>
                                        <span className='gym-contract-confirm-modal-value gym-contract-confirm-modal-marginLeft2'>{contentContractInfo.packageNum}</span>
                                    </div>
                                )
                                : null
                        }
                        {
                            contentContractInfo.freeNum !== undefined
                                ? (
                                    <div className='gym-contract-confirm-modal-content'>
                                        <span className='gym-contract-confirm-modal-label'>剩余赠课时数:</span>
                                        <span className='gym-contract-confirm-modal-value gym-contract-confirm-modal-marginLeft2'>{contentContractInfo.freeNum}</span>
                                    </div>
                                )
                                : null
                        }
                        {
                            contentContractInfo.amount !== undefined
                            ? (
                                <div className='gym-contract-confirm-modal-content'>
                                    <span className='gym-contract-confirm-modal-label'>剩余金额:</span>
                                    <span className='gym-contract-confirm-modal-value gym-contract-confirm-modal-marginLeft'>{contentContractInfo.amount}</span>
                                </div>
                            )
                            : null
                        }
                    </div>

                }
                {
                    contentTitle && contentTitle !== '' &&
                    <div className='title'>{contentTitle}</div>
                }
                {
                    contentText && contentText !== '' &&
                    <div className="text">{contentText}</div>
                }
                {
                    contractText && contractText !== '' &&
                    <div className="contract-info">{contractText}</div>
                }
                {children}
            </AntModal>
        )
    }
}


export {Modal,Success}
