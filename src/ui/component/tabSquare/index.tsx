/**
 *Desc: 关键信息，基本信息。。。tab列表
 *User: Debby.Deng
 *Date: 2018/10/9,
 *Time: 下午3:46
 */
import './index.scss'
import * as React from "react";
declare interface tabObj{
    title:string,
    id:string,
}
declare interface tabs {
    tabList:Array<tabObj>,
    className?:string,
    onLiClick:(i,id)=>(void),
    activeIndex:number
}
class TabSquare extends React.Component <tabs>{
    state = {};
    handleClick(id,index){
        this.props.onLiClick(index,id);
    }
    render(){
        const {activeIndex}=this.props;
        return (<ul className={`${this.props.className} flex gym-square-tab`}>
            {
                this.props.tabList.map((item,index)=>(
                    <li key={index} className={`${activeIndex===index? 'active' : ''} gym-square-tab-li`}
                        onClick={this.handleClick.bind(this,item.id,index)}>{item.title}</li>
                ))
            }
        </ul>)
    }
}

export {TabSquare}
