import * as React from "react";
import './index.scss';
import {User} from "@/common/beans/user";

declare interface btnFomat {
    title:string,
    id:string,
    funcId?:string,
}
declare interface btnProps {
    btnOptions:Array<btnFomat>,
    defaultBtn:btnFomat,
    onClick:(id)=>(void),
    className?:string,
    permissionList?:Array<any>
}
class DynamicBtn extends React.Component <btnProps>{
    state={
        showOption:false,
    };
    isExist(funcId){
        if(!funcId){return true}
        return User.permissionList.includes(funcId)
    }
    handleClick=(btn)=>{
        this.props.onClick(btn);
    };
    handleEnter=()=>{
        this.setState({
            showOption:true,
        })
    };
    handleLeave=()=>{
        this.setState({
            showOption:false,
        })
    };
    getOptionDom(){
        const {btnOptions}=this.props;
        const btnGoup=btnOptions.map((btn,index)=>(
            this.isExist(btn.funcId) && <li key={index} className='gym-dynamic-options-li'
                onClick={this.handleClick.bind(this,btn.id)}>{btn.title}</li>
        ));
        return (
            <ul className='pos_abs translate_c gym-dynamic-options'>
                {btnGoup}
            </ul>
        )
    }
    getBtnDom(){
        const {defaultBtn}=this.props;
        return (
            <button
                    className="gym-button-lg gym-button-white">
                    {defaultBtn.title}
            </button>
        )
    }
    render(){
        const {showOption}=this.state;
        const {btnOptions}=this.props;
        let flag=false;
        btnOptions.map((btn)=>{
            if(this.isExist(btn.funcId)){
                flag=true;
            }
        });
        return (
            flag && (<div className={`pos_rel gym-dynamic-btn ${this.props.className}`}
                          onMouseEnter={this.handleEnter}
                          onMouseLeave={this.handleLeave}
            >
                {this.getBtnDom()}
                {showOption? this.getOptionDom() : ''}
            </div>)
        );
    }

}

export {DynamicBtn}
