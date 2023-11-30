/**
 * desc: 新建收款付款申请
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/11/1
 * Time: 下午8:07
 */
import React from 'react';
import {BreadCrumb} from "../../../component/breadcrumb";
import {PageTitle} from "../../../component/pageTitle";
import {Col, Form, message, Row, InputNumber, DatePicker} from "antd";
import moment from 'moment';
import {form} from "../../../../common/decorator/form";
import {SelectLeadsInput} from "./part/SelectLeadsInput";
import {ContractListInput} from "./part/ContractListInput";
import {ReasonSelect} from "./part/ReasonSelect";
import {Select, Option} from "../../../component/select";
import {receiveReasons, payTypes} from "../enum/contract";
import {CancelButton} from "../../../component/cancelButton";
import {Routes} from "@/router/enum/routes";
import history from "../../../../router/history";
import {creatPayOrReceive,} from "@redux-actions/payOrReceiveContract"; //getPaymentManagement
import {User} from "../../../../common/beans/user";
import {CommonUtils} from "@/common/utils/commonUtils";
import {Modal} from "@/ui/component/customerCreateModal";

const FormItem = Form.Item;

@form()
class ReceiveAddApplication extends React.Component<any, any> {
    submitRequestId:string
    constructor(props:any){
        super(props);
        this.submitRequestId = CommonUtils.generateGuid();
        this.state = {
            //路由
            routes: [
                {
                    name: '合同',
                    path: '',
                    link: '#',
                    id: 'contract'
                },{
                    name: '收付款管理',
                    path: '',
                    link: '#',
                    id: 'contractManagement'
                },{
                    name: '',
                    path: '',
                    link: '#',
                    id: 'contractManagementPayReceive'
                },{
                    name: '新建申请',
                    path: '',
                    link: '#',
                    id: 'add'
                }
            ],
            intent:'',
            addName: '',
            leadsId:'',
            gbName:'',
            month:'',
            babyName:'',
            reason: null,
            contractCode:'',
            contractId:'',
            isChecked: false,
            checkVisible:false,
            msg: ''
        }
    }

    componentDidMount(){
        this.setRoutes();
        this.checkType();
    }

    /**
     * 设置路由显示
     */
    setRoutes = () => {
        if(window.location.search == '?type=receive') {
            this.setState({
                routes:[
                    {
                        name: '合同',
                        path: '',
                        link: '#',
                        id: 'contract'
                    },{
                        name: '收付款管理',
                        path: '',
                        link: '#',
                        id: 'contractManagement'
                    },{
                        name: '收款管理',
                        path: '',
                        link: '#',
                        id: 'contractManagementPay'
                    },{
                        name: '新建申请',
                        path: '',
                        link: '#',
                        id: 'contractManagementRecord'
                    }
                ]
            });
        }else if(window.location.search == '?type=pay'){
            this.setState({
                routes:[
                    {
                        name: '合同',
                        path: '',
                        link: '#',
                        id: 'contract'
                    },{
                        name: '收付款管理',
                        path: '',
                        link: '#',
                        id: 'contractManagement'
                    },{
                        name: '付款管理',
                        path: '',
                        link: '#',
                        id: 'contractManagementPay'
                    },{
                        name: '新建申请',
                        path: '',
                        link: '#',
                        id: 'contractManagementRecord'
                    }
                ]
            });
        }
    };

    /**
     * 判断是收款还是付款的新增
     */
    checkType = () => {
        if(this.props.location.search == '?type=receive') {
            this.setState({
                //收款
                intent:'deposit'
            });
        }else if(this.props.location.search == '?type=pay'){
            this.setState({
                //付款
                intent:'withdraw'
            });
        }
    };

    /**
     * 选中的宝宝信息赋值
     */
    setChosenBabyInfo = (leads) =>{
        const {setFieldsValue} = this.props.form;
        setFieldsValue({
            babyName: leads.babyName,
        });
        this.setState({
            babyName: leads.babyName,
            leadsId:leads.leadsId,
            gbName: leads.gbName,
            month: leads.monthAge
        });
    };

    /**
     * 选中的宝宝信息赋值
     */
    setChosenContract = (contract) =>{
        this.setState({
            contractId: contract.id,
            contractCode: contract.contractCode
        });
        this.props.form.setFieldsValue({
            contractInput: contract.contractCode
        })
    };

    /**
     * 选中的宝宝信息赋值
     */
    setReason = (value) =>{
        this.setState({
            reason: value
        });
    };

    /**
     * 选中的宝宝信息赋值
     */
    setChosenReasonByContract = (value) =>{
        this.setState({
            reason: value.financialContent
        });
        if(value.financialContent === 33001){
            this.props.form.setFieldsValue({
                'reason': '定金'
            })
        }else if(value.financialContent === 33002){
            this.props.form.setFieldsValue({
                'reason': '合同'
            })
        }else if(value.financialContent === 33003){
            this.props.form.setFieldsValue({
                'reason': '转中心'
            })
        }else if(value.financialContent === 33004){
            this.props.form.setFieldsValue({
                'reason': '材料'
            })
        }else if(value.financialContent === 33005){
            this.props.form.setFieldsValue({
                'reason': '活动'
            })
        }else if(value.financialContent === 33006){
            this.props.form.setFieldsValue({
                'reason': '玩具'
            })
        }else if(value.financialContent === 33007){
            this.props.form.setFieldsValue({
                'reason': '其他'
            })
        }else if(value.financialContent === 33008){
            this.props.form.setFieldsValue({
                'reason': '改包'
            })
        }else if(value.financialContent === 33009){
            this.props.form.setFieldsValue({
                'reason': '注册费'
            })
        }
    };

    onSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err:any, values) => {
            if (!err) {
                if(!this.state.isChecked){
                    if(values.amount > 1000 && values.reason === 33009){
                        this.setState({
                            checkVisible:true,
                            msg: '请检查，您填写的金额存在过大的风险，如无异常麻烦再次提交，谢谢！',
                            isChecked: true
                        })
                        return;
                    }
                }

                let postData = {
                    intent: this.state.intent,
                    financialContent: values.reason,
                    financialAmount: values.amount,
                    financialDate: moment(values.date).startOf('day').valueOf(),
                    financialMode: values.type,
                    leadsId: this.state.leadsId,
                    centerId: User.currentCenterId,
                    contractId: this.state.contractId,
                };
                // if(this.state.intent === 'deposit') {
                //     //判断收款是否新增类型为注册费
                //     if(this.props.form.getFieldsValue().reason === 33009){
                //         postData ={
                //             intent: this.state.intent,
                //             financialContent: this.props.form.getFieldsValue().reason,
                //             financialAmount: this.props.form.getFieldsValue().amount,
                //             financialDate: moment(this.props.form.getFieldsValue().date).startOf('day').valueOf(),
                //             financialMode: this.props.form.getFieldsValue().type,
                //             leadsId: this.state.leadsId,
                //             contractId: this.state.contractId,
                //             centerId: User.currentCenterId
                //         }
                //     }else{
                //         postData ={
                //             intent: this.state.intent,
                //             financialContent: this.props.form.getFieldsValue().reason,
                //             financialAmount: this.props.form.getFieldsValue().amount,
                //             financialDate: moment(this.props.form.getFieldsValue().date).startOf('day').valueOf(),
                //             financialMode: this.props.form.getFieldsValue().type,
                //             leadsId: this.state.leadsId,
                //             centerId: User.currentCenterId
                //         }
                //     }
                // }else if(this.state.intent === 'withdraw'){
                //     //判断付款是否新增类型为注册费
                //     if(this.props.form.getFieldsValue().reason === 33009 || this.state.reason === 33009){
                //         postData ={
                //             intent: this.state.intent,
                //             financialContent: this.state.reason,
                //             financialAmount: this.props.form.getFieldsValue().amount,
                //             financialDate: moment(this.props.form.getFieldsValue().date).startOf('day').valueOf(),
                //             financialMode: this.props.form.getFieldsValue().type,
                //             leadsId: this.state.leadsId,
                //             contractId: this.state.contractId,
                //             centerId: User.currentCenterId
                //         }
                //     }else{
                //         postData ={
                //             intent: this.state.intent,
                //             financialContent: this.props.form.getFieldsValue().reason,
                //             financialAmount: this.props.form.getFieldsValue().amount,
                //             financialDate: moment(this.props.form.getFieldsValue().date).startOf('day').valueOf(),
                //             financialMode: this.props.form.getFieldsValue().type,
                //             leadsId: this.state.leadsId,
                //             centerId: User.currentCenterId
                //         }
                //     }
                // }

                // Todo success
                creatPayOrReceive(postData, this.submitRequestId).then(() => {
                    message.success('新建成功');
                    // history.push(`${Routes.合同收款管理其他.path}`)
                    history.push(`${Routes.合同收款管理.link}${CommonUtils.stringify({type: 'other'})}`)
                }, (err:any) => {
                    message.error(err.msg);
                })
            }
        })
    };
    handleSubmit = () => {
        this.props.form.validateFields((err:any, values) => {
            if (!err) {
                let postData = {
                    intent: this.state.intent,
                    financialContent: values.reason,
                    financialAmount: values.amount,
                    financialDate: moment(values.date).startOf('day').valueOf(),
                    financialMode: values.type,
                    leadsId: this.state.leadsId,
                    centerId: User.currentCenterId,
                    contractId: this.state.contractId,
                };
                creatPayOrReceive(postData, this.submitRequestId).then(() => {
                    message.success('新建成功');
                    history.push(`${Routes.合同收款管理.link}${CommonUtils.stringify({type: 'other'})}`)
                }, (err:any) => {
                    message.error(err.msg);
                })
            }
        })
    }
    /**
     * 选择时间
     */
    disabledDate = (current) => {
        return current && current > moment().endOf('day');
    };

    render(){
        const {form} = this.props;
        const {month, gbName, routes, checkVisible, msg} = this.state;
        const { getFieldDecorator } = form;
        return (
            <div id={`gym-add-application`}>
                <BreadCrumb routes={routes} />
                <div className='page-wrap gym-add-application'>
                    <div>
                        <Form onSubmit={this.onSubmit}>
                            <PageTitle title={`基本信息`}/>
                            <div>
                                <Row
                                    className='gym-contract-table-tbody gym-contract-table-top gym-contract-table-thead-left gym-contract-table-thead-right'>
                                    <Col span={4} className='gym-contract-table-tbody-label gym-contract-table-thead-left gym-contract-table-required-label'>
                                        <span className='gym-contract-table-required'>*</span>
                                        <span>宝宝姓名:</span>
                                    </Col>
                                    <Col span={8} className='gym-contract-table-tbody-form'>
                                        <FormItem className='gym-act-modal-form gym-contract-babyName'>
                                            {
                                                getFieldDecorator('babyName', {
                                                    initialValue: '',
                                                    rules: [
                                                        {required: true,message: '请输入宝宝姓名'}
                                                    ],
                                                })(
                                                    <SelectLeadsInput
                                                        setChosenBabyInfo={this.setChosenBabyInfo}
                                                    />
                                                )
                                            }

                                        </FormItem>
                                    </Col>
                                    <Col span={4}
                                         className='gym-contract-table-tbody-label'>
                                        <span>月龄:</span>
                                    </Col>
                                    <Col span={8} className='gym-contract-table-tbody-form gym-contract-table-thead-right'>
                                        <FormItem className='gym-act-modal-form'>
                                            <span>{month}</span>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row
                                    className='gym-contract-table-tbody gym-contract-table-top gym-contract-table-tbody-left gym-contract-table-tbody-right'>
                                    <Col span={4}
                                         className='gym-contract-table-tbody-label'>
                                        <span>GB:</span>
                                    </Col>
                                    <Col span={8} className='gym-contract-table-tbody-form'>
                                        <FormItem className='gym-act-modal-form'>
                                            <span>{gbName}</span>
                                        </FormItem>
                                    </Col>
                                    {
                                        this.state.reason === 33009  && this.state.leadsId && this.state.leadsId !== ''  &&
                                        <div>
                                            <Col span={4}
                                                 className='gym-contract-table-tbody-label'>
                                                <span>合同编号:</span>
                                            </Col>
                                            <Col span={8} className='gym-contract-table-tbody-form gym-contract-table-tbody-right'>
                                                <FormItem className='gym-contract-contractId'>
                                                    {
                                                        getFieldDecorator('contractInput', {
                                                            rules: [
                                                                {required: true,message: '请选择合同编号'}
                                                            ],
                                                        })(
                                                            <ContractListInput
                                                                setChosenContract={this.setChosenContract}
                                                                leadsId={this.state.leadsId}
                                                            />
                                                        )
                                                    }
                                                </FormItem>
                                            </Col>
                                        </div>

                                    }
                                </Row>
                            </div>
                            <PageTitle className='mt30' title={`收款信息`}/>
                            <div className='gym-add-application-form'>
                                <Row
                                    className='gym-contract-table-tbody gym-contract-table-top gym-contract-table-thead-left gym-contract-table-thead-right'>
                                    <Col span={4} className='gym-contract-table-tbody-label gym-contract-table-thead-left gym-contract-table-required-label'>
                                        <span className='gym-contract-table-required'>*</span>
                                        <span>原由:</span>
                                    </Col>
                                    <Col span={8} className='gym-contract-table-tbody-form'>
                                        <FormItem className='gym-act-modal-form gym-contract-payandreceive-select gym-contract-date'>
                                            { this.state.intent === 'deposit' &&
                                            getFieldDecorator('reason', {
                                                rules: [
                                                    {required: true, message:'请选择原由'}
                                                ],
                                            })(
                                                <Select onChange={this.setReason} placeholder='请选择' style={{width:'200px'}}>
                                                    {// todo 筛选收款原由
                                                        receiveReasons.filter((item:any, index:number) => index > 2).map((item:any) =>
                                                            <Option
                                                                key={`reason_${item.postCode}`}
                                                                value={item.postCode}
                                                            >{item.postName}</Option>
                                                        )
                                                    }
                                                </Select>
                                            )
                                            }
                                            { this.state.intent === 'withdraw' &&
                                            getFieldDecorator('reason', {
                                                rules: [
                                                    {required: true, message:'请选择原由'}
                                                ],
                                            })(
                                                <ReasonSelect
                                                    setChosenReasonByContract={this.setChosenReasonByContract}
                                                    leadsId={this.state.leadsId}
                                                />
                                            )
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col span={4} className='gym-contract-table-tbody-label gym-contract-table-required-label'>
                                        <span className='gym-contract-table-required'>*</span>
                                        <span>收款方式:</span>
                                    </Col>
                                    <Col span={8} className='gym-contract-table-tbody-form gym-contract-table-thead-right'>
                                        <FormItem className='gym-act-modal-form gym-contract-payandreceive-select gym-contract-date'>
                                            {
                                                getFieldDecorator('type', {
                                                    rules: [
                                                        {required: true, message: '请选择收款方式'}
                                                    ],
                                                })(
                                                    <Select placeholder='请选择' style={{width:200}}>
                                                        {
                                                            // todo 筛选原由
                                                            payTypes.map((item:any) =>
                                                                <Option
                                                                    key={`pay_type_${item.postCode}`}
                                                                    value={item.postCode}
                                                                >{item.postName}</Option>
                                                            )
                                                        }
                                                    </Select>
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row
                                    className='gym-contract-table-tbody gym-contract-table-top'>
                                    <Col span={4} className='gym-contract-table-tbody-label gym-contract-table-required-label'>
                                        <span className='gym-contract-table-required'>*</span>
                                        <span>收款日期:</span>
                                    </Col>
                                    <Col span={8} className='gym-contract-table-tbody-form'>
                                        <FormItem className='gym-contract-date'>
                                            {
                                                getFieldDecorator('date', {
                                                    rules: [
                                                        {required: true, message: '请选择收款日期'}
                                                    ],
                                                })(
                                                    <DatePicker
                                                        style={{width: 200}}
                                                        disabledDate={this.disabledDate}
                                                    />
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col span={4} className='gym-contract-table-tbody-label gym-contract-table-required-label'>
                                        <span className='gym-contract-table-required'>*</span>
                                        <span>收款金额:</span>
                                    </Col>
                                    <Col span={8} className='gym-contract-table-tbody-form gym-contract-table-thead-right'>
                                        <FormItem className='gym-act-modal-form gym-contract-date'>
                                            {
                                                getFieldDecorator('amount', {
                                                    rules: [
                                                        {required: true, message:'请输入收款金额'}
                                                    ],
                                                })(
                                                    <InputNumber min={0} precision={2} style={{width:'200px'}}/>
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row
                                    className='gym-contract-table-tbody gym-contract-table-top gym-contract-table-tbody-left  gym-contract-table-tbody-right'>
                                    <Col span={4} className='gym-contract-table-tbody-label'>
                                        <span>收款人:</span>
                                    </Col>
                                    <Col span={20} className='gym-contract-table-tbody-form'>
                                        <FormItem className='gym-act-modal-form'>
                                            {
                                                getFieldDecorator('receiver', {
                                                })(
                                                    <span>
                                            {`${User.englishName} ${User.chineseName}`}
                                        </span>
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                            </div>
                            {/*todo 返回路径*/}
                            <CancelButton form={form} submitText='提交' goBackLink={`${Routes.合同收款管理.link}${CommonUtils.stringify({type: 'other'})}`}/>
                        </Form>
                        <Modal
                            visible={checkVisible}
                            contentText={msg}
                            footer={false}
                        >
                            <button
                                className='gym-button-default gym-button-xs footButton'
                                onClick={() => {this.setState({checkVisible:false, msg: ''})}}
                            >知道了</button>
                        </Modal>
                    </div>
                </div>
            </div>
        )
    }
}

export {ReceiveAddApplication}
