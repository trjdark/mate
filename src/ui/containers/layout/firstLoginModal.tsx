/**
 * desc: 第一次登陆弹框
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2019/8/20
 * Time: 上午11:08
 */
import React from 'react';
import {Modal} from 'antd';
import {User} from "@/common/beans/user";

class FirstLoginModal extends React.Component<any, any>{
    state = {
        visible: User.getIsFirstLogin
    }
    handleSure = () => {
        this.setState({visible: false})
        User.user = Object.assign({}, User.user, {firstDayOfMonth: false})
    };
    render(){
        const {visible} = this.state;
        return(
            <Modal
                visible={visible}
                closable={false}
                footer={false}
            >
                <div className="gym-first-login-modal-body">
                    <p className="high-light">请进入设置-账号设置</p>
                    <p className="high-light">更新本月伙伴变动信息（如有）</p>
                    <p>及时更新有助于</p>
                    <p>保护中心和客户信息</p>
                    <p>修改1位伙伴仅需1分钟</p>
                </div>
                <div className="gym-first-login-modal-footer">
                    <button className="gym-button-xs gym-button-default" onClick={this.handleSure}>确认</button>
                </div>
            </Modal>
        )
    }
}

export {FirstLoginModal}
