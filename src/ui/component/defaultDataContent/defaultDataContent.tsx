/**
 * desc: 默认显示
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/11/23
 * Time: 下午3:28
 */
import React from 'react';

class DefaultDataContent extends React.Component<any, any>{
    render(){
        return(
            <div className={`gym-contract-info-wrap-content ${this.props.className}`}>
                <div className='gym-contract-info-wrap-content-no-data'>
                    <img className='gym-contract-info-wrap-content-no-data-img' src={require('../../../images/default.png')} alt=""/>
                    <span className='gym-contract-info-wrap-content-no-data-text'>暂无数据</span>
                </div>
            </div>
        )
    }
}

export {DefaultDataContent}
