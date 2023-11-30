/**
 *Desc: 高级查询页面通用组件模板
 *User: Debby.Deng
 *Date: 2018/10/12,
 *Time: 上午9:48
 */
import * as React from "react";

declare interface  frameProps {
    title:string,//标题
    icon:string,
    word:string,
    isExpand:boolean,
}
class CommonFrame extends React.Component<frameProps, any> {
    state={
        expandIcon:this.props.icon,
        expandWord:this.props.word,
        isExpand:this.props.isExpand,
    };
    toggleExpand=()=>{
        if(this.state.isExpand){
            this.setState({expandWord:'展开',expandIcon:'zhankai'});
        }else{
            this.setState({expandWord:'收起',expandIcon:'shouqi'});
        }
        this.setState({isExpand:!this.state.isExpand});
    };
    render(){
        const {title}=this.props;
        const {expandWord,isExpand}=this.state;
       return (
           <div className='gym-search-block'>
               <header onClick={this.toggleExpand} className='gym-search-block-header'>
                   <span className='size18 gym-search-block-title'>{title}</span>
                   <span className='gym-search-block-expand-word'>
                       {expandWord}
                    </span>
               </header>
               <div className={`gym-search-block-body ${isExpand ? 'active' :''}`}>
                   {this.props.children}
               </div>
           </div>
        )
    }
}
export {CommonFrame};
