/**
 * desc: 拨打页面表单组件
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2020/2/10
 * Time: 下午5:05
 */
import React, {Component} from 'react';
import { Form, Radio, message} from 'antd';
import { Select, Option } from "@/ui/component/select";
import {form} from "@/common/decorator/form";
import {DateInput} from "@/ui/component/datePicker";
import {TextArea} from "@/ui/component/input";
import {User} from "@/common/beans/user";
import {Filter} from "@/filter/filter";
import {intentionLevel} from "@/ui/pages/customer/enum/assign";

const FormItem = Form.Item;

declare interface FormCallRecordProps {
    callId:string
    form?:any
    leadsId:string
    emitSubmit:(res:any) => void
    wrappedComponentRef?:any
}

@form()

class FormCallRecord extends Component<FormCallRecordProps, any> {
    state = {
        tmkPhase: '',     // 当前状态
    };
    /**
     * 保存
     */
    handleSubmit = () => {
        const {form, callId, leadsId, emitSubmit} = this.props;
        const {validateFields} = form;
        validateFields((err, values) => {
            const data = Object.assign({}, values, {
                currentCenterId:User.currentCenterId,
                sponsorStaffId: User.userId,
                tmkNextContactTime: values.tmkNextContactTime ? values.tmkNextContactTime.valueOf() : '',
                callId: callId,
                leadsId: leadsId,
                taskDesc: `${Filter.formatTaskStatus(values.taskStatus)}${values.taskDesc ? values.taskDesc : ''}`
            });
            if (values.taskStatus === "95006") {
                message.success('该leads将加入回收站')
                emitSubmit(data);
            } else {
                emitSubmit(data);
            }
        })
    };
    /**
     * 清空
     */
    clearForm = () => {
        const {form} = this.props;
        this.setState({tmkPhase: ''});
        form.resetFields();
    }
    render(){
        const {callId} = this.props;
        const {getFieldDecorator} = this.props.form;
        return(
            <div id="gym-call-form">
                <Form className="gym-call-form">
                    <div className="gym-call-form-th">
                        <span>本次通话内容/摘要</span>
                    </div>
                    <FormItem label={'已联络：'} className="gym-call-form-item">
                        {
                            getFieldDecorator('taskStatus', {
                                rules: [
                                    {required: true, message:'请填写'}
                                ],
                            })(
                                <Radio.Group disabled={!callId}>
                                    <Radio value={"95001"}>拒绝-没有需求</Radio>
                                    <Radio value={"95002"}>拒绝-已报其他品牌</Radio>
                                    <Radio value={"95003"}>拒绝-孩子太小</Radio>
                                    <Radio value={"95004"}>拒绝-不在所属区域</Radio>
                                    <Radio value={"95005"}>未诺访，待跟进</Radio>
                                    <Radio value={"95006"}>错/空号</Radio>
                                    <Radio value={"95007"}>联系未果-停机</Radio>
                                    <Radio value={"95008"}>联系未果-无人接听</Radio>
                                    <Radio value={"95009"}>其他</Radio>
                                </Radio.Group>
                            )
                        }
                    </FormItem>
                    <FormItem label={'诺访：'} className="gym-call-form-item">
                        {
                            getFieldDecorator('taskStatus', {
                                rules: [
                                    {required: true, message:'请填写'}
                                ],
                            })(
                                <Radio.Group disabled={!callId}>
                                    <Radio value={"96001"}>参观</Radio>
                                    <Radio value={"96002"}>试听</Radio>
                                    <Radio value={"96003"}>活动</Radio>
                                    <Radio value={"96004"}>测评</Radio>
                                </Radio.Group>
                            )
                        }
                    </FormItem>
                    <FormItem label={'已到访：'} className="gym-call-form-item">
                        {
                            getFieldDecorator('taskStatus', {
                                rules: [
                                    {required: true, message:'请填写'}
                                ],
                            })(
                                <Radio.Group disabled={!callId}>
                                    <Radio value={"97001"}>已试听</Radio>
                                    <Radio value={"97002"}>定金</Radio>
                                </Radio.Group>
                            )
                        }
                    </FormItem>
                    <FormItem label={'下次联系时间：'} className="gym-call-form-item">
                        {
                            getFieldDecorator('tmkNextContactTime')(
                                <DateInput
                                    format={"YYYY/MM/DD HH:mm"}
                                    showTime
                                />
                            )
                        }
                    </FormItem>
                    <FormItem label={'意向度：'} className="gym-call-form-item">
                        {
                            getFieldDecorator('intentionLevel', {
                            })(
                                <Select
                                    showSearch={true}
                                    filterOption={(input, option: any) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {
                                        (intentionLevel || []).map((item: any) =>
                                            <Option
                                                key={`${item.code}${item.name}`}
                                                value={item.code}
                                            >{item.name}
                                            </Option>)
                                    }
                                </Select>
                            )
                        }
                    </FormItem>
                    <FormItem label={'备注：'} className="gym-call-form-item">
                        {
                            getFieldDecorator('taskDesc')(
                                <TextArea />
                            )
                        }
                    </FormItem>
                </Form>
                <div className="gym-call-form-button">
                    <button
                        disabled={!callId}
                        className={`gym-button-${callId ? 'default': 'grey'} gym-button-xs`}
                        onClick={this.handleSubmit}
                    >保存</button>
                </div>
            </div>
        )
    }
}

export {FormCallRecord};
