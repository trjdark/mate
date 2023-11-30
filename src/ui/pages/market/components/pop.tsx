/**
 * desc: 删除弹框
 * User: Vicky.Yu
 * Date: 2018/11/30
 * Time: 下午2:58
 */
import React from 'react';
import {Modal as MyModal} from "../../../component/customerCreateModal";

declare interface ConfirmCheckProps {
    button?: string | React.ReactNode,
    item:any,
    ensure: (data:any) => void
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
    render(){
        const {button} = this.props;
        const {visible} = this.state;
        return (
            <div style={{display: 'inline-block'}}>
                <MyModal
                    visible={visible}
                    handleOk={this.handleOk}
                    handleCancel={() => this.setState({visible: false})}
                    contentText={'是否确认删除？'}
                />
                {
                    typeof button === 'string'
                        ? <button
                            className='gym-button-xxs gym-button-white'
                            onClick={() => this.setState({visible: true})}>
                            {button || '删除'}
                        </button>
                        : button
                }
            </div>
        )
    }
}

export {ConfirmCheck}
