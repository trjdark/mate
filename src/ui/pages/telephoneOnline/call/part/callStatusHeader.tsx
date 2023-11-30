/**
 * desc:
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2020/2/13
 * Time: 下午8:56
 */
import React, {Component, Fragment} from 'react';
import {Icon} from "@/ui/component/icon";


declare interface CallStatusHeaderProps {
    isCalling:boolean,
    isTalking:boolean,
    isLogin:boolean
}

class CallStatusHeader extends Component<CallStatusHeaderProps, any>{
    render(){
        const {isCalling, isTalking, isLogin} = this.props;
        return(
            <Fragment>
                {
                    isCalling
                        ? isTalking
                        ? <div className="gym-call-head-box-dialing-status">通话中... </div>
                        : <div className="gym-call-head-box-dialing-status">拨号中... </div>
                        : <div/>
                }
                <div className={`gym-call-head-box-login-status ${isLogin ? 'active' : ''}`}>
                    <Icon type="zaixian"/><span>{isLogin ? "已" : '未'}登陆</span>
                </div>
            </Fragment>
        )
    }
}

export {CallStatusHeader}
