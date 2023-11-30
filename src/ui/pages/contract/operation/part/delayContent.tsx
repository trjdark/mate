/**
 * desc:
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/12/1
 * Time: 下午4:51
 */
import React from 'react';
import {Form, Row, Col, message} from "antd";
import {TextArea} from "../../../../component/input";
import {ConfirmCheck} from "../../../../component/confirmCheck";
import {approveDelay, updateDelay} from "@redux-actions/contract";
import history from "../../../../../router/history";
import {Routes} from "@/router/enum/routes";
import {form} from "../../../../../common/decorator/form";
import {CancelButton} from "../../../../component/cancelButton";
import {connect} from "../../../../../common/decorator/connect";
import {selectContractDelayStatus} from "../../../../../saga/selectors/contract";
import moment from 'moment';
import {DateInput} from "../../../../component/datePicker";
import {Thumbnail} from "../../../../component/thumbnail";
import {UploadImg} from "../../../../component/uploadImg";
import {User} from "@/common/beans/user";

const FormItem = Form.Item;

declare interface DelayContentProps {
    content:any,
    status:string,
    form?:any,
    delayStatusList?:Array<any>
}
@connect((state:any) => ({
    delayStatusList: selectContractDelayStatus(state),
}))
@form()
class DelayContent extends React.Component<DelayContentProps, any>{
    /**
     * 格式化审批状态
     * @param {string} status
     * @returns {string}
     */
    formStatus = (status:string) => {
        const {delayStatusList} = this.props;
        const delayStatus = delayStatusList.filter((item:any) => item.code === status);
        return delayStatus.length > 0 ? delayStatus[0].codeValue : '-'
    };
    /**
     * 审批申请
     * @param {string} value
     */
    approvalContract = (value:string) => {
        const {content} = this.props;
        approveDelay({
            approvalOperateType: value,
            id: content.id,
            currentCenterId: User.currentCenterId,
            contractId: content.contractId
        }).then((res:any) => {
            message.success("审批成功")
            history.push(Routes.合同操作列表延期.path)
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
                updateDelay(Object.assign({}, values, {
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
     * 上传图片
     */
    handleUploadImg = (file:any, fileList:Array<any>) => {
        const {setFieldsValue} = this.props.form;
        setFieldsValue({attachmentList: fileList.map((item:any) => item.response.data)})
    }
    render(){
        const {content, status, form} = this.props;
        const {getFieldDecorator} = form;
        const fileList = (content.attachmentList || []).map((item:any) => ({
            // fileview 带上1token
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
                        <Col span={4}
                             className='gym-contract-table-tbody-label gym-contract-table-thead-left'>
                            <span>有效期长度:</span>
                        </Col>
                        <Col span={8} className='gym-contract-table-tbody-form'>
                            <FormItem className='gym-act-modal-form'>
                                {`${content.validityPeriod}个月`}
                            </FormItem>
                        </Col>
                        <Col span={4} className='gym-contract-table-tbody-label'>
                            <span>历史延期次数:</span>
                        </Col>
                        <Col span={8}
                             className='gym-contract-table-tbody-value gym-contract-table-thead-right'>
                            <span>{content.historyTotalContractExtentionCount}</span>
                        </Col>
                    </Row>
                    <Row className='gym-contract-table-tbody'>
                        {
                            status === "edit"
                            ?
                                <Col span={4} className='gym-contract-table-tbody-label gym-contract-table-required-label'>
                                    <span className='gym-contract-table-required'>*</span>
                                    <span>本次延期至:</span>
                                </Col>
                            :
                                <Col span={4} className='gym-contract-table-tbody-label'>
                                    <span>本次延期至:</span>
                                </Col>
                        }
                        <Col span={8} className='gym-contract-table-tbody-form'>
                            {
                                status === "edit"
                                    ? <FormItem className='gym-act-modal-form'>
                                        {
                                            getFieldDecorator('delayTo',{
                                                rules: [
                                                    {required: true, message:'请选择日期'}
                                                ],
                                                initialValue: moment(content.delayTo)
                                            })(
                                                <DateInput className='edit-contract'/>
                                            )
                                        }
                                    </FormItem>
                                    : <FormItem className='gym-act-modal-form'>
                                        {moment(content.delayTo).format('YYYY-MM-DD')}
                                    </FormItem>
                            }
                        </Col>
                        <Col span={4} className='gym-contract-table-tbody-label'>
                            <span>审批状态:</span>
                        </Col>
                        <Col span={8} className='gym-contract-table-tbody-value'>
                            <span>{this.formStatus(content.approvalStatus)}</span>
                        </Col>
                    </Row>
                    <Row className='gym-contract-table-tbody'>
                        {
                            status === "edit"
                                ?
                                <Col span={4} className='gym-contract-table-tbody-form-label gym-contract-table-required-label'>
                                    <span className='gym-contract-table-required'>*</span>
                                    <span>延期原因说明:</span>
                                </Col>
                                :
                                <Col span={4} className='gym-contract-table-tbody-form-label'>
                                    <span>延期原因说明:</span>
                                </Col>
                        }
                        <Col span={20} className='gym-contract-table-tbody-form-value'>
                            {
                                status === "edit"
                                    ? <FormItem className='gym-act-modal-form'>
                                        {
                                            getFieldDecorator('remark',{
                                                rules: [
                                                    {required: true, message:'请输入原因说明'}
                                                ],
                                                initialValue:content.remark
                                            })(
                                                <TextArea
                                                    style={{width:'650px'}}
                                                    placeholder='请输入原因说明'
                                                    minLength={5}
                                                    autosize={{minRows: 2, maxRows: 2}}
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
                                ensure={() => this.approvalContract('1')}
                                button={<button className='gym-button-default gym-button-xs gym-contract-table-bottoms-button'>同意</button>}
                            />
                            <ConfirmCheck
                                contentText={"确认不同意此申请？"}
                                item={{}}
                                ensure={() => this.approvalContract('0')}
                                button={<button className='gym-button-white gym-button-xs gym-contract-table-bottoms-button'>不同意</button>}
                            />
                        </div>
                    </Row>
                }
            </div>

        )
    }
}

export {DelayContent}
