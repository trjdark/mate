/**
 * desc: 申请合同调整
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2021/5/27
 * Time: 下午3:05
 */
import React from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {Form, Row, Col} from "antd";
import {form} from "@/common/decorator/form";
import {CancelButton} from "@/ui/component/cancelButton";
import {Routes} from "@/router/enum/routes";
import {CommonUtils, SafeCalculate} from "@/common/utils/commonUtils";
import {getDelayInfoForCreate, getContractInfo, createRevise} from "@redux-actions/contract";
import history from "../../../../router/history";
import {User} from "@/common/beans/user";
import {InputNumber, TextArea} from "@/ui/component/input";
import {Select, Option} from "@/ui/component/select";
import {connect} from "@/common/decorator/connect";
import {selectContractApprovalStatus} from "@/saga/selectors/contract";
import {selectContractReviseType, selectContractReviseStatus} from "@/saga/selectors/contract";
import {UploadDownloadFiles} from "@/ui/component/uploadDownloadFiles";
import {getCenter} from "@redux-actions/setting/center";

const FormItem = Form.Item;

@form()
@connect((state:any) => ({
    reviseTypes: selectContractReviseType(state),
    reviseStatus: selectContractReviseStatus(state),
    approvalStatus: selectContractApprovalStatus(state)
}))
class CreateRevision extends React.Component<any, any>{
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
            name: '合同调整申请',
            path: '',
            link: '#',
            id: 'createRevision'
        }
    ];
    contractId:string;
    contractCode:string;
    endTime:any;
    constructor(props:any){
        super(props);
        if(CommonUtils.hasParams(props)){
            this.contractId = CommonUtils.parse(props).contractId;
            this.contractCode = CommonUtils.parse(props).contractCode;
            this.endTime = CommonUtils.parse(props).endTime;
        }

        this.state = {
            basicInfo:{
                historyTotalContractExtentionCount: null,
                validityPeriod: null
            },
            contractInfo: {},
            attachmentList: [],
            isFinancialAdjust: false
        }
    }

    componentDidMount() {
        const param = {
            currentCenterId: User.currentCenterId,
            contractCode: this.contractCode,
            contractId: this.contractId
        };
        Promise.all([
            getDelayInfoForCreate(param),
            getContractInfo(param),
            getCenter({
                id: User.currentCenterId,
                currentCenterId: User.currentCenterId
            }),
        ]).then(res => {
            this.setState({
                basicInfo: res[0],
                contractInfo: res[1].detail,
                isFinancialAdjust: !!res[2].isFinancialAdjust
            })
        })
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const {validateFields} = this.props.form;
        const {contractInfo, attachmentList} = this.state;
        validateFields((err:any, values) => {
            if(!err){
                const param = Object.assign({}, values, {
                    attachmentList: attachmentList.map(item => ({id:item.attachmentId, fileName:item.attachmentName})),
                    contractCode: contractInfo.contractCode,
                    contractId: contractInfo.contractId,
                    currentCenterId: User.currentCenterId,
                    preCourseNum: SafeCalculate.sub(contractInfo.remainingCourseNum, contractInfo.remainingFreeCourseNum),
                    preCoursePrice: contractInfo.remainingCoursePrice,
                    preFreeCourseNum: contractInfo.remainingFreeCourseNum,
                    adjustCourseNum: values.afterCourseNum_calc ? values.afterCourseNum_adjust : values.afterCourseNum_adjust * -1,
                    adjustFreeCourseNum: values.afterFreeCourseNum_calc ? values.afterFreeCourseNum_adjust : values.afterFreeCourseNum_adjust * -1,
                    adjustCoursePrice: values.afterCoursePrice_calc ? values.afterCoursePrice_adjust : values.afterCoursePrice_adjust * -1,
                });
                createRevise(param).then((res) => {
                    history.goBack();
                })
            }else{}
        })
    };
    /**
     * 合同审批状态
     * @param type
     * @returns {string}
     */
    formatReviseStatus = (status:any):string => {
        const {reviseStatus} = this.props;
        const res = reviseStatus.filter((item:any) => item.code === status);
        return res.length > 0 ? res[0].codeValue : '-';
    };
    /**
     * 上传附件
     * @param id 附件id
     * @param name 附件name
     */
    handleSetAttachment = (id, name) => {
        this.setState( prevState => ({
                attachmentList: [...prevState.attachmentList, {
                    attachmentId: id,
                    attachmentName: name
                }]
            })
        )
    };
    /**
     * 取消附件
     * @param {number} i
     */
    handleCancelAttachment = (index:number) => {
        this.setState( prev => {
            return {
                attachmentList: CommonUtils.DelectArrayElementByIndex( prev.attachmentList ,index)
            }
        });
    };
    /**
     * 计算数字
     */
    handleChangeNum = (value:number, type: 'calc'| 'num', name:string, oldValue:number) => {
        const {form} = this.props;
        // 当调整数字不存在的条件下
        if(!value && type === 'num'){
            form.setFieldsValue({
                [name]: oldValue,
            });
            return;
        }
        // 如果改变数字
        if(type === 'num' && typeof value === 'number'){
            const calc = form.getFieldValue(`${name}_calc`);
            form.setFieldsValue({
                [name]: calc ? SafeCalculate.newPlus(oldValue, value) : SafeCalculate.newMinus(oldValue, value)
            })
        }else{
            const date = form.getFieldValue(`${name}_adjust`);
            form.setFieldsValue({
                [name]: value ? SafeCalculate.newPlus(oldValue, date) : SafeCalculate.newMinus(oldValue, date)
            })
        }

    };
    /**
     * 检查数字
     * @param e
     * @param name
     */
    checkNum = (e, name) => {
        const value = e.target.value;
        const {form} = this.props;

        if(!value){
            form.setFieldsValue({
                [name]: 0
            })
        }
    };
    /**
     * 调整类型
     */
    handleChangeAdjType = (e) => {
        const {reviseTypes, form} = this.props;
        const {contractInfo} = this.state;
        const res = reviseTypes.filter((item:any) => item.codeValue === '操作错误');
        // 操作错误code值
        const errCode =  res.length > 0 && res[0].code;
        if(e === errCode) {
            form.setFieldsValue({
                afterCoursePrice_calc: 1,
                afterCoursePrice_adjust: 0,
                afterCoursePrice: contractInfo.remainingCoursePrice
            })
        }
    };
    render(){
        const {form, reviseTypes} = this.props;
        const {contractInfo, attachmentList, isFinancialAdjust} = this.state;
        const {getFieldDecorator, getFieldValue} = form;
        // 可以财务调整取
        const typeList = isFinancialAdjust ? reviseTypes.filter(item => ['3', '4', '5', '6', '7'].includes(item.code))  : reviseTypes.filter(item => ['2'].includes(item.code))
        return(
            <div id='gym-contract-create-delay'>
                <BreadCrumb routes={this.routes}/>
                <div className='page-wrap gym-add-application'>
                    <Form onSubmit={this.handleSubmit} className='gym-contract-add-form'>
                        <div className='gym-contract-add-form-wrap mt30'>
                            <Row className='gym-contract-table-thead'>
                                <Col span={4} className='gym-contract-table-thead-babyName gym-contract-table-thead-left'>
                                    <span className='gym-contract-table-thead-label'>宝宝姓名：</span>
                                </Col>
                                <Col span={8} className=''>
                                    <span title={contractInfo.babyName} className='gym-contract-table-thead-babyName'>{contractInfo.babyName}</span>
                                </Col>
                            </Row>
                            <FormItem label='调整类型：' className='span gym-contract-add-form-required gym-contract-add-required'>
                                {
                                    getFieldDecorator('adjType', {
                                        rules: [{required: true, message:'请选择调整类型!'}],
                                    })(
                                         <Select
                                             onChange={this.handleChangeAdjType}
                                             style={{width: 250}}
                                         >
                                             {
                                                 (typeList || []).map((item, index) =>
                                                     <Option value={item.code} key={`revise_type_${index}`}>{item.codeValue}</Option>
                                                 )
                                             }
                                         </Select>
                                    )
                                }
                            </FormItem>
                            <Row>
                                <Col span={12}>
                                    <FormItem label='中心号'>
                                        <span>{contractInfo.centerCode}</span>
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label='审批状态'>
                                        <span>{this.formatReviseStatus(contractInfo.adjStatus)}</span>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem label='提交人'>
                                        <span>{User.chineseName} {User.englishName}</span>
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label='合同号'>
                                        <span>{contractInfo.contractCode}</span>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row className='gym-contract-table-thead no-radius'>
                                <Col span={6} className='gym-contract-table-thead-babyName-value '>
                                    <span className=''>调整明细</span>
                                </Col>
                                <Col span={6} className='gym-contract-table-thead-babyName-value'>
                                    <span className=''>目前系统剩余</span>
                                </Col>
                                <Col span={6} className='gym-contract-table-thead-babyName-value'>
                                    <span className=''>调整数值</span>
                                </Col>
                                <Col span={6} className='gym-contract-table-thead-babyName-value'>
                                    <span className=''>调整后剩余</span>
                                </Col>
                            </Row>
                            <Row className=''>
                                <Col span={12} >
                                    <FormItem label='正课课时'>
                                        <div className='text-c'>{SafeCalculate.sub(contractInfo.remainingCourseNum, contractInfo.remainingFreeCourseNum)}</div>
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem>
                                        {
                                            getFieldDecorator('afterCourseNum_calc', {
                                                initialValue: 1
                                            })(
                                                <Select style={{width: 60}} onChange={(e:number) => this.handleChangeNum(e, 'calc', 'afterCourseNum', SafeCalculate.sub(contractInfo.remainingCourseNum, contractInfo.remainingFreeCourseNum))}>
                                                    <Option value={1}>+</Option>
                                                    <Option value={0}>-</Option>
                                                </Select>
                                            )
                                        }
                                        {
                                            getFieldDecorator('afterCourseNum_adjust', {
                                                initialValue: 0,

                                            })(
                                                <InputNumber
                                                    style={{width: 140}}
                                                    precision={0}
                                                    onChange={(e) => this.handleChangeNum(e, 'num', 'afterCourseNum', SafeCalculate.sub(contractInfo.remainingCourseNum, contractInfo.remainingFreeCourseNum))}
                                                    onBlur={(e) => this.checkNum(e, 'afterCourseNum_adjust')}
                                                />
                                            )
                                        }
                                        {
                                            getFieldDecorator('afterCourseNum', {
                                                initialValue: SafeCalculate.sub(contractInfo.remainingCourseNum, contractInfo.remainingFreeCourseNum),
                                            })(
                                                <InputNumber className='ml70' disabled/>
                                            )
                                        }
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row className=''>
                                <Col span={12} >
                                    <FormItem label='赠课课时'>
                                        <div className='text-c'>{contractInfo.remainingFreeCourseNum}</div>
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem>
                                        {
                                            getFieldDecorator('afterFreeCourseNum_calc', {
                                                initialValue: 1
                                            })(
                                                <Select style={{width: 60}} onChange={(e:number) => this.handleChangeNum(e, 'calc', 'afterFreeCourseNum', contractInfo.remainingFreeCourseNum)}>
                                                    <Option value={1}>+</Option>
                                                    <Option value={0}>-</Option>
                                                </Select>
                                            )
                                        }
                                        {
                                            getFieldDecorator('afterFreeCourseNum_adjust', {
                                                initialValue: 0,

                                            })(
                                                <InputNumber
                                                    style={{width: 140}}
                                                    precision={0}
                                                    onChange={(e) => this.handleChangeNum(e, 'num', 'afterFreeCourseNum', contractInfo.remainingFreeCourseNum)}
                                                    onBlur={(e) => this.checkNum(e, 'afterFreeCourseNum_adjust')}

                                                />
                                            )
                                        }
                                        {
                                            getFieldDecorator('afterFreeCourseNum', {
                                                initialValue: contractInfo.remainingFreeCourseNum,
                                            })(
                                                <InputNumber className='ml70' disabled/>
                                            )
                                        }
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row className=''>
                                <Col span={12} >
                                    <FormItem label='剩余金额'>
                                        <div className='text-c'>{contractInfo.remainingCoursePrice}</div>
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem>
                                        {
                                            getFieldDecorator('afterCoursePrice_calc', {
                                                initialValue: 1
                                            })(
                                                <Select
                                                    style={{width: 60}}
                                                    onChange={(e:number) => this.handleChangeNum(e, 'calc', 'afterCoursePrice', contractInfo.remainingCoursePrice)}
                                                    disabled={getFieldValue('adjType') === '1'}  // 调整类型为操作错误，不能调整金额
                                                >
                                                    <Option value={1}>+</Option>
                                                    <Option value={0}>-</Option>
                                                </Select>
                                            )
                                        }
                                        {
                                            getFieldDecorator('afterCoursePrice_adjust', {
                                                initialValue: 0
                                            })(
                                                <InputNumber
                                                    style={{width: 140}}
                                                    precision={2}
                                                    disabled={getFieldValue('adjType') === '1'}  // 调整类型为操作错误，不能调整金额
                                                    onChange={(e) => this.handleChangeNum(e, 'num', 'afterCoursePrice', contractInfo.remainingCoursePrice)}
                                                    onBlur={(e) => this.checkNum(e, 'afterCoursePrice_adjust')}
                                                />
                                            )
                                        }
                                        {
                                            getFieldDecorator('afterCoursePrice', {
                                                initialValue: contractInfo.remainingCoursePrice
                                            })(
                                                <InputNumber className='ml70' disabled/>
                                            )
                                        }
                                    </FormItem>
                                </Col>
                            </Row>

                            <FormItem label='调整原因说明' className='span gym-contract-add-form-required gym-contract-add-required'>
                                {
                                    getFieldDecorator('remark', {
                                        rules: [
                                            {required: true, message:'调整原因说明!'}
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
                            <FormItem label='附件' className='span'>
                                <UploadDownloadFiles
                                    attachment={attachmentList}
                                    hideUploadBtn={false}
                                    setAttachment={this.handleSetAttachment}
                                    deleteAttachment={this.handleCancelAttachment}
                                />
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

export {CreateRevision}
