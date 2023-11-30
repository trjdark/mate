/**
 * desc: 申请部分退费
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2023/8/17
 * Time: 13:36
 */

import React from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {Form, Row, Col, message} from "antd";
import {form} from "@/common/decorator/form";
import {CancelButton} from "@/ui/component/cancelButton";
import {UploadImg} from "@/ui/component/uploadImg";
import {Routes} from "@/router/enum/routes";
import {CommonUtils, SafeCalculate} from "@/common/utils/commonUtils";
import {getDelayInfoForCreate, getContractInfo, createPartRefunc} from "@redux-actions/contract";
import moment from "moment";
import {User} from "@/common/beans/user";
import {TextArea} from "@/ui/component/input";
import {BasicContractInfo} from "@/ui/pages/contract/management/part/basicContractInfo";
import {InputNumber} from "@/ui/component/input";
import history from "@/router/history";
import {UploadDownloadFiles} from "@/ui/component/uploadDownloadFiles";

const FormItem = Form.Item;

@form()
class CreatePartRefund extends React.Component<any, any>{
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
            name: '申请部分退费',
            path: '',
            link: '#',
            id: 'createLeave'
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
            attachmentList:[]
        }
    }

    componentDidMount() {
        this.getBasicInfo();
        getContractInfo({
            currentCenterId: User.currentCenterId,
            contractCode: this.contractCode,
            contractId: this.contractId
        }).then((res:any) => {
            this.setState({
                contractInfo: res.detail
            })
        });
    }

    getBasicInfo = () => {
        /**
         * 获取延期申请的基本信息
         * @param someParam<>
         * @method post
         * @response  res<>
         */
        const postData = {
            "contractCode": this.contractCode,
            "contractId": this.contractId,
            "currentCenterId": User.currentCenterId
        };

        getDelayInfoForCreate(postData).then((res) => {
            this.setState({
                basicInfo:res
            })
        }, (err) => {
            //返回请求reject
            message.error(err)
        })

    };


    handleSubmit = (e) => {
        e.preventDefault();
        const {validateFields} = this.props.form;
        validateFields((err:any, values) => {
            if(!err){
                let res = {};
                const numKeyList = ['partRefundCoursePrice', 'partRefundFreeCourseNum', 'partRefundCourseNum'];
                for(let key in values){
                    if(numKeyList.includes(key)){
                        res[key] = values[key] * -1;
                    }else{
                        res[key] = values[key]
                    }
                }
                const param = Object.assign({}, res, {
                    currentCenterId:User.currentCenterId,
                    contractId: this.contractId,
                    contractCode: this.contractCode
                })
                createPartRefunc(param).then(() => {
                    history.goBack()
                })
            }
        })
    };
    /**
     * 上传图片
     * @param file
     */
    handleSetAttachment = (fileId:any, fileName:string) => {
        const {setFieldsValue} = this.props.form;
        const {attachmentList} = this.state;
        const res = [...attachmentList, {attachmentId :fileId, attachmentName: fileName}];
        this.setState({attachmentList:res});
        setFieldsValue({attachmentList: res.map(item => ({id: item.attachmentId, fileName: item.attachmentName}))});
    }
    handleDeleteAttachment = (i) => {
        const {setFieldsValue} = this.props.form;
        const {attachmentList} = this.state;
        const res = attachmentList.filter((item, index) => index !== i);
        this.setState({attachmentList:res})
        setFieldsValue({attachmentList: res.map(item => ({id: item.attachmentId, fileName: item.attachmentName}))});
    }
    /**
     * 选择时间
     */
    disabledDate = (current) => {
        return current && current <= moment(this.endTime).endOf('day');
    };
    /**
     *
     */
    handleChange = () => {

    };
    render(){
        const {form} = this.props;
        const {contractInfo, attachmentList} = this.state;
        const {getFieldDecorator} = form;

        return(
            <div id='gym-contract-create-delay'>
                <BreadCrumb routes={this.routes}/>
                <div className='page-wrap gym-add-application'>
                    <Form onSubmit={this.handleSubmit} className='gym-contract-add-form'>
                        {/*<BasicContractInfo*/}
                        {/*    contractInfo={contractInfo}*/}
                        {/*    emitNext={(records)=>{*/}
                        {/*        this.setState(preState => {*/}
                        {/*            return {*/}
                        {/*                contractInfo:Object.assign(preState.contractInfo,{records})*/}
                        {/*            }*/}
                        {/*        })*/}
                        {/*    }}*/}
                        {/*/>*/}
                        <div className='gym-contract-add-form-wrap mt30'>
                            <Row className='gym-contract-table-thead no-radius'>
                                <Col span={4} className='gym-contract-table-thead-babyName gym-contract-table-thead-left'>
                                    <span className='gym-contract-table-thead-label'>宝宝姓名：</span>
                                </Col>
                                <Col span={8} className=''>
                                    <span title={contractInfo.babyName} className='gym-contract-table-thead-babyName'>{contractInfo.babyName}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem label='中心号'>
                                        <span>{contractInfo.centerCode}</span>
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label='审批状态'>
                                        <span></span>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem label='合同号'>
                                        <span>{contractInfo.contractCode}</span>
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label='提交人'>
                                        <span></span>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row className='gym-contract-table-thead no-radius'>
                                <Col span={6} className='gym-contract-table-thead-babyName-value '>
                                    <span>部分退费明细</span>
                                </Col>
                                <Col span={6} className='gym-contract-table-thead-babyName-value '>
                                    <span>目前系统剩余</span>
                                </Col>
                                <Col span={6} className='gym-contract-table-thead-babyName-value '>
                                    <span>本次退费</span>
                                </Col>
                                <Col span={6} className='gym-contract-table-thead-babyName-value '>
                                    <span>退费后剩余</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem label={'正课课时：'}>
                                        <div className='text-c'>{SafeCalculate.newMinus(contractInfo.remainingCourseNum, contractInfo.remainingFreeCourseNum)}</div>
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    <FormItem >
                                        <span className='mr10'>-</span>
                                        {
                                            getFieldDecorator('partRefundCourseNum', {
                                                initialValue: 0,

                                            })(
                                                <InputNumber
                                                    style={{width: 140}}
                                                    precision={0}
                                                    min={0}
                                                    max={SafeCalculate.newMinus(contractInfo.remainingCourseNum, contractInfo.remainingFreeCourseNum)}
                                                />
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    <FormItem>
                                        <div>{SafeCalculate.newMinus(contractInfo.remainingCourseNum, contractInfo.remainingFreeCourseNum , Number(form.getFieldValue('partRefundCourseNum') || 0))}</div>

                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem label={'赠课课时：'}>
                                        <div className='text-c'>{contractInfo.remainingFreeCourseNum || 0}</div>
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    <FormItem >
                                        <span className='mr10'>-</span>
                                        {
                                            getFieldDecorator('partRefundFreeCourseNum', {
                                                initialValue: 0,
                                            })(<InputNumber
                                                style={{width: 140}}
                                                precision={0}
                                                min={0}
                                                max={contractInfo.remainingFreeCourseNum}
                                            />)
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    <FormItem>
                                        <div>{SafeCalculate.newMinus(contractInfo.remainingFreeCourseNum || 0, Number(form.getFieldValue('partRefundFreeCourseNum') || 0))}</div>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem label={'剩余金额：'}>
                                        <div className='text-c'>{contractInfo.remainingCoursePrice || 0}</div>
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    <FormItem >
                                        <span className='mr10'>-</span>
                                        {
                                            getFieldDecorator('partRefundCoursePrice', {
                                                initialValue: 0,

                                            })(
                                                <InputNumber style={{width: 140}}
                                                             precision={2}
                                                             min={0} max={contractInfo.remainingCoursePrice}/>
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    <FormItem>
                                        <div>{SafeCalculate.newMinus(contractInfo.remainingCoursePrice || 0, Number(form.getFieldValue('partRefundCoursePrice') || 0))}</div>
                                    </FormItem>
                                </Col>
                            </Row>
                            <FormItem label={'原因说明'} className='span gym-contract-add-form-required gym-contract-add-required'>
                                {
                                    getFieldDecorator('remark', {
                                        rules: [
                                            {required: true, message:'请输入原因说明!'}
                                        ],
                                    })(
                                        <TextArea
                                            placeholder={'请输入原因说明'}
                                            autosize={{minRows: 2, maxRows: 3}}
                                            style={{width:'80%'}}
                                        />
                                    )
                                }
                            </FormItem>
                            <FormItem label={'上传文件'} className='span'>
                                {
                                    getFieldDecorator('attachmentList')(<span/>)
                                }
                                <UploadDownloadFiles
                                    attachment={attachmentList}
                                    setAttachment={this.handleSetAttachment}
                                    deleteAttachment={this.handleDeleteAttachment}
                                    hideUploadBtn={false}
                                />
                                {/*<UploadImg onChange={this.handleUploadImg} maxFileLength={5}/>*/}
                            </FormItem>

                        </div>
                        <CancelButton
                            form={form}
                            goBackLink={`${Routes.合同详情.link}${CommonUtils.stringify({contractCode:this.contractCode, contractId:this.contractId})}`}
                            submitText={'提交'}
                        />
                    </Form>
                </div>
            </div>
        )
    }
}

export {CreatePartRefund}

