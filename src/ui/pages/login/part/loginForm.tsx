/**
 * Desc:
 * User: dave.zhang
 */
import React from 'react';
import {Link} from 'react-router-dom';
import {Form, Icon, Input} from 'antd';
import {form} from "@/common/decorator/form";
import {User} from "@/common/beans/user";
import {Routes} from "@/router/enum/routes";

const FormItem = Form.Item;
const Fragment = React.Fragment;

@form()
class LoginForm extends React.Component<any, any> {
    private form: any;

    constructor(props) {
        super(props);
        this.state = {
            enableServerErr: true,
            loginErrorMsg: undefined,
            validationErrorMsg: undefined,
        }
    }

    /**
     * 提交
     * @param e
     */
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err: any, values: User) => {
            // 正常情况
            if (!err) {
                this.props.emitLogin(values);
            }
        });
    };
    onChange = (e) => {
        this.setState({enableServerErr: false})
    };

    render() {
        const {getFieldDecorator} = this.props.form;

        return (
            <Fragment>
                <Form className='login-form'
                      onSubmit={this.handleSubmit}
                      ref={(ref: any) => this.form = ref}
                >
                    <FormItem>
                        {getFieldDecorator('username', {
                            rules: [
                                {required: true, message: '请输入您的用户名!'},
                            ],
                        })(
                            <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                   placeholder="用户名"
                            />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('password', {
                            rules: [
                                {required: true, message: '请输入您的密码!'},
                            ],
                        })(
                            <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                   type="password"
                                   placeholder="密码"
                            />
                        )}
                    </FormItem>
                    <button className="login-form-button" >
                        登录
                    </button>
                </Form>
                <div className="user-login-reset text-r">
                    <Link to={Routes.重置密码.path}>
                        重置密码
                    </Link>
                </div>
            </Fragment>
        )
    }
}

export {LoginForm}
