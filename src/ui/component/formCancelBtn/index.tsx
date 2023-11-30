/**
*Desc: 取消按钮-验证表单是否存在未保存信息，若有，弹出弹框
*User: Debby.Deng
*Date: 2018/8/23,
*Time: 上午11:58
*/

import React from 'react';
import{Modal} from '../modal';
import {Button} from 'antd';
import history from "../../../router/history";
import './index.scss';

declare interface BtnProps {
    isChanged :boolean,
    onClick?:any,
    linkTo?:string,//跳转链接
    handleOk?:()=>void,//弹框确定callback
    handleCancel?:()=>void,//弹框取消callback

}

class FormCancelBtn extends React.Component<BtnProps,any>{
    state={
        visible:false,
    };

    changeVisible(isVisible){
        this.setState({visible:isVisible});
    }
    handleClick(){
        const validate=this.props.isChanged;
        if(validate){
            this.setState({visible:true});
        }else{
            this.props.linkTo && history.push(this.props.linkTo);
            this.props.onClick && this.props.onClick()
        }
    }
    componentDidMount(){
    }
    render(){
        return(
            <div className='gym-page-title'>
                <Button onClick={this.handleClick.bind(this)}>取消</Button>
                {
                    this.state.visible &&
                     <Modal
                       visible={this.state.visible}
                       title={"当前页面存在未保存的信息，是否放弃保存？"}
                       btnCancel={"返回编辑页面"}
                       btnOk={"确定放弃保存"}
                       changeVisible={this.changeVisible.bind(this)}
                       handleOk={this.props.handleOk}
                       handleCancel={this.props.handleCancel}
                       />
                }
            </div>
        )
    }
}

export {FormCancelBtn}
