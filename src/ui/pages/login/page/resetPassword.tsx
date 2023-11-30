/**
 * desc: 重置密码
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2020/10/26
 * Time: 上午9:40
 */
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Form, Icon, Input, Alert} from 'antd';
import{form} from "@/common/decorator/form";
import {handleValidate, Validation, Validate} from "@/common/utils/validate";
import {resetPassword, sendResetPasswordVerifyCode} from "@redux-actions/authActions";
import {Routes} from "@/router/enum/routes";
import history from "@/router/history";
import {Message} from "@/ui/component/message/message";

const FormItem = Form.Item;

@form()
class ResetPassword extends Component<any, any>{
    DEFAULT_TIME = 60;
    SMS_TYPE = '1003002';
    timer:any;
    constructor(props:any){
        super(props);
        this.state = {
            flag: false,
            time: this.DEFAULT_TIME,
            isPasswordTrue: false,
            isResetPasswordTrue:false
        }
    }
    /**
     * 提交
     * @param e
     */
    handleSubmit = (e) => {
        e.preventDefault();
        const {validateFields} = this.props.form;
        validateFields((err, values) => {
            if(!err){
                if(values.newPassword !== values.repeatPassword){
                    Message.error("重复密码不正确");
                    return;
                }
                const param = {
                    userName: values.username,
                    password: values.newPassword,
                    verifyCodeType: this.SMS_TYPE,
                    verifyCode: values.verifyCode,
                };
                resetPassword(param).then(() => {
                    Message.success('重置成功！', 2, () => {
                        history.push(Routes.登录.path);
                    })
                }, (err) => {
                    Message.error(err.msg);
                })
            }
        });
    };
    /**
     * 发送验证信息
     */
    handleSend = (e) => {
        e.preventDefault();
        const {getFieldValue} = this.props.form;
        const username = getFieldValue('username');
        if(!username){
            Message.error("请输入Mate账号");
            return;
        }
        const param = {
            userName:username,
            verifyCodeType: this.SMS_TYPE,
        };
        this.setState({flag:true});
        this.setInterval();
        sendResetPasswordVerifyCode(param).then((res) => {
            Message.success(`验证码已发送至${res.phone},请注意查收!`, 4)
        }, (err) => {
            this.closeInterval();
            Message.error(err.msg);
        });
    };
    /**
     * 倒计时开始
     */
    setInterval = () => {
        this.timer = setInterval(() => {
            if(this.state.time === 0){
                this.closeInterval();
            }else{
                this.setState(prevState => ({
                    time: prevState.time - 1
                }))
            }
        }, 1000)
    };
    /**
     * 倒计时结束
     */
    closeInterval = () => {
        clearInterval(this.timer);
        this.setState({
            flag: false,
            time: this.DEFAULT_TIME,
        })
    };
    /**
     * 验证密码
     */
    checkPassword = (e) => {
        const str = e.target.value;
        if(Validate.check(str, Validation.新密码)){
            this.setState({isPasswordTrue: true});
        }
        if(!Validate.check(str, Validation.新密码) && this.state.isPasswordTrue){
            this.setState({isPasswordTrue: false});
        }
    };
    /**
     * 验证重置密码
     */
    checkResetPassword = (e) => {
        const str = e.target.value;
        const {getFieldValue} = this.props.form;
        if(str && str === getFieldValue('newPassword')){
            this.setState({isResetPasswordTrue: true});
        }
        if(str !== getFieldValue('newPassword') && this.state.isResetPasswordTrue){
            this.setState({isResetPasswordTrue: false});
        }
    };
    render(){
        const {getFieldDecorator} = this.props.form;
        const {flag, time, isPasswordTrue, isResetPasswordTrue} = this.state;
        return(
            <div id="gym-reset" className='gym-reset'>
                <div className='gym-reset-main'>
                    <div className='gym-reset-main-head'>
                        <img src={require('@/images/loginFormLogo.png')} className="imgbg"/>
                        <div className="gym-reset-main-head-title">重置密码</div>
                    </div>
                    <Alert
                        message="请重新设置新密码"
                        type="warning"
                        closable={false}
                        className="mb25"
                    />
                    <Form className='login-form' onSubmit={this.handleSubmit}>
                        <FormItem>
                            {getFieldDecorator('username', {
                                rules: [
                                    {required: true, message: '请输入您的Mate账号!'},
                                ],
                            })(
                                <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                       placeholder="Mate账号"
                                />
                            )}
                        </FormItem>
                        <FormItem className='login-form-check-item'>
                            {getFieldDecorator('verifyCode', {
                                rules: [
                                    {required: true, message: '请输入验证码!'},
                                ],
                            })(
                                <Input type="text" placeholder="4位数字" maxLength={4}/>
                            )}
                            {
                                flag
                                    ? <span className='login-form-check-item-send'>{time}s</span>
                                    : <span className='login-form-check-item-send' onClick={this.handleSend}>点击获取验证码</span>
                            }
                        </FormItem>
                        <FormItem className='login-form-check-item'>
                            {getFieldDecorator('newPassword', {
                                rules: [
                                    {required: true, message: '请输入您的密码!'},
                                    {validator: handleValidate[Validation.新密码]}
                                ],
                            })(
                                <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                       type="password"
                                       placeholder="新密码"
                                       onChange={this.checkPassword}
                                />
                            )}
                            {isPasswordTrue && <Icon className='login-form-check-item-icon' type="check-circle" theme="filled" />}
                        </FormItem>
                        <FormItem className='login-form-check-item'>
                            {getFieldDecorator('repeatPassword', {
                                rules: [
                                    {required: true, message: '请输入您的密码!'},
                                ],
                            })(
                                <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                       type="password"
                                       placeholder="重复密码"
                                       onChange={this.checkResetPassword}
                                />
                            )}
                            {isResetPasswordTrue && <Icon className='login-form-check-item-icon' type="check-circle" theme="filled" />}
                        </FormItem>
                        <button className="login-form-button mb25" >
                            确认重置
                        </button>
                        <Link to={Routes.登录.path} className="login-form-button-back">
                            返回
                        </Link>
                    </Form>
                </div>
            </div>
        )
    }
}

export {ResetPassword};
