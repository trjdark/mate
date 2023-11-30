/**
 * desc: 申请赠课
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/11/27
 * Time: 上午9:41
 */
import React from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {Form, Row, Col} from "antd";
import {form} from "@/common/decorator/form";
import {CancelButton} from "@/ui/component/cancelButton";
import {UploadImg} from "@/ui/component/uploadImg";
import {Routes} from "@/router/enum/routes";
import {CommonUtils} from "@/common/utils/commonUtils";
import {createGiveClass, getFreeCourseRecordInfo, getContractInfo} from "@redux-actions/contract";
import history from "../../../../router/history";
import {User} from "@/common/beans/user";
import {InputNumber, TextArea} from "../../../component/input";
import {Message} from "@/ui/component/message/message";
import {BasicContractInfo} from "@/ui/pages/contract/management/part/basicContractInfo";
import {Modal} from "@/ui/component/customerCreateModal";

const FormItem = Form.Item;

@form()
class CreateGiveClass extends React.Component<any, any>{
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
            name: '申请赠课',
            path: '',
            link: '#',
            id: 'createGiveClass'
        }
    ];
    contractId:string;
    contractCode:string;
    reason:string;
    constructor(props:any){
        super(props)
        if(CommonUtils.hasParams(props)){
            this.contractId = CommonUtils.parse(props).contractId;
            this.contractCode = CommonUtils.parse(props).contractCode;
            this.reason = CommonUtils.parse(props).reason;
        }
        this.state = {
            basic: {},
            contractInfo: {},
            checkVisible: false
        }
    }
    componentDidMount(){
        getFreeCourseRecordInfo({currentCenterId:User.currentCenterId, contractId:this.contractId})
            .then((res:any) => {
                this.setState({basic:res})
            });
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
     * 提交
     * @param e
     */
    handleSubmit = (e) => {
        e.preventDefault();
        const {validateFields} = this.props.form;
        validateFields((err:any, values) => {
            if(!err){
                if(!this.state.isChecked){
                    if(values.freeCourseNum > 30){
                        this.setState({
                            checkVisible:true,
                            msg:  '请检查，您填写的课时过大，如无异常麻烦再次提交，谢谢！',
                            isChecked: true
                        })
                        return ;
                    }
                }
                createGiveClass(Object.assign({}, values, {
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
        const {getFieldDecorator} = form;
        const {basic, contractInfo, checkVisible, msg} = this.state;
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
                                    <FormItem label={'本次赠课'} className='gym-contract-add-form-required gym-contract-add-required'>
                                        {
                                            getFieldDecorator('freeCourseNum', {
                                                rules: [
                                                    {required: true, message:'请输入赠课数'}
                                                ],
                                            })(
                                                <InputNumber min={1} step={1} precision={0}/>
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label={'历史赠课'}>
                                        <span>{basic.historyTotalFreeCourseNum}</span>
                                    </FormItem>
                                </Col>
                            </Row>
                            <FormItem label={'原因说明'} className='span gym-contract-add-form-required gym-contract-add-required'>

                                {
                                    getFieldDecorator('remark',{
                                        rules: [
                                            {required: true, message:'请输入原因说明'}
                                        ],
                                        initialValue: this.reason ? '2020 — 因新型冠状病毒肺炎【COVID-19】疫情赠课' : null,
                                    })(
                                        <TextArea
                                            disabled={this.reason}
                                            placeholder={'请输入原因说明'}
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
                        <CancelButton
                            form={form}
                            goBackLink={`${Routes.合同详情.link}${CommonUtils.stringify({contractCode:this.contractCode, contractId:this.contractId})}`}
                            submitText={'提交'}
                        />
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
        )
    }
}

export {CreateGiveClass}
