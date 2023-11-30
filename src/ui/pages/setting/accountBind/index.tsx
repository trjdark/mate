/**
 * desc: 账号绑定
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2021/10/19
 * Time: 下午6:53
 */
import React from 'react';
import {BreadCrumb} from "../../../component/breadcrumb";
import {PageTitle} from "@/ui/component/pageTitle";
import {User} from "@/common/beans/user";
import {getEmployeeInfo, bindAccount, queryBindAccount, closeAlert} from "@redux-actions/setting/employee";
import {CardType, GenderType} from "@/ui/pages/setting/enum/employee";
import {Input} from "@/ui/component/input";
import './style/index.scss';
import {Button, Col, Form, Icon, Row} from "antd";
const FormItem = Form.Item;
import {form} from "@/common/decorator/form";
import {connect} from "@/common/decorator/connect";
import { CommonUtils } from '@/common/utils/commonUtils'

@connect(() => ({}), {
    closeAlert
})
@form()
class AccountBind extends React.Component<any, any>{
    private routes:Array<any> = [
        {
            name: '设置',
            path: '',
            link: '#',
            id: 'setting'
        },{
            name: '用户管理',
            path: '',
            link: '#',
            id: 'member'
        },{
            name: '账号绑定',
            path: '',
            link: '#',
            id: 'accountBind'
        }
    ];
    constructor(props: any) {
        super(props);
        this.state = {
            employeeInfo: {},
            flag: false,   // 是否绑定GID
            gymboId: null,
            gymboPwd: null,
            mobile: '',
            bindStatus: '',  // 绑定账号code
            bindStatusMsg: '' // 绑定账号信息
        }
    }
    componentDidMount(){
        const param = {
            id: User.userId,
            currentCenterId: User.currentCenterId,
            staffId: User.userId,
        };
        getEmployeeInfo(param).then((res) => {
            this.setState({employeeInfo: res})
        })
        this.handleBindAccount()
    };

    /**
     * 获取绑定信息
     */
    handleBindAccount = () => {
        const bindParam = {
            newMateUserName: User.userName,
            currentCenterId: User.currentCenterId,
        }
        queryBindAccount(bindParam).then(res=>{
            this.setState({
                              flag: res.gymboId,
                              gymboId: res.gymboId,
                              mobile: res.mobile ? res.mobile : ''

                          })
        })
    }
    /**
     * 改变输入框
     * @param e
     * @param name
     */
    handleChange = (e, name) => {
        const value = e.target.value;
        switch (name) {
            case 'account':
                this.setState({gymboId: value});
                break;
            case 'password':
                this.setState({gymboPwd: value});
                break;
        }
    }
    /**
     * 绑定账号
     */
    handleBind = (e) => {
        e.preventDefault();
        const {validateFields} = this.props.form
        validateFields((errors, values) => {
            return
        });
        const {gymboId, gymboPwd} = this.state;
        if(gymboId && gymboPwd){
            const param = {
                newMateUserName: User.userName,
                fullUsName: gymboId,
                password: gymboPwd,
                currentCenterId: User.currentCenterId,
            }
            bindAccount(param).then((res) => {
                this.setState({
                                  bindStatus: res.code,
                                  bindStatusMsg: res.msg
                              })
                this.props.closeAlert();
                if (res.code === 1) {
                    this.handleBindAccount()
                }
            })
        }
    };
    // 搜索设置
    searchConfig = ():Array<any> => {
        const {employeeInfo}:any = this.state;
        const gender = GenderType.filter((item) => item.value === employeeInfo.gender).length > 0
            ? GenderType.filter((item) => item.value === employeeInfo.gender)[0].name
            : '未知'
        const cardType = CardType.filter((item) => item.value === employeeInfo.idcardType).length > 0
            ? CardType.filter((item) => item.value === employeeInfo.idcardType)[0].name
            : '未知'
        const arr = [
            {
                label: '中文名',
                data: employeeInfo.chineseName
            },{
                label: '英文名',
                data: employeeInfo.englishName
            },{
                label: '性别',
                data: gender
            },{
                label: '证件类型',
                data: cardType
            },{
                label: '证件号码',
                data: employeeInfo.idcard
            },{
                label: '手机号',
                data: employeeInfo.mobile
            },{
                label: '邮箱地址',
                data: employeeInfo.email
            },{
                label: '用户名',
                data: employeeInfo.username
            },
        ]
        return arr
    };

    // 点击跳转查看信息页
    check = ()=>{
        CommonUtils.newWin(process.env.h5_Url, 'h5_Url')
    };
    checkHome = ()=>{
        CommonUtils.newWin(process.env.home_Url, 'home_Url')
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const { gymboId, gymboPwd, flag, bindStatus, bindStatusMsg, mobile}:any = this.state;
        return(
            <div id="gym-account-bind">
                <BreadCrumb routes={this.routes} />
                <div className='page-wrap'>
                    <PageTitle title='Mate员工信息'/>
                    <Form className="gym-common-search-form">
                        {this.searchConfig().map((item,index)=>(
                            <div className="gym-form-item-wrap" key={index}>
                                <FormItem label={item.label} className='gym-form-item'>
                                    <span>{item.data}</span>
                                </FormItem>
                            </div>
                        ))}
                    </Form>
                    <PageTitle
                        title={
                            <div>
                                Gymbo ID信息
                                {
                                    flag ? <span className='gym-account-bind-title'>（已绑定完成Gymbo ID）</span> : <span className='gym-account-bind-title gym-account-bind-title-err'>（当前尚未绑定Gymbo ID）</span>
                                }
                            </div>
                        }
                    />
                    {
                        !flag &&
                        <div>
                            <span className="cDefault font-12 ml45 gym-account-bind-check" onClick={()=> this.check()}>
                                Gymbo ID查询：https://welcome.gymbomate.com/message/login
                            </span>
                            <div className="mt20">
                                <span className="cDefault font-12 ml45 gym-account-bind-check" onClick={()=> this.checkHome()}>
                                    Gymbo ID密码重置，请前往Home系统首页通过手机重置，链接：https://home.gymbomate.com/login
                                </span>
                            </div>
                        </div>
                    }
                    <Form onSubmit={this.handleBind}  className="gym-common-search-form mt20">
                        <Row>
                            <div className="gym-form-item-wrap">
                                <FormItem label={'Gymbo ID'} className='gym-form-item' >
                                    {
                                        getFieldDecorator('gymboId', {
                                            initialValue: gymboId,
                                            rules: [
                                                {
                                                    required: flag?false:true,
                                                    message: '请输入您的Gymbo ID',
                                                },
                                            ],

                                        })(
                                            <Input
                                                type={'text'}
                                                placeholder={`请输入您的Gymbo ID`}
                                                onChange={(e) => this.handleChange(e, 'account')}
                                                prefix={<Icon type="user" className="gym-account-bind-icon" />}
                                                disabled={flag?true:false}
                                            />
                                        )
                                    }
                                </FormItem>
                            </div>
                            <div className="gym-form-item-wrap">
                                {
                                    !flag ?
                                        <FormItem label={'Gymbo ID密码'} className='gym-form-item'>
                                            {
                                                getFieldDecorator('gymboPwd', {
                                                    initialValue: gymboPwd,
                                                    rules: [
                                                        {
                                                            required: flag?false:true,
                                                            message: '请输入您的密码',
                                                        },
                                                    ],
                                                })(
                                                    <Input
                                                        type={'password'}
                                                        placeholder={`请输入您的密码`}
                                                        autoComplete="new-password"
                                                        onChange={(e) => this.handleChange(e, 'password')}
                                                        prefix={<Icon type="lock" className="gym-account-bind-icon" />}
                                                    />
                                                )
                                            }
                                        </FormItem> :
                                        <FormItem label={'手机号'} className='gym-form-item'>
                                            {
                                                getFieldDecorator('mobile', {
                                                    initialValue: mobile
                                                })(
                                                    <Input
                                                        type={'text'}
                                                        prefix={<Icon type="phone" className="gym-account-bind-icon" />}
                                                        disabled={true}
                                                    />
                                                )
                                            }
                                        </FormItem>
                                }
                            </div>
                            <div className="gym-form-item-wrap">
                                {
                                    bindStatus === 1 && <div className="gym-account-bind-status-point" >校验成功</div>
                                }
                                {
                                    bindStatus === 0 && <div className="gym-account-bind-status-point gym-account-bind-status-point-err" >{bindStatusMsg}</div>
                                }
                            </div>
                        </Row>
                        {
                            !flag &&
                            <Row>
                                <Col span={24}>
                                    <FormItem className="text-c">
                                        <Button
                                            className='gym-button-default gym-button-xs  mt15'
                                            htmlType="submit"
                                        >
                                            绑定
                                        </Button>
                                    </FormItem>
                                </Col>
                            </Row>
                        }
                    </Form>
                </div>
            </div>

        )
    }
}

export { AccountBind }
