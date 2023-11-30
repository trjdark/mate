/**
 * desc: 从home登录mate
 * User: Katarina.Yuan
 * Date: 2021/12/1
 * Time: 下午3:00
 */

import React, {Component} from "react"
import "../style/selectASystem.scss"
import {Storage} from "@/common/utils/storage";
import {User} from "@/common/beans/user";
import {getBasicOption} from "@redux-actions/homeActions";
import history from "@/router/history";
import {Routes} from "@/router/enum/routes";
import {CommonUtils} from "@/common/utils/commonUtils";


class SelectASystem extends Component<any, any> {
    hasTmkRole;
    hasMateRole;
    flag;
    constructor(props) {
        super(props);
        this.state = {
            visible: false,                   // 提示显示
        }
        this.hasTmkRole = CommonUtils.parse(this.props).hasTmk;
        this.hasMateRole = CommonUtils.parse(this.props).hasMate;
        this.flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
    }
    componentDidMount() {
        // 如果以下场景：1，移动端且有mate角色；2，有tmk角色且有mate角色
        if((this.flag && this.hasMateRole) || (this.hasMateRole && this.hasTmkRole)){
            this.setState({visible: true});
            return;
        }
        if(this.hasMateRole && !this.hasTmkRole){

            this.goMate()
        }
        if(this.hasTmkRole && !this.hasMateRole){
            this.goTmk()
        }

    }
    // 跳转到mate PC端
    goMate = () => {
        const param = {
            staffId: User.userId,
            currentCenterId: User.currentCenterId,
            centerId: User.currentCenterId,
            token: Storage.get('_token')
        }
        getBasicOption(param).then((res) => {
            setTimeout( () => {
                history.push(Routes.首页.path);
            }, 300)
        });
    }
    // 跳转到mate 手机端
    goMateC = () => {
        window.location.href =`${process.env.mateMobile_url}?token=${Storage.get('_token')}`
    }
    // 跳转到TMK
    goTmk = () => {
        window.location.href =`${process.env.tmk_url}?token=${Storage.get('_token')}`
    }
    render() {
        return (
            <div>
                {
                    <div className='gym-select-a-system translate_c'>
                        <div className='gym-select-a-system-title'>请选择需要登录的系统</div>
                        {
                            this.hasMateRole &&
                            <button onClick={this.goMate} className='gym-button-default'>GYMBOMATE</button>
                        }
                        {
                            (this.flag && this.hasMateRole) &&
                            <button onClick={this.goMateC} className='gym-button-default'>GYMBOMATE移动端</button>
                        }
                        {
                            this.hasTmkRole &&
                            <button onClick={this.goTmk} className='gym-select-a-system-tmk'>TMK云语音</button>
                        }
                    </div>
                }

            </div>
        )
    }
}
export {SelectASystem}
