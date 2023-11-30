/**
 * desc: 退课申请
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/12/3
 * Time: 下午4:13
 */
import React from 'react';
import { Row, Col, Form, message, Radio,DatePicker,Input} from "antd";
import {InputNumber, TextArea} from "../../../../component/input";
import {form} from "../../../../../common/decorator/form";
import {Routes} from "@/router/enum/routes";
import {ConfirmCheck} from "../../../../component/confirmCheck";
import {CancelButton} from "../../../../component/cancelButton";
import {User} from "../../../../../common/beans/user";
import {approvalRefund, updateReturnCourse} from "@redux-actions/contract";
import history from "../../../../../router/history";
import {connect} from "../../../../../common/decorator/connect";
import {selectContractReturnStatus} from "../../../../../saga/selectors/contract";
import {Thumbnail} from "../../../../component/thumbnail";
import {UploadImg} from "../../../../component/uploadImg";
import moment from 'moment';

const FormItem = Form.Item;

declare interface OutContentProps {
    content:any,
    status:string,
    form?:any,
    outStatusList?:Array<any>
    isElectronic?:any,
    contractType: string
}

@connect((state:any) => ({
    outStatusList: selectContractReturnStatus(state),
}))
@form()
class OutContent extends React.Component<OutContentProps, any>{
    constructor(props:any){
        super(props);
        this.state = {
            isETC: '', // 选择是否电子合同
        }
    }
    /**
     * 格式化审批状态
     * @param {string} status
     * @returns {string}
     */
    formStatus = (status:string) => {
        const {outStatusList} = this.props;
        const outStatus = outStatusList.filter((item:any) => item.code === status);
        return outStatus.length > 0 ? outStatus[0].codeValue : '-'
    };
    /**
     * 审批退课申请
     * @param {string} value
     */
    approvalContract = (value:string) => {
        const {content} = this.props;
        approvalRefund({
            approveResult: value,
            id: content.id,
            currentCenterId: User.currentCenterId,
            contractId: content.contractId
        }).then((res:any) => {
            message.success("审批成功");
            history.push(Routes.合同操作列表退课.path)
        })
    };
    /**
     * 修改
     * @param e
     */
    handleSubmit = (e:any) => {
        e.preventDefault();
        const {validateFields} = this.props.form;
        validateFields((err:any, values) => {
            if(!err){
                updateReturnCourse(Object.assign({}, values, {
                    currentCenterId: User.currentCenterId,
                    contractId: this.props.content.contractId,
                    id: this.props.content.id,
                })).then((res:any) => {
                    message.success("修改成功")
                    history.goBack()
                })
            }
        })
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
    /**
     * 选择退课时间
     */
    disabledDate = (current) => {
        return current <= moment().startOf('day');
    };
    /**
     * 上传图片
     */
    handleUploadImg = (file:any, fileList:Array<any>) => {
        const {setFieldsValue} = this.props.form;
        setFieldsValue({attachmentList: fileList.map((item:any) => item.response.data)})
    }
    render(){
        const { content = {}, status, form, isElectronic, contractType} = this.props;
        const {isETC} = this.state;
        const {getFieldDecorator} = form;
        const fileList = (content.attachmentList || []).map((item:any) => ({
            url:`${location.protocol}//${location.host}/api/mate-basic/basic/file/fileView?fileId=${item.photoPath}&token=${User.getToken}`,
            status: 'done',
            uid: item.id,
            name: item.photoName,
            response: Object.assign({}, {}, {data: item})
        }));
        return(
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <Row
                        className='gym-contract-table-tbody gym-contract-table-top gym-contract-table-thead-left gym-contract-table-thead-right'>
                        <Col span={4} className='gym-contract-table-tbody-label'>
                            <span>退课课时:</span>
                        </Col>
                        <Col span={8} className='gym-contract-table-tbody-value'>
                            <span> {content.returnedCourseNum}</span>
                        </Col>
                        {
                            status === "edit"
                                ?
                                <Col span={4} className='gym-contract-table-tbody-label gym-contract-table-required-label'>
                                    <span className='gym-contract-table-required'>*</span>
                                    <span>退课金额:</span>
                                </Col>
                                :
                                <Col span={4} className='gym-contract-table-tbody-label'>
                                    <span>退课金额:</span>
                                </Col>
                        }
                        {
                            status === "edit"
                                ? <Col span={4} className='gym-contract-table-tbody-form'>
                                    <FormItem className='gym-act-modal-form'>
                                        {
                                            getFieldDecorator('realityReturnedAmount',{
                                                rules: [
                                                    {required: true, message:'请输入退课金额'}
                                                ],
                                                initialValue:content.returnedAmount
                                            })(
                                                <InputNumber min={0} step={0.01}/>
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                :
                                <Col span={4} className='gym-contract-table-tbody-value'>
                                    <span>
                                        {content.returnedAmount && content.returnedAmount.toFixed(2)}
                                    </span>
                                </Col>
                        }
                    </Row>
                    <Row className='gym-contract-table-tbody'>
                        {
                            status==='edit'?
                            <Col span={4} className='gym-contract-table-tbody-label gym-contract-table-required-label'>
                                <span className='gym-contract-table-required'>*</span>
                                <span>是否使用电子合同:</span>
                            </Col>
                            :
                            <Col span={4} className='gym-contract-table-tbody-label'>
                                <span>是否使用电子合同:</span>
                            </Col>
                        }
                        {
                            status === "edit"
                                ? <Col span={8} className='gym-contract-table-tbody-form'>
                                    <FormItem className='gym-act-modal-form'>
                                        {
                                            getFieldDecorator('electronicFlag', {
                                                rules: [
                                                    { required: true, message: '请输入退课金额' }
                                                ],
                                                initialValue: content.electronicFlag
                                            })(
                                                <Radio.Group onChange={(e) => this.handleSelectISETC(e.target.value)}>
                                                    <Radio value={1} disabled={(isElectronic === 0 || contractType === '17004')? true : false}>是</Radio>
                                                    <Radio value={0}>否</Radio>
                                                </Radio.Group>
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                :
                                <Col span={8} className='gym-contract-table-tbody-value'>
                                    <span>
                                        {content.electronicFlag ===0?'否':'是'}
                                    </span>
                                </Col>
                        }
                    </Row>
                    {
                        ((content.electronicFlag === 1 && isETC !== 0) || isETC === 1)&&
                    <Row>
                        {
                            status === "edit"?
                                <Col span={4} className='gym-contract-table-tbody-label gym-contract-table-required-label'>
                                    <span className='gym-contract-table-required'>*</span>
                                    <span>约定退款时间:</span>
                                </Col>
                                :
                                <Col span={4} className='gym-contract-table-tbody-label'>
                                    <span>约定退款时间:</span>
                                </Col>
                        }
                        {
                           status === "edit" ?
                                <Col span={8} className='gym-contract-table-tbody-form'>
                                    <FormItem className='gym-act-modal-form'>
                                        {
                                            getFieldDecorator('expectFinancialTime', {
                                                rules: [
                                                    { required: true, message: '请选择约定退款时间' }
                                                ],
                                                initialValue: content.expectFinancialTime&&moment(content.expectFinancialTime)
                                            })(
                                                <DatePicker
                                                    format='YYYY-MM-DD'
                                                    disabledDate={this.disabledDate}
                                                />
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                :
                                <Col span={8} className='gym-contract-table-tbody-value'>
                                    <span>
                                        {moment(content.expectFinancialTime).format('YYYY-MM-DD')}
                                    </span>
                                </Col>
                        }
                    </Row>
                    }
                    {
                        ((content.electronicFlag === 1 && isETC !== 0) || isETC === 1) &&
                    <Row className='gym-contract-table-tbody gym-contract-table-top'>
                        {
                            status === "edit"
                                ?
                                <Col span={4} className='gym-contract-table-tbody-form-label gym-contract-table-required-label'>
                                    <span className='gym-contract-table-required'>*</span>
                                    <span>开户行:</span>
                                </Col>
                                :
                                <Col span={4} className='gym-contract-table-tbody-form-label'>
                                    <span>开户行:</span>
                                </Col>
                        }
                        <Col span={20} className='gym-contract-table-tbody-form-value'>
                            {
                                status === "edit"
                                    ? <FormItem className='gym-act-modal-form'>
                                        {
                                            getFieldDecorator('openAccountBank', {
                                                rules: [
                                                    { required: true, message: '请输入开户行' }
                                                ],
                                                initialValue: content.openAccountBank
                                            })(
                                                <TextArea
                                                    style={{ width: '650px' }}
                                                    placeholder='请输入开户行'
                                                    minLength={1}
                                                    maxLength={100}
                                                    autosize={{ minRows: 2, maxRows: 3 }}
                                                />
                                            )
                                        }
                                    </FormItem>
                                    : <span className='gym-act-modal-form'>
                                        {content.openAccountBank}
                                    </span>
                            }
                        </Col>
                    </Row>
                    }
                    {
                        ((content.electronicFlag === 1 && isETC !== 0) || isETC === 1) &&
                        <Row className='gym-contract-table-tbody  gym-contract-table-thead-left gym-contract-table-thead-right'>
                            {
                                status === "edit"
                                    ?
                                    <Col span={4} className='gym-contract-table-tbody-label gym-contract-table-required-label'>
                                        <span className='gym-contract-table-required'>*</span>
                                        <span>开户名:</span>
                                    </Col>
                                    :
                                    <Col span={4} className='gym-contract-table-tbody-label'>
                                        <span>开户名:</span>
                                    </Col>
                            }
                            <Col span={18} className='gym-contract-table-tbody-form'>
                                {
                                    status === "edit"
                                        ? <FormItem className='gym-act-modal-form'>
                                            {
                                                getFieldDecorator('openAccountName', {
                                                    rules: [
                                                        { required: true, message: '请输入开户名' }
                                                    ],
                                                    initialValue: content.openAccountName
                                                })(
                                                    <Input maxLength={50} style={{ width: 800 }} />
                                                )
                                            }
                                        </FormItem>
                                        : <FormItem className='gym-act-modal-form'>
                                            {content.openAccountName}
                                        </FormItem>
                                }
                            </Col>
                        </Row>
                    }
                    {
                        ((content.electronicFlag===1&&isETC!==0)||isETC===1)&&
                    <Row className='gym-contract-table-tbody gym-contract-table-thead-left gym-contract-table-thead-right'>
                        {
                            status === "edit"
                                ?
                                <Col span={4} className='gym-contract-table-tbody-label gym-contract-table-required-label'>
                                    <span className='gym-contract-table-required'>*</span>
                                    <span>开户账号:</span>
                                </Col>
                                :
                                <Col span={4} className='gym-contract-table-tbody-label'>
                                    <span>开户账号:</span>
                                </Col>
                        }
                            <Col span={18} className='gym-contract-table-tbody-form'>
                                {
                                    status === "edit"
                                        ? <FormItem className='gym-act-modal-form'>
                                            {
                                                getFieldDecorator('openAccount', {
                                                    rules: [
                                                        { required: true, message: '请输入开户账号' }
                                                    ],
                                                    initialValue: content.openAccount
                                                })(
                                                    <Input maxLength={50} style={{ width: 800 }} />
                                                )
                                            }
                                        </FormItem>
                                        : <FormItem className='gym-act-modal-form'>
                                            {content.openAccount}
                                        </FormItem>
                                }
                            </Col>
                    </Row>
                    }
                    <Row className='gym-contract-table-tbody'>
                        <Col span={4} className='gym-contract-table-tbody-label'>
                            <span>审批状态:</span>
                        </Col>
                        <Col span={20} className='gym-contract-table-tbody-value'>
                            <span>{ this.formStatus(content.approvalStatus)}</span>
                        </Col>
                    </Row>
                    <Row className='gym-contract-table-tbody'>
                        {
                            status === "edit"
                                ?
                                <Col span={4} className='gym-contract-table-tbody-form-label gym-contract-table-required-label'>
                                    <span className='gym-contract-table-required'>*</span>
                                    <span>退课原因说明:</span>
                                </Col>
                                :
                                <Col span={4} className='gym-contract-table-tbody-form-label'>
                                    <span>退课原因说明:</span>
                                </Col>
                        }
                        <Col span={20} className='gym-contract-table-tbody-form-value'>
                            {
                                status === "edit"
                                    ? <FormItem className='gym-act-modal-form'>
                                        {
                                            getFieldDecorator('remark',{
                                                rules: [
                                                    {required: true, message:'请输入退课原因说明'}
                                                ],
                                                initialValue:content.remark
                                            })(
                                                <TextArea
                                                    style={{width:'650px'}}
                                                    placeholder='请输入原因说明'
                                                    minLength={5}
                                                    autosize={{minRows: 2, maxRows: 3}}
                                                />
                                            )
                                        }
                                    </FormItem>
                                    : <span className='gym-act-modal-form'>
                                        {content.remark}
                                    </span>
                            }
                        </Col>
                    </Row>
                    <Row
                        className='gym-contract-table-tbody gym-contract-table-tbody-left gym-contract-table-tbody-right'>
                        <Col span={4}
                             className='gym-contract-table-tbody-form-label gym-contract-table-tbody-left gym-contract-table-tbody-form-attachment'>
                            <span>附件:</span>
                        </Col>
                        <Col span={20}
                             className='gym-contract-table-tbody-form-value gym-contract-table-tbody-right'>
                            {
                                status === "edit"
                                    ? <FormItem className='span'>
                                        {
                                            getFieldDecorator('attachmentList',{
                                                initialValue:content.attachmentList
                                            })(<span/>)
                                        }
                                        <UploadImg fileList={fileList} onChange={this.handleUploadImg} maxFileLength={5}/>
                                    </FormItem>
                                    :<FormItem className='gym-act-modal-form'>
                                        {
                                            (content.attachmentList || []).map((item:any) =>
                                                <Thumbnail key={item.id} imgSrc={`${location.protocol}//${location.host}/api/mate-basic/basic/file/fileView?fileId=${item.photoPath}&token=${User.getToken}`}/>
                                            )
                                        }
                                    </FormItem>
                            }
                        </Col>
                    </Row>

                    {
                        status === 'edit' &&
                        <CancelButton
                            form={form}
                            submitText='提交'
                        />
                    }
                </Form>
                {
                    status === 'approve' &&
                    <Row>
                        <div className='gym-contract-table-bottoms'>
                            <ConfirmCheck
                                contentText={"确认同意此申请？"}
                                item={{}}
                                ensure={() => this.approvalContract('24003')}
                                button={<button className='gym-button-default gym-button-xs gym-contract-table-bottoms-button'>同意</button>}
                            />
                            <ConfirmCheck
                                contentText={"确认不同意此申请？"}
                                item={{}}
                                ensure={() => this.approvalContract('24002')}
                                button={<button className='gym-button-white gym-button-xs gym-contract-table-bottoms-button'>不同意</button>}
                            />
                        </div>
                    </Row>
                }
            </div>

        )
    }
}

export {OutContent};
