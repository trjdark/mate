/**
 * desc: 赠课申请信息（审批）
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/11/29
 * Time: 下午1:46
 */
import React from 'react';
import {Form, Row, Col, message} from "antd";
import {ConfirmCheck} from "@/ui/component/confirmCheck";
import {approveFreeCourse, updateFreeCourse} from "@redux-actions/contract";
import {User} from "@/common/beans/user";
import history from "../../../../../router/history";
import {Routes} from "@/router/enum/routes";
import {form} from "@/common/decorator/form";
import {InputNumber, TextArea} from "../../../../component/input";
import {UploadImg} from "@/ui/component/uploadImg";
import {CancelButton} from "@/ui/component/cancelButton";
import {connect} from "@/common/decorator/connect";
import {selectContractFreeStatus} from "@/saga/selectors/contract";
import {Thumbnail} from "@/ui/component/thumbnail";

const FormItem = Form.Item;

declare interface FreeDefaultContentProps {
    content:any,
    status:string,
    form?:any,
    freeStatusList?:Array<any>
}
@connect((state:any) => ({
    freeStatusList: selectContractFreeStatus(state),
}))
@form()
class FreeDefaultContent extends React.Component<FreeDefaultContentProps, any>{
    /**
     * 格式化审批状态
     * @param {string} status
     * @returns {string}
     */
    formStatus = (status:string) => {
        const {freeStatusList} = this.props;
        const freeStatus = freeStatusList.filter((item:any) => item.code === status);
        return freeStatus.length > 0 ? freeStatus[0].codeValue : '-'
    };
    /**
     * 审批合同
     * @param {string}
     */
    approvalContract = (res:any) => {
        const {content} = this.props;
        approveFreeCourse({
            approvalOperateType: res.approvalOperateType,
            id: content.id,
            currentCenterId: User.currentCenterId,
            contractId: content.contractId,
            remark: res.remark
        }).then(() => {
            message.success("审批成功");
            history.push(Routes.合同操作列表赠课.path)
        })
    };
    /**
     * 上传图片
     */
    handleUploadImg = (file:any, fileList:Array<any>) => {
        const {setFieldsValue} = this.props.form;
        setFieldsValue({attachmentList: fileList.map((item:any) => item.response.data)})
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
                updateFreeCourse(Object.assign({}, values, {
                    currentCenterId: User.currentCenterId,
                    contractId: this.props.content.contractId,
                    id: this.props.content.id,
                })).then(() => {
                    message.success("修改成功");
                    history.goBack()
                })
            }
        })
    };
    render(){
        const {content, status, form} = this.props;
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
                    <Row className='gym-contract-table-tbody gym-contract-table-top gym-contract-table-thead-left gym-contract-table-thead-right'>
                        {
                            status === "edit"
                                ?
                                <Col span={4} className='gym-contract-table-tbody-label gym-contract-table-thead-left gym-contract-table-required-label'>
                                    <span className='gym-contract-table-required'>*</span>
                                    <span>本次赠课:</span>
                                </Col>
                                :
                                <Col span={4} className='gym-contract-table-tbody-label gym-contract-table-thead-left'>
                                    <span>本次赠课:</span>
                                </Col>
                        }
                        <Col span={8} className='gym-contract-table-tbody-form'>
                            {
                                status === "edit"
                                    ? <FormItem className='gym-act-modal-form'>
                                        {
                                            getFieldDecorator('freeCourseNum',{
                                                rules: [
                                                    {required: true, message:'请输入赠课数'}
                                                ],
                                                initialValue:content.freeCourseNum
                                            })(
                                                <InputNumber min={1} precision={0}/>
                                            )
                                        }
                                    </FormItem>
                                    : <FormItem className='gym-act-modal-form'>
                                        {content.freeCourseNum}
                                    </FormItem>
                            }
                        </Col>
                        <Col span={4} className='gym-contract-table-tbody-label'>
                            <span>审批状态:</span>
                        </Col>
                        <Col span={8} className='gym-contract-table-tbody-value gym-contract-table-thead-right'>
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
                                    <span>赠课原因说明:</span>
                                </Col>
                                :
                                <Col span={4} className='gym-contract-table-tbody-form-label'>
                                    <span>赠课原因说明:</span>
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
                                                    disabled={content.remark === '2020 — 因新型冠状病毒肺炎【COVID-19】疫情赠课'}
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
                    <Row className='gym-contract-table-tbody gym-contract-table-tbody-left gym-contract-table-tbody-right'>
                        <Col span={4} className='gym-contract-table-tbody-form-attachment gym-contract-table-tbody-left'>
                            <span>附件:</span>
                        </Col>
                        <Col span={20} className='gym-contract-table-tbody-form-value gym-contract-table-tbody-right'>
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
                                ensure={() => this.approvalContract({approvalOperateType:'1'})}
                                button={<button className='gym-button-default gym-button-xs gym-contract-table-bottoms-button'>同意</button>}
                            />
                            <ConfirmCheck
                                contentText={"确认不同意此申请？"}
                                item={{}}
                                ensure={() => this.approvalContract({approvalOperateType:'0'})}
                                button={<button className='gym-button-white gym-button-xs gym-contract-table-bottoms-button'>不同意</button>}
                            />
                        </div>
                    </Row>
                }
            </div>

        )
    }
}

export {FreeDefaultContent}
