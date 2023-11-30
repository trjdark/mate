/**
 * desc: 申请退课
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/11/27
 * Time: 上午10:06
 */
import React from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import { Form, Row, Col, Radio, DatePicker, Input} from "antd";
import {form} from "@/common/decorator/form";
import {InputNumber, TextArea} from "../../../component/input";
import {CancelButton} from "@/ui/component/cancelButton";
import {UploadImg} from "@/ui/component/uploadImg";
import {CommonUtils} from "@/common/utils/commonUtils";
import {
    createCancelClass,
    getContractUsed,
    getContractOutRemainingCourseCount,
    getContractInfo, isSelectContract
} from "@redux-actions/contract";
import moment from 'moment';
import history from "../../../../router/history";
import {User} from "@/common/beans/user";
import {selectUsageTypes} from "@/saga/selectors/contract";
import {connect} from "@/common/decorator/connect";
import {Message} from "@/ui/component/message/message";
import {BasicContractInfo} from "@/ui/pages/contract/management/part/basicContractInfo";
import {Routes} from "@/router/enum/routes";

const FormItem = Form.Item;

@connect((state:any) => ({
    usageTypeList: selectUsageTypes(state)
}))
@form()
class CreateCancelClass extends React.Component<any, any>{
    private routes:Array<any> = [
        {
            name: '合同',
            path: '',
            link: '#',
            id: 'contract'
        },{
            name: '合同管理',
            path: '',
            link: '#',
            id: 'contractManagement'
        },{
            name: '查看合同',
            path: '',
            link: '#',
            id: 'contractManagementApprovalFlow'
        },{
            name: '申请退课',
            path: '',
            link: '#',
            id: 'createCancelClass'
        }
    ];
    contractId:string;
    contractCode:string;
    constructor(props:any){
        super(props);
        if(CommonUtils.hasParams(props)){
            this.contractId = CommonUtils.parse(props).contractId;
            this.contractCode = CommonUtils.parse(props).contractCode;
        }
        this.state = {
            usage: null,               // 使用情况
            remainCourseNum: null,     // 剩余课时数
            remainCoursePrice: null,   // 剩余金额
            outRemainingCourseCount: null,   // 退课剩余课时数不带赠课
            contractInfo: {},
            isETC: '',
            isElectronic: false,
        }
    }
    componentDidMount(){
        const param = {
            currentCenterId: User.currentCenterId,
            contractId: this.contractId,
            contractCode: this.contractCode
        };
        Promise.all([
            getContractUsed(param),
            getContractOutRemainingCourseCount(param),
            getContractInfo(param),
            isSelectContract({
                currentCenterId: User.currentCenterId,
            })
        ]).then( res => {
            this.setState({
                usage:res[0],
                outRemainingCourseCount: res[1],
                contractInfo: res[2].detail,
                isElectronic: res[3].elecSigningCenter
            })
        })
    }
    static getDerivedStateFromProps(props:any, state:any){
        // 如果获取
        if(props.usageTypeList.length > 0 && state.usage){
            const remain = props.usageTypeList.filter((item:any) => item.codeValue === '剩余');
            const remainCode = remain.length > 0 && remain[0].code;
            const remainInfo = state.usage.filter((item:any) => item.usageType === remainCode);
            return {
                remainCourseNum: remainInfo.length > 0 && remainInfo[0].courseNum,
                remainCoursePrice: remainInfo.length > 0 && remainInfo[0].coursePrice
            }
        }
        return null;
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const {validateFields} = this.props.form;
        validateFields((err:any, values) => {
            values.expectFinancialTime = new Date(new Date(values.expectFinancialTime).toLocaleDateString()).getTime()
            if(!err){
                createCancelClass(Object.assign({}, values, {
                    currentCenterId: User.currentCenterId,
                    contractId: this.contractId
                })).then((res:any) => {
                    history.goBack()
                }, (err) => {
                    Message.error(err.msg)
                })
            }
        })
    };
    /**
     * 上传图片
     * @param file
     */
    handleUploadImg = (file:any, fileList:Array<any>) => {
        const {setFieldsValue} = this.props.form;
        setFieldsValue({attachmentList: fileList.map((item:any) => item.response.data)})
    };
    /**
     * 选择退课时间
     */
    disabledDate = (current) => {
        return current <= moment().startOf('day');
    };
    /**
     * 选择是否使用电子合同
     * @param
     */
    handleSelectISETC = (value: string) => {
        this.setState({
            isETC: value
        })
    }
    render(){
        const {form} = this.props;
        const {getFieldDecorator} = form;
        const { remainCoursePrice, outRemainingCourseCount, contractInfo, isETC, isElectronic} = this.state;
        return(
            <div id='gym-contract-create-cancel-class'>
                <BreadCrumb routes={this.routes}/>
                <div className='page-wrap gym-add-application'>
                    <Form onSubmit={this.handleSubmit} className='gym-contract-add-form'>
                        <BasicContractInfo
                            contractInfo={contractInfo}
                            emitNext={(records)=>{
                                this.setState(preState => {
                                    return {
                                        contractInfo:Object.assign(preState.contractInfo,{records})
                                    }
                                })
                            }}
                        />
                        <div className='gym-contract-add-form-wrap mt30'>
                            <Row>
                                <Col span={12}>
                                    <FormItem label='退课金额' className='gym-contract-add-form-required gym-contract-add-required'>
                                        {
                                            getFieldDecorator('realityReturnedAmount', {
                                                initialValue:remainCoursePrice,
                                                rules: [
                                                    {required: true, message:'请填写退课金额!'}
                                                ],
                                            })(
                                                <InputNumber min={0} step={0.01}/>
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label='退课课时'>
                                        <span>{outRemainingCourseCount ? outRemainingCourseCount : ''}</span>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                {
                                    (isETC === 1 && contractInfo.electronicFlag === 1)&&
                                <Col span={12}>
                                    <FormItem className='gym-contract-add-form-required gym-contract-add-required' label='约定退款时间'>
                                        {
                                            getFieldDecorator('expectFinancialTime', {
                                                initialValue: null,
                                                rules: [
                                                    { required: true, message: '请选择日期!' }
                                                ]
                                            })(
                                                <DatePicker
                                                    style={{ width: 200 }}
                                                    format='YYYY-MM-DD'
                                                    disabledDate={this.disabledDate}
                                                />
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                }
                                <Col span={12}>
                                    <FormItem label='是否使用电子合同' className='gym-contract-add-form-required validate-form'>
                                        {
                                            getFieldDecorator('electronicFlag', {
                                                initialValue: 0,
                                                rules: [
                                                    { required: true, message: '请选择是否使用电子合同' }
                                                ],
                                            })(
                                                <Radio.Group onChange={(e) => this.handleSelectISETC(e.target.value)}>
                                                    <Radio value={1} disabled={(
                                                        !isElectronic ||
                                                        contractInfo.electronicFlag === 0 ||
                                                        contractInfo.contractType==='17004'
                                                    ) ? true : false}>是</Radio>
                                                    <Radio value={0}>否</Radio>
                                                </Radio.Group>
                                            )
                                        }
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                {
                                    isETC === 1 &&
                                    <Col span={12}>
                                        <FormItem label='开户行' className='gym-contract-add-form-required gym-contract-add-required'>
                                            {
                                                getFieldDecorator('openAccountBank', {
                                                    initialValue: '',
                                                    rules: [
                                                        { required: true, message: '请填写开户行!' }
                                                    ],
                                                })(
                                                    <Input maxLength={100} />
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                }
                                {
                                    isETC === 1 &&
                                    <Col span={12}>
                                        <FormItem label='开户名'>
                                            {
                                                getFieldDecorator('openAccountName', {
                                                    initialValue: '',
                                                    rules: [
                                                        { required: true, message: '请填写开户名!' }
                                                    ],
                                                })(
                                                    <Input maxLength={50} />
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                }
                            </Row>
                            <Row>
                                {
                                    isETC === 1&&
                                    <Col span={12}>
                                        <FormItem label='开户账号' className='gym-contract-add-form-required gym-contract-add-required'>
                                            {
                                                getFieldDecorator('openAccount', {
                                                    initialValue: '',
                                                    rules: [
                                                        { required: true, message: '请填写开户账号!' }
                                                    ],
                                                })(
                                                    <Input maxLength={50} />
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                }
                            </Row>
                            <FormItem label='原因说明' className='span gym-contract-add-required'>
                                {
                                    getFieldDecorator('remark',{
                                        rules: [
                                            {required: true, message:'请填写原因说明!'}
                                        ],
                                    })(
                                        <TextArea
                                            placeholder='请输入原因说明'
                                            autosize={{minRows: 2, maxRows: 3}}
                                            style={{width:'80%'}}
                                        />
                                    )
                                }
                            </FormItem>
                            <FormItem label='上传图片' className='span'>
                                {
                                    getFieldDecorator('attachmentList')(
                                        <span>
                                        </span>
                                    )
                                }
                                <UploadImg onChange={this.handleUploadImg} maxFileLength={5}/>
                            </FormItem>

                        </div>
                        <CancelButton
                            form={form}
                            goBackLink={`${Routes.合同详情.link}${CommonUtils.stringify({contractCode:this.contractCode, contractId:this.contractId})}`}
                            submitText='提交'
                        />
                    </Form>
                </div>
            </div>
        )
    }
}

export {CreateCancelClass}
