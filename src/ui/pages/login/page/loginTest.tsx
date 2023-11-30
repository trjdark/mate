/**
 * desc:
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2022/3/17
 * Time: 上午11:44
 */
/**
 * Desc:
 * User: dave.zhang
 */
import React from 'react';
import {Icon, Modal} from 'antd';
import {LoginForm} from "@/ui/pages/login/part/loginForm";
import {CheckAccount} from "@/ui/pages/login/part/checkAccount";
import {PageTitle} from "@/ui/component/pageTitle";
import {loginRequest, reportUserName, } from "@redux-actions/authActions";
import {getBasicOption} from "@redux-actions/homeActions";
import '../style/index';
import {Routes} from "@/router/enum/routes";
import history from "@/router/history";
import {StatusCode} from "@/common/enum/statusCode";
import {Storage} from "@/common/utils/storage";
import {User} from "@/common/beans/user";
import {Cookie} from "@/service/cookie";
import {connect} from "@/common/decorator/connect";

/**
 * 自定义localStorage事件
 */
const orignalSetItem = localStorage.setItem;
localStorage.setItem = function(key,newValue){
    const setItemEvent:any = new Event("setItemEvent");
    setItemEvent.key = key;
    setItemEvent.value = newValue;
    window.dispatchEvent(setItemEvent);
    orignalSetItem.apply(this,arguments);
};



@connect(() => ({}), {reportUserName})
class LoginTest extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            height: window.innerHeight,
            confirmVisible: false,            // 二次确认开关
            loginErrorMsg: false,             // 登陆报错信息
            phone: '',                        // 电话信息(脱敏)
            tmkVisible: false,                // tmk弹层开关
            userInfo: {},                     // 用户信息
        }
    }

    componentDidMount() {
        window.addEventListener('resize', this.onResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize)
    }

    onResize = () => {
        this.setState({height: window.innerHeight})
    };
    /**
     * 登陆
     * @param values
     */
    login = (values:any) => {
        this.setState({loginErrorMsg:false});
        loginRequest(values).then((res:any) => {
            if(res.equipmentId){
                Cookie.setCookie(`${values.username}_equipmentId`, res.equipmentId, 60*60*60*24);
            }
            if(res.hasTmkRole && !res.hasMateRole){
                // 只有TMK角色
                window.location.href =`${process.env.tmk_url}?token=${res.token}`
            }else if(res.hasTmkRole && res.hasMateRole){
                // 即有Mate角色，也有TMK角色
                this.setState({
                    tmkVisible: true,
                    userInfo: res
                });
            }else{
                Storage.multSet({'_token': res.token,});
                User.user = {
                    chineseName: res.chineseName,
                    englishName: res.englishName,
                    userName: res.username,
                    userId: res.userId,
                    currentCenterId: res.primaryCenterId,
                    currentCenterName: res.primaryCenterName,
                    centerCode: res.primaryCenterCode,
                    isHQ: (res.primaryCenterId === 'C_HQ001'),  // C_HQ001 总部中心
                    isAdmin: res.adminUser,                     // 是否是总部人员
                    firstDayOfMonth: res.firstDayOfMonth,
                };
                const param = {
                    staffId: res.userId,
                    currentCenterId: res.primaryCenterId,
                    centerId: res.primaryCenterId,
                };
                getBasicOption(param, {token: res.token}).then((res) => {
                    setTimeout( () => {
                        history.push(Routes.首页.path);
                    }, 300)
                });
            }
        }, (err:any) => {
            if(err.code === StatusCode.密码过期 || err.code === StatusCode.首次登录){
                history.push(Routes.重置密码.path);
            }else if(err.code === StatusCode.账号新设备登陆 || err.code === StatusCode.账号异地登陆){
                Cookie.delCookie(`${values.username}_equipmentId`);
                this.props.reportUserName({
                    username:values.username,
                    password:values.password
                });
                this.setState({
                    phone: err.data,
                    confirmVisible:true,
                })
            }else{
                // 登录失败
                this.setState({
                    loginErrorMsg: err.msg,
                    enableServerErr: true
                })
            }
        })
    };
    /**
     * 跳转不同系统
     */
    linkToSystem = (systemName: 'mate' | 'tmk') => {
        const {userInfo} = this.state;
        switch (systemName) {
            case 'mate':
                Storage.multSet({'_token': userInfo.token,});
                User.user = {
                    chineseName: userInfo.chineseName,
                    englishName: userInfo.englishName,
                    userName: userInfo.username,
                    userId: userInfo.userId,
                    currentCenterId: userInfo.primaryCenterId,
                    currentCenterName: userInfo.primaryCenterName,
                    centerCode: userInfo.primaryCenterCode,
                    isHQ: (userInfo.primaryCenterId === 'C_HQ001'),
                    isAdmin: userInfo.adminUser,
                    firstDayOfMonth: userInfo.firstDayOfMonth,
                };
                const param = {
                    staffId: userInfo.userId,
                    currentCenterId: userInfo.primaryCenterId,
                    centerId: userInfo.primaryCenterId,
                };
                getBasicOption(param, {token: userInfo.token}).then(() => {
                    setTimeout( () => {
                        history.push(Routes.首页.path);
                    }, 300)
                });
                break;
            case 'tmk' :
                window.location.href = `${process.env.tmk_url}?token=${userInfo.token}`
                break;
        }
    };
    render() {
        const {height, confirmVisible, loginErrorMsg, phone, tmkVisible} = this.state;
        const img = require('@/images/loginbg1.png');
        const formbg = require('@/images/loginbg2.png');
        const formTitleImg = require('@/images/loginFormLogo.png');
        return (
            <div id='gym-login' style={{height}}>
                <img src={img} className="imgbg"/>
                <div className="formbg" style={{backgroundImage: `url(${formbg})`}}>
                    <div className="form-wrapper">
                        <img src={formTitleImg} className="form-title-img"/>
                        <div className="user-login">{confirmVisible ? '二次验证' : '用户登录'}</div>
                        {
                            loginErrorMsg &&
                            <div className="pwdErr">
                                <Icon type="close-circle" className="icon-close" theme="filled"/>
                                <span>{loginErrorMsg}</span>
                            </div>
                        }
                        {
                            confirmVisible
                                ? <CheckAccount phone={phone} emitCheck={this.login}/>
                                : <LoginForm emitLogin={this.login}/>
                        }
                    </div>
                </div>
                <Modal
                    visible={tmkVisible}
                    onCancel={() => this.setState({visible:false})}
                    footer={false}
                >
                    <PageTitle title={"请选择需要登录的系统"}/>
                    <div className="text-c mb15">
                        <button className="gym-button-white gym-button-lg" onClick={() => this.linkToSystem('mate')}>GYMBOMATE</button>
                    </div>
                    <div className="text-c">
                        <button className="gym-button-white gym-button-lg" onClick={() => this.linkToSystem('tmk')}>TMK云语音</button>
                    </div>
                </Modal>
            </div>
        )
    }
}

export {LoginTest};
