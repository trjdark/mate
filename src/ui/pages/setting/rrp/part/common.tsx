/**
 * Desc: 模板
 * User: Colin.Lu
 * Date: 2018/10/12,
 * Time: 上午9:48
 */
import * as React from "react";

declare interface  FrameProps {
    title:string, // 标题
    word:string,
    firstWord:string,
    isExpand:boolean,
    index:number, // 个数索引
}
class CommonFrame extends React.Component<FrameProps, any> {
    state={
        expandWord:this.props.word,
        expandFirstWord:this.props.firstWord,
        isExpand:this.props.isExpand,
        index:this.props.index,
    };
    toggleExpand=()=>{
        if(this.state.isExpand){
            this.setState({
                expandWord:'展开',
                expandFirstWord:'展开',
                expandIcon:'zhankai'
            });
        }else{
            this.setState({
                expandWord:'收起',
                expandFirstWord:'收起',
                expandIcon:'shouqi'
            });
        }
        this.setState({isExpand:!this.state.isExpand});
    };
    render(){
        const {title}=this.props;
        const {expandWord, expandFirstWord, isExpand,index}=this.state;
        return (
            <div className='gym-search-block'>
                <header onClick={this.toggleExpand} className='gym-search-block-header'>
                    <span className='size18 gym-search-block-title'>{title}</span>
                    {
                        index === 0 &&
                        <span className='gym-search-block-expand-word'>
                            {expandFirstWord}
                        </span>
                    }
                    {
                        index !== 0 &&
                        <span className='gym-search-block-expand-word'>
                            {expandWord}
                        </span>
                    }
                </header>
                <div className={`gym-search-block-body ${isExpand ? 'active' :''}`}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}
export {CommonFrame};
