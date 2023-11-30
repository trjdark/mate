/**
 * desc: 请假申请信息
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/11/29
 * Time: 下午8:06
 */
import React from 'react';
import {Row, Col, Form, message} from "antd";
import {InputNumber, TextArea} from "../../../../component/input";
import {form} from "../../../../../common/decorator/form";
import {Routes} from "@/router/enum/routes";
import {ConfirmCheck} from "../../../../component/confirmCheck";
import {CancelButton} from "../../../../component/cancelButton";
import {User} from "../../../../../common/beans/user";
import {approveLeave, updateLeave} from "@redux-actions/contract";
import history from "../../../../../router/history";
import {connect} from "../../../../../common/decorator/connect";
import {selectContractLeaveStatus} from "../../../../../saga/selectors/contract";
import {Thumbnail} from "../../../../component/thumbnail";
import {UploadImg} from "../../../../component/uploadImg";

const FormItem = Form.Item;

declare interface LeaveContentProps {
    content:any,
    status:string,
    form?:any,
    leaveStatusList?:Array<any>
}

@connect((state:any) => ({
    leaveStatusList: selectContractLeaveStatus(state),
}))
@form()
class LeaveApplyContent extends React.Component<LeaveContentProps, any>{
    /**
     * 格式化审批状态
     * @param {string} status
     * @returns {string}
     */
    formStatus = (status:string) => {
        const {leaveStatusList} = this.props;
        const leaveStatus = leaveStatusList.filter((item:any) => item.code === status);
        return leaveStatus.length > 0 ? leaveStatus[0].codeValue : '-'
    };
    /**
     * 审批请假申请
     * @param {string} value
     */
    approvalContract = (value:string) => {
        const {content} = this.props;
        approveLeave({
            approvalOperateType: value,
            id: content.id,
            currentCenterId: User.currentCenterId,
            contractId: content.contractId
        }).then((res:any) => {
            message.success("审批成功");
            history.push(Routes.合同操作列表修改请假次数.path)
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
                updateLeave(Object.assign({}, values, {
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
        const {content = {}, status, form} = this.props;
        const {getFieldDecorator} = form;
        const fileList = (content.attachmentList || []).map((item:any) => ({
            url:`${location.protocol}//${location.host}/api/mate-basic/basic/file/fileView?fileId=${item.photoPath}&token=${User.getToken}`,
            status: 'done',
            uid: item.id,
            name: item.photoName,
            response: Object.assign({}, {}, {data: item})
        }));
        return (
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <Row
                        className='gym-contract-table-tbody gym-contract-table-top gym-contract-table-thead-left gym-contract-table-thead-right'>
                        <Col span={4} className='gym-contract-table-tbody-label gym-contract-table-thead-left'>
                            <span>标准请假次数:</span>
                        </Col>
                        <Col span={8} className='gym-contract-table-tbody-form'>
                            <FormItem className='gym-act-modal-form'>
                                {content.allowLeaveTimes || 0}
                            </FormItem>
                        </Col>
                        <Col span={4} className='gym-contract-table-tbody-label '>
                            <span>历史增加次数:</span>
                        </Col>
                        <Col span={8} className='gym-contract-table-tbody-value gym-contract-table-thead-right'>
                            <span className='gym-act-modal-form'>
                                {content.historyModifyLeaveTimesCount}
                            </span>
                        </Col>
                    </Row>
                    <Row className='gym-contract-table-tbody'>
                        <Col span={4} className='gym-contract-table-tbody-label'>
                            <span>剩余请假次数:</span>
                        </Col>
                        <Col span={8} className='gym-contract-table-tbody-value'>
                            <span>{content.remainingLeaveTimes}</span>
                        </Col>
                        {
                            status === "edit"
                                ?
                                <Col span={4} className='gym-contract-table-tbody-label gym-contract-table-required-label'>
                                    <span className='gym-contract-table-required'>*</span>
                                    <span>本次增加次数:</span>
                                </Col>
                                :
                                <Col span={4} className='gym-contract-table-tbody-label'>
                                    <span>本次增加次数:</span>
                                </Col>
                        }
                        <Col span={8} className='gym-contract-table-tbody-form'>
                            {
                                status === "edit"
                                    ? <FormItem className='gym-act-modal-form'>
                                        {
                                            getFieldDecorator('leaveTimes',{
                                                rules: [
                                                    {required: true, message:'请输入请假次数'}
                                                ],
                                                initialValue:content.newLeaveTimes
                                            })(
                                                <InputNumber />
                                            )
                                        }
                                    </FormItem>
                                    : <FormItem className='gym-act-modal-form'>
                                        {content.newLeaveTimes}
                                    </FormItem>
                            }
                        </Col>
                    </Row>
                    <Row className='gym-contract-table-tbody'>
                        <Col span={4} className='gym-contract-table-tbody-label'>
                            <span>审批状态:</span>
                        </Col>
                        <Col span={20} className='gym-contract-table-tbody-value'>
                        <span>
                            { this.formStatus(content.approvalStatus)}
                        </span>
                        </Col>
                    </Row>
                    <Row className='gym-contract-table-tbody'>
                        {
                            status === "edit"
                                ?
                                <Col span={4} className='gym-contract-table-tbody-form-label gym-contract-table-required-label'>
                                    <span className='gym-contract-table-required'>*</span>
                                    <span>修改请假原因说明:</span>
                                </Col>
                                :
                                <Col span={4} className='gym-contract-table-tbody-form-label'>
                                    <span>修改请假原因说明:</span>
                                </Col>
                        }
                        <Col span={20} className='gym-contract-table-tbody-form-value'>
                            {
                                status === "edit"
                                    ? <FormItem className='gym-act-modal-form'>
                                        {
                                            getFieldDecorator('remark',{
                                                rules: [
                                                    {required: true, message:'请输入修改请假原因说明'}
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

export {LeaveApplyContent}
