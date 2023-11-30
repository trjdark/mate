/**
 * desc: 申请合同延期
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/11/27
 * Time: 上午10:06
 */
import React from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {Form, Row, Col, message} from "antd";
import {form} from "@/common/decorator/form";
import {DateInput} from "@/ui/component/datePicker";
import {CancelButton} from "@/ui/component/cancelButton";
import {UploadImg} from "@/ui/component/uploadImg";
import {Routes} from "@/router/enum/routes";
import {CommonUtils} from "@/common/utils/commonUtils";
import {createDelay, getDelayInfoForCreate, getContractInfo} from "@redux-actions/contract";
import history from "../../../../router/history";
import moment from "moment";
import {User} from "@/common/beans/user";
import {TextArea} from "@/ui/component/input";
import {Message} from "@/ui/component/message/message";
import {BasicContractInfo} from "@/ui/pages/contract/management/part/basicContractInfo";

const FormItem = Form.Item;

@form()
class CreateDelay extends React.Component<any, any>{
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
            name: '申请合同延期',
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
            contractInfo: {}
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
                createDelay(Object.assign({}, values, {
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

    /**
     * 选择时间
     */
    disabledDate = (current) => {
        return current && current <= moment(this.endTime).endOf('day');
    };

    render(){
        const {form} = this.props;
        const {basicInfo, contractInfo} = this.state;
        const {getFieldDecorator} = form;
        return(
            <div id='gym-contract-create-delay'>
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
                            <FormItem label={'本次延期至：'} className='span gym-contract-add-form-required gym-contract-add-required'>
                                {
                                    getFieldDecorator('delayTo', {
                                        initialValue: moment(this.endTime),
                                        rules: [
                                            {required: true, message:'请选择延期日期!'}
                                        ],
                                    })(
                                        <DateInput
                                            disabledDate={this.disabledDate}
                                            format={"YYYY-MM-DD"}
                                        />
                                    )
                                }
                            </FormItem>
                            <Row>
                                <Col span={12}>
                                    <FormItem label={'有效期长度'}>
                                        <span>{`${basicInfo.validityPeriod}个月`}</span>
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label={'历史延期次数'}>
                                        <span>{basicInfo.historyTotalContractExtentionCount}</span>
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

export {CreateDelay}
