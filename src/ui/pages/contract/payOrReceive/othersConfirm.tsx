/**
 * desc: 确认收款 付款页面
 * User: colin.lu
 * Date: 2018/9/01
 * Time: 上午10:00
 */

import React from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {PageTitle} from "@/ui/component/pageTitle";
import {Row, Col, Form, Select, DatePicker, message, Button} from 'antd';
import {CommonUtils} from "@/common/utils/commonUtils";
import {CancelButton} from "@/ui/component/cancelButton";
import {User} from "@/common/beans/user";
import {reason_format, moneyType_format, pay_reason_format, contract_type__format} from "../filter/contractFilter";
import {form} from "@/common/decorator/form";
import {
    getUnContractDetail, confirmUnContract, getContractBasic
} from '@redux-actions/payOrReceiveContract';
import moment from "moment";
import {payTypes} from "../enum/contract";
import {Routes} from "@/router/enum/routes";
import history from "../../../../router/history";
import {Modal} from "@/ui/component/customerCreateModal";

const FormItem = Form.Item;
const SelectOption = Select.Option;

//form装饰器
@form()

class OthersConfirm extends React.Component<any, any> {
    financialContent?:any;
    contractId?:any;
    contractCode?:any;
    financialRecordId?:any;
    estimatedAmount?:any;
    customerName?:string;
    gbName?:string;
    monthAge?:any;
    submitRequestId:string
    constructor(props: any) {
        super(props);
        if (CommonUtils.hasParams(props)) {
            //初始化路由参数
            this.submitRequestId = CommonUtils.generateGuid();
            this.financialContent = CommonUtils.parse(props).financialContent;
            this.contractId = CommonUtils.parse(props).contractId;
            this.contractCode = CommonUtils.parse(props).contractCode;
            this.financialRecordId = CommonUtils.parse(props).financialRecordId;
            this.estimatedAmount = CommonUtils.parse(props).estimatedAmount;
            this.customerName = CommonUtils.parse(props).customerName;
            this.gbName = CommonUtils.parse(props).gbName;
            this.monthAge = CommonUtils.parse(props).monthAge;
        }
        this.state = {
            //路由
            routes: [
                {
                    name: '合同',
                    path: '',
                    link: '#',
                    id: 'contract'
                }, {
                    name: '收付款管理',
                    path: '',
                    link: '#',
                    id: 'contractManagement'
                }, {
                    name: '',
                    path: '',
                    link: '#',
                    id: 'contractManagementPay'
                }, {
                    name: '',
                    path: '',
                    link: '#',
                    id: 'contractManagementRecord'
                }
            ],
            //上传文件列表
            approvalStatus: 'inApproval', //view 查看 edit 编辑 outApproval转出审批 inApproval转入审批
            showAmount: 0,
            allAmount: 0,
            deposit: 0,
            ifChecked: true,
            basicInfo: {
                babyName: '',
                monthAge: '',
                gbstaffname: '',
                gastaffname: '',
                contractCode: '',
                contractId: '',
                contractType: '',
                packageName: '',
                packageType: '',
                reallyAfterDiscountPrice: '',
                totalCoursePrice: null,
                totalCourseNum: null,
                remainingCourseNum: null,
                remainingCoursePrice: null,
                effectiveTime: null,
                endTime: null
            },
            amountInfo: {
                financialContent: null,
                financialId: null,
                hasPayment: null,
                operatorStaffName: null,
                reason: null,
                type: '',
                date: '',
                amount: null,//定金
                financialContentAmount: null,//收付款总金额
                ifChecked: true,
                id: '',
                lastUpdateDate: null,
                financialMode: null,
                financialAmount: null
            },
            visible: false
        };
    }




    componentDidMount() {
        this.setRoutes();
        this.getBasicInfo();
    }

    /**
     * 设置路由显示
     */
    setRoutes = () => {
        if(window.location.href.indexOf('/confirmReceive') > -1) {
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
                        name: '确认收款',
                        path: '',
                        link: '#',
                        id: 'contractManagementRecord'
                    }
                ]
            });
        }else if(window.location.href.indexOf('/confirmPay') > -1){
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
                        name: '确认付款',
                        path: '',
                        link: '#',
                        id: 'contractManagementRecord'
                    }
                ]
            });
        }
    };

    /**
     * 查询基础信息数据
     */
    getBasicInfo = () => {
        if(window.location.href.indexOf('/confirmReceive') > -1){
            if(this.financialContent === 35010 || this.financialContent === 33009){
                //根据contractCode查询注册费的基本信息
                getContractBasic({
                    currentCenterId: User.currentCenterId,
                    contractCode: this.contractCode,
                    contractId: this.contractId
                }).then((res:any)=>{
                    this.setState({
                        basicInfo: res
                    });
                },(err:any)=>{
                    message.error(err.msg);
                })
            }

            //查询收款信息
            getUnContractDetail({
                currentCenterId:User.currentCenterId,
                id:this.financialRecordId
            }).then((res) => {
                this.setState({
                    amountInfo:res
                });
                if(res.financialMode && res.financialMode !== ''){
                    this.props.form.setFieldsValue({packagePayType:res.financialMode})
                }
            }, (err) => {
                //返回请求reject
                message.error(err.msg)
            });


        }else{
            if(this.financialContent === 35010 || this.financialContent === 33009){
                //根据contractCode查询注册费的基本信息
                getContractBasic({
                    currentCenterId: User.currentCenterId,
                    contractCode: this.contractCode,
                    contractId: this.contractId
                }).then((res:any)=>{
                    this.setState({
                        basicInfo: res
                    });
                },(err:any)=>{
                    message.error(err.msg);
                })
            }

            //查询付款信息
            getUnContractDetail({
                currentCenterId:User.currentCenterId,
                id:this.financialRecordId
            }).then((res) => {
                this.setState({
                    amountInfo:res
                });
            }, (err) => {
                //返回请求reject
                message.error(err.msg)
            });
        }
    };

    handleChange = ({file, fileList}) => {
        this.setState({fileList});
    };

    /**
     * 非合同（无定金）确认付款或者收款
     */
    confirm = (e:any) => {
        e.preventDefault();
        this.props.form.validateFields((err) => {
            if(!err){
                //转中心同意或者取消

            }
        });
    };

    /**
     * 选择时间
     */
    disabledDate = (current) => {
        return current && current > moment().endOf('day');
    };

    /**
     * 确认收款
     */
    confirmSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err,values)=>{
            if(!err){
                if(parseInt(values.startMonth) > parseInt(values.endMonth)){
                    message.warning("月龄起止错误！");
                    return null;
                }

                //弹窗展示二次确认
                this.setState({
                    visible: true
                })
            }
        })
    };

    handleOk = () => {
        let postParams = {
            "intent": (window.location.href.indexOf('confirmReceive') > -1) ? "deposit" : "withdraw",
            "financialId": this.state.amountInfo.financialId,
            "currentCenterId": User.currentCenterId,
            "financialAmount": this.state.amountInfo.financialAmount,
            "financialMode": (window.location.href.indexOf('confirmReceive') > -1) ? this.props.form.getFieldsValue().packagePayType : (this.props.form.getFieldsValue().packagePayType),
            "financialDate": moment(this.props.form.getFieldsValue().receiveDate).format('YYYY-MM-DD'),
            "hasPayment": 1
        };
        /**
         * 确认合同收款
         * @param someParam<>
         * @method post
         * @response  res<>
         */
        confirmUnContract(postParams, this.submitRequestId).then(() => {
            if(window.location.href.indexOf('confirmReceive') > -1){
                message.success('收款成功!');
                // history.push(Routes.合同收款管理其他.path)
                history.push(`${Routes.合同收款管理.link}${CommonUtils.stringify({type: 'other'})}`)

            }else{
                message.success('付款成功!');
                // history.push(Routes.合同付款管理其他.path)
                history.push(`${Routes.合同付款管理.link}${CommonUtils.stringify({type: 'other'})}`)

            }
        }, (err) => {
            //返回请求reject
            message.error(err.msg);
        })
    };

    handleCancel = () => {
        this.setState({
            visible: false
        })
    };

    /**
     * 返回收款页面
     */
    returnToReceive = () => {
        if(window.location.href.indexOf('confirmReceive') > -1){
            // history.push(Routes.合同收款管理其他.path)
            history.push(`${Routes.合同收款管理.link}${CommonUtils.stringify({type: 'other'})}`)

        }else{
            // history.push(Routes.合同付款管理其他.path)
            history.push(`${Routes.合同付款管理.link}${CommonUtils.stringify({type: 'other'})}`)

        }
    };

    /**
     * 截取字符串
     */
    lengthFormat = (key:string) => {
        if(key && key.length > 20){
            return (`${key.substr(0,20)}...`)
        }else{
            return key
        }
    };

    render() {
        const {amountInfo, basicInfo} = this.state;
        const {form} = this.props;
        const {getFieldDecorator} = this.props.form;

        let matchReceive = window.location.href.indexOf('/confirmReceive') > -1;
        let matchPay = window.location.href.indexOf('/confirmPay') > -1;

        return (
            <div id={`gym-contract-receive`}>
                <BreadCrumb routes={this.state.routes} />
                <div className='gym-add-application'>
                    {/*基础信息部分*/}
                    <div className='page-wrap gym-contract-content'>
                        <PageTitle title={`基本信息`}/>
                        <div>
                            <div className='gym-contract-table'>
                                <div>
                                    {
                                        (this.financialContent !== 33009 && this.financialContent !== 35010) &&
                                        <div>
                                            <Row className='gym-contract-table-thead'>
                                                <Col span={4}  className='gym-contract-table-thead-babyName gym-contract-table-thead-left'>
                                                    <span className='gym-contract-table-thead-label'>宝宝姓名:</span>
                                                </Col>
                                                <Col span={8}  className=''>
                                                    <span className='gym-contract-table-thead-babyName'>{this.customerName}</span>
                                                </Col>
                                                <Col span={4}  className='gym-contract-table-thead-babyName'>
                                                    <span className='gym-contract-table-thead-label'>月龄:</span>
                                                </Col>
                                                <Col span={8}  className='gym-contract-table-thead-right'>
                                                    <span className='gym-contract-table-thead-babyName'>{this.monthAge}</span>
                                                </Col>
                                            </Row>
                                            <Row className='gym-contract-table-tbody gym-contract-table-tbody-left gym-contract-table-tbody-right'>
                                                <Col span={4}  className='gym-contract-table-tbody-label gym-contract-table-tbody-left'>
                                                    <span>GB:</span>
                                                </Col>
                                                <Col span={20}  className='gym-contract-table-tbody-value gym-contract-table-tbody-right'>
                                                    <span>{this.gbName}</span>
                                                </Col>
                                            </Row>

                                        </div>
                                    }
                                    {
                                        (this.financialContent === 33009 || this.financialContent === 35010) &&
                                        <div>
                                            <Row className='gym-contract-table-thead'>
                                                <Col span={4}  className='gym-contract-table-thead-babyName gym-contract-table-thead-left'>
                                                    <span className='gym-contract-table-thead-label'>宝宝姓名:</span>
                                                </Col>
                                                <Col span={8}  className=''>
                                                    <span className='gym-contract-table-thead-babyName'>{basicInfo.babyName}</span>
                                                </Col>
                                                <Col span={4}  className='gym-contract-table-thead-babyName'>
                                                    <span className='gym-contract-table-thead-label'>月龄:</span>
                                                </Col>
                                                <Col span={8}  className='gym-contract-table-thead-right'>
                                                    <span className='gym-contract-table-thead-babyName'>{basicInfo.monthAge}</span>
                                                </Col>
                                            </Row>
                                            <Row className='gym-contract-table-tbody'>
                                                <Col span={4}  className='gym-contract-table-tbody-label'>
                                                    <span>GB:</span>
                                                </Col>
                                                <Col span={8}  className='gym-contract-table-tbody-value'>
                                                    <span>{basicInfo.gbstaffname}</span>
                                                </Col>
                                                <Col span={4}  className='gym-contract-table-tbody-label'>
                                                    <span>GA:</span>
                                                </Col>
                                                <Col span={8}  className='gym-contract-table-tbody-value'>
                                                    <span>{basicInfo.gastaffname}</span>
                                                </Col>
                                            </Row>
                                            <Row className='gym-contract-table-tbody'>
                                                <Col span={4}  className='gym-contract-table-tbody-label'>
                                                    <span>合同编号:</span>
                                                </Col>
                                                <Col span={8}  className='gym-contract-table-tbody-value'>
                                                    <span>{basicInfo.contractCode}</span>
                                                </Col>
                                                <Col span={4}  className='gym-contract-table-tbody-label'>
                                                    <span>合同类型:</span>
                                                </Col>
                                                <Col span={8}  className='gym-contract-table-tbody-value'>
                                                    <span>{contract_type__format(basicInfo.contractType)}</span>
                                                </Col>
                                            </Row>
                                            <Row className='gym-contract-table-tbody'>
                                                <Col span={4}  className='gym-contract-table-tbody-label'>
                                                    <span>课程包类型:</span>
                                                </Col>
                                                <Col span={8}  className='gym-contract-table-tbody-value'>
                                                    <span>{(basicInfo.packageType === 1) ? '课次产品' : '时段产品'}</span>
                                                </Col>
                                                <Col span={4}  className='gym-contract-table-tbody-label'>
                                                    <span>课程包名称:</span>
                                                </Col>
                                                <Col span={8}  className='gym-contract-table-tbody-value'>
                                                    <span>{basicInfo.packageName}</span>
                                                </Col>
                                            </Row>
                                            <Row className='gym-contract-table-tbody'>
                                                <Col span={4}  className='gym-contract-table-tbody-label'>
                                                    <span>课程数:</span>
                                                </Col>
                                                <Col span={8}  className='gym-contract-table-tbody-value'>
                                                    <span>{basicInfo.totalCourseNum}</span>
                                                </Col>
                                                <Col span={4}  className='gym-contract-table-tbody-label'>
                                                    <span>课程包实收价:</span>
                                                </Col>
                                                <Col span={8}  className='gym-contract-table-tbody-value'>
                                                    <span>{basicInfo.reallyAfterDiscountPrice}</span>
                                                </Col>
                                            </Row>
                                            <Row className='gym-contract-table-tbody'>
                                                <Col span={4}  className='gym-contract-table-tbody-label'>
                                                    <span>剩余课程:</span>
                                                </Col>
                                                <Col span={8}  className='gym-contract-table-tbody-value'>
                                                    <span>{basicInfo.remainingCourseNum}</span>
                                                </Col>
                                                <Col span={4}  className='gym-contract-table-tbody-label'>
                                                    <span>剩余金额:</span>
                                                </Col>
                                                <Col span={8}  className='gym-contract-table-tbody-value'>
                                                    <span>{basicInfo.remainingCoursePrice}</span>
                                                </Col>
                                            </Row>
                                            <Row className='gym-contract-table-tbody gym-contract-table-tbody-bottom'>
                                                <Col span={4}  className='gym-contract-table-tbody-label gym-contract-table-tbody-left'>
                                                    <span>起始日:</span>
                                                </Col>
                                                <Col span={8}  className='gym-contract-table-tbody-value'>
                                                    <span>{moment(basicInfo.effectiveTime).format('YYYY-MM-DD')}</span>
                                                </Col>
                                                <Col span={4}  className='gym-contract-table-tbody-label'>
                                                    <span>到期日:</span>
                                                </Col>
                                                <Col span={8}  className='gym-contract-table-tbody-value gym-contract-table-tbody-right'>
                                                    <span>{moment(basicInfo.endTime).format('YYYY-MM-DD')}</span>
                                                </Col>
                                            </Row>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*收款详情以及定金部分*/}
                    <div className='page-wrap gym-contract-content'>
                        {
                            matchReceive &&
                            <PageTitle title={`收款信息`}/>
                        }
                        {
                            matchPay &&
                            <PageTitle title={`付款信息`}/>
                        }
                        <div>
                            <Form onSubmit={this.confirmSubmit}>
                                <Row
                                    className='gym-contract-table-tbody gym-contract-table-top gym-contract-table-thead-left gym-contract-table-thead-right'>
                                    <Col span={4}
                                         className='gym-contract-table-tbody-label gym-contract-table-thead-left'>
                                        <span>原由:</span>
                                    </Col>
                                    <Col span={8} className='gym-contract-table-tbody-form'>
                                        {
                                            matchReceive
                                                ?
                                                <FormItem className='gym-act-modal-form'>
                                                    {reason_format(amountInfo.financialContent)}
                                                </FormItem>
                                                :
                                                <FormItem className='gym-act-modal-form'>
                                                    {pay_reason_format(amountInfo.financialContent)}
                                                </FormItem>
                                        }
                                    </Col>
                                    {
                                        amountInfo.hasPayment === 0 &&
                                        <Col span={4} className='gym-contract-table-tbody-label  gym-contract-table-required-label'>
                                            {
                                                matchReceive &&
                                                <div>
                                                    <span className='gym-contract-table-required'>*</span>
                                                    <span>收款方式:</span>
                                                </div>
                                            }
                                            {
                                                matchPay &&
                                                <div>
                                                    <span className='gym-contract-table-required'>*</span>
                                                    <span>付款方式:</span>
                                                </div>
                                            }
                                        </Col>
                                    }
                                    {
                                        amountInfo.hasPayment === 1 &&
                                        <Col span={4} className='gym-contract-table-tbody-label'>
                                            {
                                                matchReceive &&
                                                <span>收款方式:</span>
                                            }
                                            {
                                                matchPay &&
                                                <span>付款方式:</span>
                                            }
                                        </Col>
                                    }
                                    <Col span={8} className='gym-contract-table-tbody-form gym-contract-table-thead-right'>
                                        {
                                            amountInfo.hasPayment === 0 &&
                                            <FormItem className='gym-contract-date'>
                                                {
                                                    getFieldDecorator('packagePayType', {
                                                        initialValue:(amountInfo.financialMode && (amountInfo.financialMode)) || '',
                                                        rules: [
                                                            {required: true, message: '请选择收款方式!'}
                                                        ]
                                                    })(
                                                        <Select className='gym-employee-add-select' style={{width:200}}>
                                                            {
                                                                payTypes.map((item: any) => (
                                                                    <SelectOption key={item.postCode} value={item.postCode}>
                                                                        {item.postName}
                                                                    </SelectOption>
                                                                ))
                                                            }
                                                        </Select>
                                                    )
                                                }
                                            </FormItem>
                                        }
                                        {
                                            amountInfo.hasPayment  === 1 &&
                                            <FormItem className='gym-act-modal-form'>
                                                <span>{moneyType_format(amountInfo.financialMode)}</span>
                                            </FormItem>
                                        }
                                    </Col>
                                </Row>
                                <Row className='gym-contract-table-tbody gym-contract-table-tbody-left gym-contract-table-tbody-right'>
                                    {
                                        amountInfo.hasPayment === 0 &&
                                        <Col span={4} className='gym-contract-table-tbody-label gym-contract-table-tbody-left gym-contract-table-required-label'>
                                            {
                                                matchReceive &&
                                                <div>
                                                    <span className='gym-contract-table-required'>*</span>
                                                    <span>收款日期:</span>
                                                </div>
                                            }
                                            {
                                                matchPay &&
                                                <div>
                                                    <span className='gym-contract-table-required'>*</span>
                                                    <span>付款日期:</span>
                                                </div>
                                            }
                                        </Col>
                                    }
                                    {
                                        amountInfo.hasPayment === 1 &&
                                        <Col span={4}
                                             className='gym-contract-table-tbody-label gym-contract-table-tbody-left'>
                                            {
                                                matchReceive &&
                                                <span>收款日期:</span>
                                            }
                                            {
                                                matchPay &&
                                                <span>付款日期:</span>
                                            }
                                        </Col>
                                    }
                                    <Col span={8} className='gym-contract-table-tbody-form'>
                                        {
                                            amountInfo.hasPayment === 0 &&
                                            <FormItem className='gym-contract-date'>
                                                {
                                                    getFieldDecorator('receiveDate', {
                                                        initialValue: amountInfo.financialDate && moment(amountInfo.financialDate),
                                                        rules: [
                                                            {required: true, message: '请选择日期!'}
                                                        ]
                                                    })(
                                                        <DatePicker
                                                            style={{width: 200}}
                                                            disabledDate={this.disabledDate}
                                                        />
                                                    )
                                                }
                                            </FormItem>
                                        }
                                        {
                                            amountInfo.hasPayment === 1 &&
                                            <FormItem className='gym-act-modal-form'>
                                                {
                                                    getFieldDecorator('receiveDate', {
                                                    })(
                                                        <span>
                                                           {this.state.amountInfo.financialDate !== '' ?moment(this.state.amountInfo.financialDate).format('YYYY-MM-DD'):''}
                                                       </span>
                                                    )
                                                }
                                            </FormItem>
                                        }

                                    </Col>
                                    <Col span={4} className='gym-contract-table-tbody-label '>
                                        {
                                            matchReceive &&
                                            <span>收款人:</span>
                                        }
                                        {
                                            matchPay &&
                                            <span>付款人:</span>
                                        }
                                    </Col>
                                    <Col span={8} className='gym-contract-table-tbody-form gym-contract-table-tbody-right'>
                                        <FormItem className='gym-act-modal-form'>
                                            {
                                                amountInfo.hasPayment === 1 &&
                                                `${amountInfo.operatorStaffName}`
                                            }
                                            {
                                                amountInfo.hasPayment === 0 &&
                                                `${User.englishName} ${User.chineseName}`
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                                <div>
                                    {
                                        amountInfo.hasPayment === 0 &&
                                        <div>
                                            <Row className='gym-contract-confirm-content'>
                                                <Col span={10}>
                                                    {
                                                        matchReceive &&
                                                        <span className='gym-contract-confirm-label'>本次收款金额:</span>
                                                    }
                                                    {
                                                        matchPay &&
                                                        <span className='gym-contract-confirm-label'>本次付款金额:</span>
                                                    }
                                                    {
                                                        matchReceive &&
                                                        <span className='gym-contract-confirm-value'>{amountInfo.financialAmount.toFixed(2)}</span>
                                                    }
                                                    {
                                                        matchPay &&
                                                        <span className='gym-contract-confirm-value'>{amountInfo.financialAmount.toFixed(2)}</span>
                                                    }
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col span={24}>
                                                    <CancelButton
                                                        submitText={matchReceive?'收款':'付款'}
                                                        form={form}
                                                        goBackLink={
                                                            matchReceive ? `${Routes.合同收款管理.link}${CommonUtils.stringify({type: 'other'})}` : `${Routes.合同付款管理.link}${CommonUtils.stringify({type: 'other'})}`
                                                        }/>
                                                </Col>
                                            </Row>
                                        </div>
                                    }
                                    {
                                        amountInfo.hasPayment === 1 &&
                                        <div>
                                            <Row className='gym-contract-confirm-content'>
                                                <Col span={10}>
                                                    {
                                                        matchReceive &&
                                                        <span className='gym-contract-confirm-label'>本次收款金额:</span>
                                                    }
                                                    {
                                                        matchPay &&
                                                        <span className='gym-contract-confirm-label'>本次付款金额:</span>
                                                    }
                                                    <span className='gym-contract-confirm-value'>{parseInt(amountInfo.financialAmount).toFixed(2)}</span>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col span={24} className='gym-contract-close-btn'>
                                                    <Button
                                                        htmlType="button"
                                                        className="gym-button-default gym-button-xs"
                                                        onClick={()=>this.returnToReceive()}
                                                    >
                                                        关闭
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </div>
                                    }
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
                <Modal
                    visible={this.state.visible}
                    handleOk={this.handleOk}
                    handleCancel={this.handleCancel}
                    contentText={`确定要给${this.financialContent !== 33009 ? this.lengthFormat(this.customerName) : this.lengthFormat(basicInfo.babyName)}进行${matchReceive?`${reason_format(amountInfo.financialContent)}的收款吗？`:`${pay_reason_format(amountInfo.financialContent)}的付款吗？`}`}
                />
            </div>
        )
    }
}

export {OthersConfirm}

