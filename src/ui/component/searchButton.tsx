import React from "react";
import {TYPE} from "@/ui/containers/layout/enum/headerEnum";

declare interface searchProps {
    placeholder?:string,
    icon?:string,
    onChange?:(value)=>(void),
    onSearch?: (value, type)=>(void),
}
class SearchInput extends React.Component <searchProps> {
    state={
        value:'',
        iconActive:false,
        type: TYPE.宝宝姓名
    };
    handleChange= (e)=>{
        const value=e.target.value;
        const { onChange }=this.props;
        this.setState({value:value});
        onChange && onChange(value);
        if(value){
            this.setState({iconActive:true});
        }else{
            this.setState({iconActive:false});
        }
    };
    handleEnterEvent=(e)=>{
        const {value, type} = this.state;
        const key=e.keyCode;
        if(key===13 && !e.metaKey && !e.ctrlKey){
            this.props.onSearch(value, type);
        }
    };
    handleClick = (type:string) => {
        this.setState({type: type}, () => {
            this.props.onSearch(this.state.value, this.state.type)
        })
    };
    render (){
        const placeholder=this.props.placeholder || '请输入';
        const {value}=this.state;
        return (
            <div className='gym-search-input-wrap mr15'>
                <input className='gym-search-input' placeholder={`${placeholder}`}
                       onChange={this.handleChange} value={value} onKeyUp={this.handleEnterEvent}/>
                <span className='ml15 mr15'>搜</span>
                <button className='gym-search-button mr5' onClick={() => this.handleClick(TYPE.宝宝姓名)}>宝宝名</button>
                <button className='gym-search-button mr5'onClick={() => this.handleClick(TYPE.手机号)}>手机</button>
                <button className='gym-search-button' onClick={() => this.handleClick(TYPE.联系人)}>联系人</button>
            </div>

        )
    }
}

export {SearchInput}
