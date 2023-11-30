/**
 * desc: 新建请假次数
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/11/26
 * Time: 下午3:46
 */
import React from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {Form, Row, Col, message} from "antd";
import {form} from "@/common/decorator/form";
import {InputNumber, TextArea} from "../../../component/input";
import {CancelButton} from "@/ui/component/cancelButton";
import {UploadImg} from "@/ui/component/uploadImg";
import {Routes} from "@/router/enum/routes";
import {CommonUtils} from "@/common/utils/commonUtils";
import {createLeave, getLeaveBasicInfo, getContractInfo} from "@redux-actions/contract";
import history from "../../../../router/history";
import {User} from "@/common/beans/user";
import {Message} from "@/ui/component/message/message";
import {BasicContractInfo} from "@/ui/pages/contract/management/part/basicContractInfo";

const FormItem = Form.Item;

@form()
class CreateApplyLeave extends React.Component<any, any>{
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
            name: '申请修改请假次数',
            path: '',
            link: '#',
            id: 'createLeave'
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
            basic:{
                allowLeaveTimes:0,
                historyModifyLeaveTimesCount:0,
                remainingLeaveTimes:0
            },
            contractInfo: {}
        };
    }
    componentDidMount() {
        this.getbasicInfo();
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

    /**
     * 获取申请请假基本信息
     * @param someParam<>
     * @method post
     * @response  res<>
     */
    getbasicInfo = () => {
       const postData = {
           "currentCenterId": User.currentCenterId,
           "contractId": this.contractId
       };

       getLeaveBasicInfo(postData).then((res) => {
            this.setState({
                basic:res
            })
       },(err) => {
            // 返回请求reject
            message.error(err);
       })
    };


    handleSubmit = (e) => {
        e.preventDefault();
        const {validateFields} = this.props.form;
        validateFields((err:any, values) => {
            if(!err){
                createLeave(Object.assign({}, values, {
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
    }
    render(){
        const {form} = this.props;
        const {basic, contractInfo} = this.state;
        const {getFieldDecorator} = form;
        return(
            <div id='gym-contract-create-leave'>
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
                                    <FormItem label={'本次增加次数：'} className='gym-contract-add-form-required gym-contract-add-required'>
                                        {
                                            getFieldDecorator('leaveTimes', {
                                                rules: [
                                                    {required: true, message:'请输入增加次数!'}
                                                ],
                                            })(
                                                <InputNumber step={1} precision={0}/>
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label={'标准次数'}>
                                        <span>{basic.allowLeaveTimes}</span>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem label={'剩余请假次数：'}>
                                        <span>{basic.remainingLeaveTimes}</span>
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label={'历史增加次数'}>
                                        <span>{basic.historyModifyLeaveTimesCount}</span>
                                    </FormItem>
                                </Col>
                            </Row>
                            <FormItem label={'原因说明'} className='span gym-contract-add-form-required gym-contract-add-required'>
                                {
                                    getFieldDecorator('remark',{
                                        rules: [
                                            {required: true, message:'请输入原因说明!'}
                                        ]
                                    })(
                                        <TextArea
                                            placeholder={'请输入原因说明'}
                                            autosize={{minRows: 2, maxRows: 3}}
                                            style={{width:'80%'}}
                                        />
                                    )
                                }
                            </FormItem>
                            <FormItem label={'上传图片'} className='span'>
                                {
                                    getFieldDecorator('attachmentList')(<span/>)
                                }
                                <UploadImg onChange={this.handleUploadImg} maxFileLength={5}/>

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

export {CreateApplyLeave}
