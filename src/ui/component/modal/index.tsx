/**
*Desc: 模态框
*User: Debby.Deng
*Date: 2018/8/23,
*Time: 下午12:16
*/

import React from 'react';
import {Button, Col} from "antd";
import './index.scss';

declare interface BtnProps {
    visible:boolean,
    icon?:string,
    title:string,
    btnCancel?:string,
    btnOk?:string,
    changeVisible?:(status) => void,
    handleOk?:() => void,
    handleCancel?:() => void,
}

class Modal extends React.Component<BtnProps,any>{
    handleCancel(){
        const cancel= this.props.handleCancel;
        this.props.changeVisible(false);
        cancel && cancel();
    }
    handleOk(){
        const confirm=this.props.handleOk;
        this.props.changeVisible(false);
        confirm && confirm();
    }
    render(){
        return(
            <div className={`gym-mask ${this.props.visible? 'show' : 'hide'}`}>
                <div className='gym-page-modal p15 translate_c'>
                    <p>
                        <span className='icon'>{this.props.icon || 'fail'}</span>
                        <span>{this.props.title}</span>
                    </p>
                    <div className='mt15'>
                        <Col span={12} >
                            <Button  type="primary" onClick={this.handleCancel.bind(this)}>{this.props.btnCancel || '取消' }</Button>
                        </Col>
                        <Col span={12}>
                            <Button  onClick={this.handleOk.bind(this)}>{this.props.btnOk || '确定'}</Button>
                        </Col>
                    </div>
                </div>
            </div>
        )
    }
}

export {Modal}
