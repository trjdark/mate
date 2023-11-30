/**
 * desc: 二次验证
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2020/11/4
 * Time: 上午9:58
 */
import React, {Component, Fragment} from 'react';
import {Form, Input} from 'antd';
import {Icon} from "@/ui/component/icon";
import {form} from "@/common/decorator/form";
import {sendVerifyCode} from "@redux-actions/authActions";
import {Message} from "@/ui/component/message/message";
import {selectUsername} from "@/saga/selectors/login/login";
import {connect} from "@/common/decorator/connect";

const FormItem = Form.Item;

@form()
@connect((state) => ({
    username: selectUsername(state)
}))
class CheckAccount extends Component<any, any>{
    SMS_TYPE = '1003002';
    VOICE_TYPE = '1003001';
    DEFAULT_TIME = 60;
    timer:any;
    state = {
        verifyCodeType: this.SMS_TYPE,
        flag: false,
        time: this.DEFAULT_TIME,
    };
    /**
     * 提交
     * @param e
     */
    handleCheck = (e) => {
        e.preventDefault();
        const {getFieldValue} = this.props.form;
        if(!getFieldValue('verifyCode') || getFieldValue('verifyCode').length !== 4){
            Message.error("请输入有效的验证码！");
            return;
        }
        const {verifyCodeType} = this.state;
        const {username, password} = this.props.username;

        const param = {
            username, password,
            verifyCodeType,
            verifyCode: getFieldValue('verifyCode')
        };
        this.props.emitCheck(param);
    };
    /**
     * 发送验证信息
     */
    handleSend = (e) => {
        e.preventDefault();
        const {username} = this.props.username;
        const {verifyCodeType} = this.state;
        const param = {
            userName:username,
            verifyCodeType,
        };
        this.setState({flag:true});
        this.setInterval();
        sendVerifyCode(param).then(() => {
            Message.success("发送成功！")
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
     * 切换验证方式œ
     */
    changeType = () => {
        this.closeInterval();
        const {setFieldsValue} = this.props.form;
        setFieldsValue('verifyCode', null);
        const {verifyCodeType} = this.state;
        if(verifyCodeType === this.SMS_TYPE){
            this.setState({
                verifyCodeType: this.VOICE_TYPE
            })
        }else{
            this.setState({
                verifyCodeType: this.SMS_TYPE
            })
        }
    };
    componentWillUnmount(){
        this.closeInterval();
    }
    render(){
        const {getFieldDecorator} = this.props.form;
        const {phone} = this.props;
        const {flag, time, verifyCodeType} = this.state;
        return(
            <Fragment>
                <Form className='login-form'
                      onSubmit={this.handleCheck}
                >
                    <FormItem>
                        <div className='text-c'>
                            <Icon type="beizhu" className="login-form-icon"/>
                            <span>您正在使用手机{verifyCodeType === this.SMS_TYPE ? '短信' : '语音'}验证身份</span>
                        </div>

                    </FormItem>
                    <FormItem label="手机号码" className='login-form-check-item'>
                        <span>{phone}</span>
                    </FormItem>
                    <FormItem label="验证码" className='login-form-check-item'>
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
                    {
                        verifyCodeType === this.VOICE_TYPE &&
                        <div className="login-form-brief">
                            <div className="login-form-brief-text">
                                <Icon className="login-form-brief-text-icon" type='yitongguo'/>
                                <span>请注意接听电话，15分钟内输入有效，验证码等同于密码，请不要轻易告知他人</span>
                            </div>
                        </div>
                    }
                    <button className="login-form-button" >确定</button>
                </Form>
                <div className="login-form-desc">
                    <span>手机不可用？请联系CD修改</span>
                    <span className="cDefault" onClick={this.changeType}>其他验证方式</span>
                </div>
            </Fragment>
        )
    }
}

export {CheckAccount}
