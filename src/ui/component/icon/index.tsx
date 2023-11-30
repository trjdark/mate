/**
 * desc: 封装字体
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/9/19
 * Time: 下午5:50
 */
import React,{EventHandler} from 'react';
import './font/iconfont.scss';

declare interface IconProps {
    type:string;
    className?:string;
    onClick?:EventHandler<any>
}

class Icon extends React.Component<IconProps, any>{
    render(){
        return(
            <i onClick={this.props.onClick} className={`iconfont ${this.props.className||""}  icon-${this.props.type}`} />
        )
    }
}

export {Icon}
