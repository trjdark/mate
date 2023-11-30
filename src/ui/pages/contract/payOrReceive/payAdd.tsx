/**
 * desc: 新建付款付款申请
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/11/1
 * Time: 下午8:07
 */
import React from 'react';
import moment from 'moment';
import {BreadCrumb} from "../../../component/breadcrumb";
import {PageTitle} from "../../../component/pageTitle";
import {Col, Form, message, Row, InputNumber, DatePicker} from "antd";
import {form} from "../../../../common/decorator/form";
import {SelectLeadsInput} from "./part/SelectLeadsInput";
import {ReasonSelect} from "./part/ReasonSelect";
import {Select, Option} from "../../../component/select";
import {payTypes} from "../enum/contract";  //receiveReasons
import {CancelButton} from "../../../component/cancelButton";
import {Routes} from "@/router/enum/routes";
import history from "../../../../router/history";
import {
    creatPayOrReceive,
} from "@redux-actions/payOrReceiveContract"; //getPaymentManagement
import {User} from "../../../../common/beans/user";
import {CommonUtils} from "@/common/utils/commonUtils";

const FormItem = Form.Item;

@form()
class PayAddApplication extends React.Component<any, any> {
    submitRequestId:string;
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
            relatedFinancialRecordId:'',
            gbName:'',
            month:'',
            babyName:'',
            reason: null,
            contractCode:'',
            contractId:'',
            financialContent:'',
            contractReasonName: ''
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
     * 判断是付款还是付款的新增
     */
    checkType = () => {
        if(this.props.location.search == '?type=receive') {
            this.setState({
                //付款
                intent:'withdraw'
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
        this.props.form.resetFields();
        setFieldsValue({
            babyName: leads.babyName,
            reason: undefined,
            amount: undefined
        });
        this.setState({
            babyName: leads.babyName,
            leadsId:leads.leadsId,
            gbName: leads.gbName,
            month: leads.monthAge,
            reason: undefined,
            contractReasonName: ''
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
            reason: value.financialContent,
            contractCode: value.contractCode,
            contractId: value.contractId,
            financialContent: value.financialContent,
            relatedFinancialRecordId: value.financialId
        });
        if(value.financialContent === 33001){
            this.props.form.setFieldsValue({
                'reason': '定金'
            })
            this.setState({
                contractReasonName: '定金'
            })
        }else if(value.financialContent === 33002){
            this.props.form.setFieldsValue({
                'reason': '合同'
            })
            this.setState({
                contractReasonName: '合同'
            })
        }else if(value.financialContent === 33003){
            this.props.form.setFieldsValue({
                'reason': '转中心'
            })
            this.setState({
                contractReasonName: '转中心'
            })
        }else if(value.financialContent === 33004){
            this.props.form.setFieldsValue({
                'reason': '材料'
            })
            this.setState({
                contractReasonName: '材料'
            })
        }else if(value.financialContent === 33005){
            this.props.form.setFieldsValue({
                'reason': '活动'
            })
            this.setState({
                contractReasonName: '活动'
            })
        }else if(value.financialContent === 33006){
            this.props.form.setFieldsValue({
                'reason': '玩具'
            })
            this.setState({
                contractReasonName: '玩具'
            })
        }else if(value.financialContent === 33007){
            this.props.form.setFieldsValue({
                'reason': '其他'
            })
            this.setState({
                contractReasonName: '其他'
            })
        }else if(value.financialContent === 33008){
            this.props.form.setFieldsValue({
                'reason': '改包'
            })
            this.setState({
                contractReasonName: '改包'
            })
        }else if(value.financialContent === 33009){
            this.props.form.setFieldsValue({
                'reason': '注册费'
            })
            this.setState({
                contractReasonName: '注册费'
            })
        }
        this.props.form.setFieldsValue({
            'amount': value.financialAmount
        })
    };

    onSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err:any) => {
            if (!err) {
                let postData = {};
                if(this.state.intent === 'withdraw') {
                    // 判断付款是否新增类型为注册费
                    if(this.props.form.getFieldsValue().reason === '注册费'){
                        postData ={
                            intent: this.state.intent,
                            financialContent: this.state.financialContent + 2001,
                            financialAmount: this.props.form.getFieldsValue().amount,
                            financialDate: moment(this.props.form.getFieldsValue().date).startOf('day').valueOf(),
                            financialMode: this.props.form.getFieldsValue().type,
                            leadsId: this.state.leadsId,
                            relatedFinancialRecordId: this.state.relatedFinancialRecordId,
                            contractId: this.state.contractId,
                            centerId: User.currentCenterId
                        }
                    }else{
                        postData ={
                            intent: this.state.intent,
                            financialContent: this.state.financialContent + 2000,
                            financialAmount: this.props.form.getFieldsValue().amount,
                            financialDate: moment(this.props.form.getFieldsValue().date).startOf('day').valueOf(),
                            financialMode: this.props.form.getFieldsValue().type,
                            leadsId: this.state.leadsId,
                            relatedFinancialRecordId: this.state.relatedFinancialRecordId,
                            centerId: User.currentCenterId
                        }
                    }
                }
                creatPayOrReceive(postData, this.submitRequestId).then(() => {
                    message.success('新建成功');
                    history.push(`${Routes.合同付款管理.link}${CommonUtils.stringify({type: 'other'})}`)
                }, (err:any) => {
                    message.error(err.msg);
                })
            }
        })
    };

    /**
     * 选择时间
     */
    disabledDate = (current) => {
        // Can not select days before today and today
        return current && current > moment().endOf('day');
    };

    render(){
        const {form} = this.props;
        const {month, gbName, routes, contractReasonName} = this.state;
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
                                                <FormItem>
                                                    <span>
                                                        {this.state.contractCode}
                                                    </span>
                                                </FormItem>
                                            </Col>
                                        </div>

                                    }
                                </Row>
                            </div>
                            <PageTitle title={`付款信息`} className='mt30'/>
                            <div className='gym-add-application-form'>
                                <Row
                                    className='gym-contract-table-tbody gym-contract-table-top gym-contract-table-thead-left gym-contract-table-thead-right'>
                                    <Col span={4} className='gym-contract-table-tbody-label gym-contract-table-required-label'>
                                        <span className='gym-contract-table-required'>*</span>
                                        <span>原由:</span>
                                    </Col>
                                    <Col span={8} className='gym-contract-table-tbody-form'>
                                        <FormItem className='gym-act-modal-form gym-contract-reason gym-contract-date'>
                                            {
                                                getFieldDecorator('reason', {
                                                    rules: [
                                                        {required: true, message:'请选择原由'}
                                                    ],
                                                })(
                                                    <ReasonSelect
                                                        setChosenReasonByContract={this.setChosenReasonByContract}
                                                        leadsId={this.state.leadsId}
                                                        relatedFinancialRecordId={this.state.relatedFinancialRecordId}
                                                        contractReasonName={contractReasonName}
                                                    />
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col span={4} className='gym-contract-table-tbody-label gym-contract-table-required-label'>
                                        <span className='gym-contract-table-required'>*</span>
                                        <span>付款方式:</span>
                                    </Col>
                                    <Col span={8} className='gym-contract-table-tbody-form gym-contract-table-thead-right'>
                                        <FormItem className='gym-act-modal-form gym-contract-payandreceive-select gym-contract-date'>
                                            {
                                                getFieldDecorator('type', {
                                                    rules: [
                                                        {required: true, message:'请选择付款方式'}
                                                    ],
                                                })(
                                                    <Select placeholder='请选择' style={{width: 200}}>
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
                                        <span>付款日期:</span>
                                    </Col>
                                    <Col span={8} className='gym-contract-table-tbody-form'>
                                        <FormItem className='gym-contract-date'>
                                            {
                                                getFieldDecorator('date', {
                                                    rules: [
                                                        {required: true,message: '请选择付款日期'}
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
                                        <span>付款金额:</span>
                                    </Col>
                                    <Col span={8} className='gym-contract-table-tbody-form gym-contract-table-thead-right'>
                                        <FormItem className='gym-act-modal-form gym-contract-date'>
                                            {
                                                getFieldDecorator('amount', {
                                                    rules: [
                                                        {required: true, message:'请输入付款金额'}
                                                    ],
                                                })(
                                                    <InputNumber style={{width:'200px'}} min={0} precision={2} disabled={true}/>
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row
                                    className='gym-contract-table-tbody gym-contract-table-top gym-contract-table-tbody-left  gym-contract-table-tbody-right'>
                                    <Col span={4} className='gym-contract-table-tbody-label'>
                                            <span>付款人:</span>
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
                            <CancelButton submitText='提交' form={form} goBackLink={`${Routes.合同付款管理.link}${CommonUtils.stringify({type: 'other'})}`}/>
                        </Form>
                    </div>
                </div>
            </div>
        )
    }
}

export {PayAddApplication}
