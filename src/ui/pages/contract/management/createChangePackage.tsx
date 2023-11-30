/**
 * desc: 申请改课程包页面
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/11/26
 * Time: 下午7:49
 */
import React from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {Form, Row, Col, Alert,DatePicker, Radio} from "antd";
import {form} from "@/common/decorator/form";
import {CancelButton} from "@/ui/component/cancelButton";
import {UploadImg} from "@/ui/component/uploadImg";
import {Routes} from "@/router/enum/routes";
import {CommonUtils, SafeCalculate} from "@/common/utils/commonUtils";
import {createChangePkg, getCourseListByCourseType, getContractInfo, isSelectContract} from "@redux-actions/contract";
import history from "../../../../router/history";
import {User} from "@/common/beans/user";
import {Select, Option} from "../../../component/select";
import moment from 'moment';
import {InputNumber, TextArea} from "../../../component/input";
import {Message} from "@/ui/component/message/message";
import { selectSigmaAuth } from "@/saga/selectors/home";
import {BasicContractInfo} from "@/ui/pages/contract/management/part/basicContractInfo";
import { connect } from "@/common/decorator/connect";


const FormItem = Form.Item;
@connect((state: any) => ({
    sigmaAuth: selectSigmaAuth(state),
}))
@form()
class CreateChangePackage extends React.Component<any, any>{
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
            name: '申请改课程包',
            path: '',
            link: '#',
            id: 'createChangePackage'
        }
    ];
    contractId:string;
    contractCode:string;
    signTime?:number;
    effectiveTime?:number;
    DEFAULT_PACKAGE_TYPE = 1;     // 默认课程包类型
    price:number;
    reallyAfterDiscountPrice:number;
    constructor(props:any){
        super(props)
        if(CommonUtils.hasParams(props)){
            this.contractId = CommonUtils.parse(props).contractId;
            // 或取当前合同改包之前的有效期 如果申请改包，则加上要改成的课程包的有效期
            this.signTime = CommonUtils.parse(props).signTime;
            this.effectiveTime = CommonUtils.parse(props).effectiveTime;
            this.contractCode = CommonUtils.parse(props).contractCode;
            this.price = CommonUtils.parse(props).price || 0;
            this.reallyAfterDiscountPrice = CommonUtils.parse(props).reallyAfterDiscountPrice;
        }
        this.state = {
            packageList: [],
            selectedPackage: {},
            contractInfo: {},
            isETC: '',
            isElectronic: false,
        }
    }
    componentDidMount(){
        Promise.all([
            getCourseListByCourseType({currentCenterId: User.currentCenterId, packageType: this.DEFAULT_PACKAGE_TYPE}),
            getContractInfo({
                currentCenterId: User.currentCenterId,
                contractCode: this.contractCode,
                contractId: this.contractId
            }),
            isSelectContract({
                currentCenterId: User.currentCenterId,
            }),
        ]).then((res) => {
            this.setState({
                packageList: res[0],
                contractInfo: res[1].detail,
                isElectronic: res[2].elecSigningCenter
            })
        })
    }
    /**
     * 提交
     * @param e
     */
    handleSubmit = (e) => {
        e.preventDefault();
        const {validateFields} = this.props.form;
        validateFields((err:any, values) => {
            values.expectFinancialTime = new Date(new Date(values.expectFinancialTime).toLocaleDateString()).getTime()
            if(!err){

                createChangePkg(Object.assign({}, values, {
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
     * 选中课程
     */
    selectCourse = (packageId:string) => {
        const {packageList} = this.state;
        const {setFieldsValue} = this.props.form;
        const selectedPackage = packageList.filter((item:any) => item.id === packageId)[0];
        this.setState({
            selectedPackage: selectedPackage,
        });
        setFieldsValue({
            lastPackageCourseNum: selectedPackage.packageNum,
            lastPackageCoursePrice:selectedPackage.actualPrice !== null ? selectedPackage.actualPrice : selectedPackage.packagePrice,
            lastFreeCourseNum: selectedPackage.freeCourseNum // 新包的赠课数可以修改
        })
    };
    /**
     * 选择改包收付款时间
     */
    disabledDate = (current) => {
        return current < moment().startOf('day');
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
        const { form,} = this.props;
        const { packageList, selectedPackage, contractInfo, isETC, isElectronic } = this.state;
        const {getFieldDecorator, getFieldValue} = form;
        const {centerBusinessStatus} = User.tmkStatus;
        const difference:number = getFieldValue('lastPackageCoursePrice')
                            ? getFieldValue('lastPackageCoursePrice')
                                ? SafeCalculate.newMinus(getFieldValue('lastPackageCoursePrice'), this.reallyAfterDiscountPrice)
                                : SafeCalculate.newMinus(this.state.packagePrice, this.reallyAfterDiscountPrice)
                            :0;
        return(
            <div id='gym-contract-create-leave'>
                <BreadCrumb routes={this.routes}/>
                <div className='page-wrap gym-add-application'>
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
                    <Form onSubmit={this.handleSubmit} className='gym-contract-add-form'>
                        <div className='gym-contract-add-form-wrap mt30'>
                            <Row>
                                <Col span={12}>
                                    <FormItem label='新课程包' className='span gym-contract-add-form-required gym-contract-add-required'>
                                        {
                                            getFieldDecorator('lastPackageId', {
                                                rules: [
                                                    {required: true, message:'请选择新课程包'}
                                                ],
                                            })(
                                                <Select
                                                    className='gym-form-item-select'
                                                    onSelect={this.selectCourse}
                                                    style={{width:200}}
                                                >
                                                    {
                                                        packageList
                                                            .filter((item:any) => User.businessSource.map(source => source.businessSourceCode).includes(item.businessSource))
                                                            .map((item:any) =>
                                                            <Option
                                                                key={`pay_type_${item.id}`}
                                                                value={item.id}
                                                            >{item.packageName}
                                                            </Option>
                                                        )
                                                    }
                                                </Select>
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label='实收价格' className='gym-contract-add-form-required gym-contract-add-required'>
                                        {
                                            getFieldDecorator("lastPackageCoursePrice", {
                                                rules: [
                                                    {required: true, message:'请输入实收价格'}
                                                ],
                                            })(
                                                <InputNumber min={0} step={1} precision={2}/>
                                            )
                                        }
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem label='新课时数'>
                                        {
                                            getFieldDecorator('lastPackageCourseNum')(<span/>)
                                        }
                                        <span>{selectedPackage.packageNum || 0}</span>
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label='差额'>
                                        <span>{difference}</span>
                                    </FormItem>
                                </Col>

                            </Row>
                            <Row>

                                <Col span={12}>
                                    <FormItem label='新赠课时数' className='gym-contract-add-form-required gym-contract-add-required'>
                                        {
                                            getFieldDecorator("lastFreeCourseNum", {
                                                rules: [
                                                    {required: true, message:'请输入新赠课数'}
                                                ],
                                            })(
                                                <InputNumber min={0} step={1}/>
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label='新到期日'>
                                        {
                                            selectedPackage.validityPeriod
                                                // 老合同课程包有效期加上新选的课程包的多出来的天数加上赠课时的天数 最后减去1天当前日
                                                ? (moment(this.effectiveTime).subtract('days',1)).add((selectedPackage.validityPeriod + (selectedPackage.freeValidityPeriod ? selectedPackage.freeValidityPeriod : 0) ), 'months').format("YYYY-MM-DD")
                                                : null
                                        }
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem label='新请假次数'>
                                        <span>{selectedPackage.allowAbsenceTimes || 0}</span>
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    {
                                        isETC === 1&&
                                    <FormItem className='gym-act-modal-form gym-contract-date' label='约定收付款时间'>
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
                                    }
                                </Col>
                            </Row>
                            <Row>
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
                                                        contractInfo.contractType==="17004" ||
                                                        contractInfo.businessSource==="75003"
                                                    ) ? true : false}>
                                                        是</Radio>
                                                    <Radio value={0}>否</Radio>
                                                </Radio.Group>
                                            )
                                        }
                                    </FormItem>
                                </Col>
                            </Row>
                            <FormItem label='原因说明' className='span gym-contract-add-form-required gym-contract-add-required'>

                                {
                                    getFieldDecorator('remark', {
                                        rules: [
                                            {required: true, message:'请输入原因说明'}
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
                                    getFieldDecorator('attachmentList')(<span/>)
                                }
                                <UploadImg onChange={this.handleUploadImg} maxFileLength={5}/>
                            </FormItem>
                        </div>
                        <div>
                            <br/>
                            <Alert className='gym-alert' message="原合同有赠课申请将会自动做废，如有需要可在改包完成后重新提交赠课申请！" type="error" />
                            <br/>
                            <Alert className='gym-alert' message="进行不同业务来源的改包操作前请确认课包的预占课时为0，改包后，不允许历史课程使用反签到操作。" type="warning" />
                        </div>
                        <CancelButton
                            isSaveValid={!(centerBusinessStatus && difference > 0)}
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

export {CreateChangePackage}
