/**
 * desc: 跳转登录中间件
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2021/12/9
 * Time: 上午10:27
 */
import React from 'react';
import {Link} from "react-router-dom";
import {Alert} from 'antd';
import {User} from "@/common/beans/user";
import {StatusCode} from "@/common/enum/statusCode";
import {homeMateLoginRequest} from "@redux-actions/authActions";
import {Storage} from "@/common/utils/storage";
import {CommonUtils} from "@/common/utils/commonUtils";
import {Routes} from "@/router/enum/routes";
import history from '@/router/history';
import '../style/index'

class LoginMiddleware extends React.Component<any, any>{
    searchObj:any;                            // 路由参数
    constructor(props) {
        super(props);
        this.state = {
            visible: false,                   // 提示显示
            mappingVisible: false,            // 绑定
            msg:''                            // 错误提示
        };
        this.searchObj = CommonUtils.urlSearchStringToObj(window.location.search);
        if(!this.searchObj['code']){
            history.push(Routes.登录.path);
        }
    }
    componentDidMount() {
        this.login()
    }login = () => {
        // 获取url的code值
        homeMateLoginRequest({ code: this.searchObj['code'], homeUserName: this.searchObj['homeUserName'] }).then(res=>{
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
            history.push(`${Routes.选择登录的系统.link}${CommonUtils.stringify({hasTmk:res.hasTmkRole,hasMate:res.hasMateRole})}`)
        }).catch(rej=>{
            if(rej.code === StatusCode.账号未绑定){
                this.setState({
                    visible: true,
                    mappingVisible: true,
                    msg: rej.msg
                })
            }else{
                this.setState({
                    visible: true,
                    msg: rej.msg
                })
            }
        })

    }
    render(){
        const {visible, mappingVisible, msg} = this.state;
        return (
            <div className="gym-login-middleware">
                {
                    visible &&
                    <div>
                        <Alert
                            message={
                                <div  className='mlr15'>
                                    <div>请注意！</div>
                                    <div className='c999'>{msg}</div>
                                    {mappingVisible && <div><Link to={Routes.登录.path}>前往绑定</Link></div>}
                                </div>
                            }
                            type="warning"
                            className='gym-content-alert'
                            showIcon
                            banner
                        />
                        <div className="gym-login-middleware-prc">
                            <img
                                className="gym-login-middleware-prc-img"
                                src={require('../../../../images/mate_home.png')}
                                alt=""
                            />
                        </div>
                    </div>
                }
            </div>
        )
    }
}

export {LoginMiddleware}
