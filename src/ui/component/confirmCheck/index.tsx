/**
 * desc: 删除，审批，确认弹框
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/11/15
 * Time: 上午9:58
 */
import React from 'react';
import {Modal as MyModal} from "../customerCreateModal";


declare interface contentContractInfoOption {
    contractNumber:number,
    time:number,
    amount:number,
    contractText?:string
}

declare interface ConfirmCheckProps {
    button?: string | React.ReactNode,
    item:any,
    ensure: (data:any) => void,
    contentText?:string | React.ReactNode,
    contractText?:string,
    contentContractInfo?:contentContractInfoOption
}

class ConfirmCheck extends React.Component<ConfirmCheckProps, any> {
    constructor(props:any){
        super(props)
        this.state = {
            visible: false
        }
    }

    /**
     * 确认按钮
     */
    handleOk = () => {
        const {item, ensure} = this.props;
        ensure(item);
        this.setState({visible:false})
    };
    handleClick = () => {
        this.setState({visible: true})
    }
    render(){
        const {button, contentText, contentContractInfo, contractText} = this.props;
        const {visible} = this.state;
        return (
            <div style={{display: 'inline-block'}}>
                <MyModal
                    visible={visible}
                    handleOk={this.handleOk}
                    handleCancel={() => this.setState({visible: false})}
                    contentText={contentText}
                    contentContractInfo={contentContractInfo}
                    contractText={contractText}
                />
                <div onClick={() => this.handleClick()}>
                    {
                        typeof button === 'string'
                            ? <button className='gym-button-xxs gym-button-white mr5'>{button || '删除'}</button>
                            : button
                    }
                </div>
            </div>
        )
    }
}

export {ConfirmCheck}
