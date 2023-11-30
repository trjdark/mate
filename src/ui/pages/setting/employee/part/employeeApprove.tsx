/**
 * desc: 员工管理解锁审批
 * User:Vicky.yu
 * Date: 2020/12/2
 * Time: 17:00
 */

import React from 'react';
import { Row, Col, Form, Input, message } from "antd";
import { TextArea } from "@/ui/component/input";
import { form } from "../../../../../common/decorator/form";
import { CommonUtils } from "../../../../../common/utils/commonUtils";
import { applyDeblockDetail, applyDeblock} from '@redux-actions/report/approve';
import { Routes } from "@/router/enum/routes";
import { handleValidate, Validation } from "../../../../../common/utils/validate";
import { Message } from "@/ui/component/message/message";
import { Modal } from '@/ui/component/customerCreateModal';
import history from '@/router/history';
import { User } from '@/common/beans/user';
const FormItem = Form.Item;

@form()

class employeeApprove extends React.Component<any, any> {
    id: string;
    form: any;
    constructor(props: any) {
        super(props)
        if (CommonUtils.hasParams(props)) {
            this.id = CommonUtils.parse(props).id
        };
        this.state = {
            center: {},
            visible: false,
            details: [], // 详细信息
            postName:'',
        }
    }
    componentDidMount() {
        applyDeblockDetail({ id: this.id, currentCenterId: User.currentCenterId}).then((res:any)=>{
            this.setState({
                details: res,
            })
        })
    }
    /**
     * 提交
     * @param e
     */
    onSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                applyDeblock(Object.assign({}, {}, values)).then(() => {
                    Message.success("修改成功");
                })
            }
        })
    };
    handleSubmit = (e: any) => {
        e.preventDefault();
        const { validateFields } = this.props.form;
        validateFields((err: any, values: any) => {
            if (!err) {
                this.setState({ visible: true })
            }
        })
    }
    handleCancel = () => {
        history.push(Routes.员工信息管理.path)
    }
    // 取消
    onCancel = () => {
        this.setState({ visible: false });
    }
    onOk = (e:any) => {
        e.preventDefault();
        const { validateFields } = this.props.form;
        const {details} = this.state;
        const staffID = (details.findStaffPostResponses || []).map(item => item.staffId)
        validateFields((err: any, values: any) => {
            if (!err) {
                const params = Object.assign({}, values, {
                    currentCenterId: User.currentCenterId,
                    staffId: staffID.toString(),
                })
                applyDeblock(params).then((res: any) => {
                    message.success('发起成功')
                    this.setState({visible:false});
                    history.goBack();
                })
            }
        })
    }
    render() {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        const { visible,details } = this.state;
        const staffName = (details.findStaffPostResponses||[]).map(item=>item.postName)
        staffName.toString()
        return (
            <div className='gym-employee-add'>
                <Form onSubmit={this.onSubmit} ref={(ref: any) => this.form = ref}>
                    <Row>
                        <Col span={8}>
                            <FormItem label='中文名' className='gym-employee-add-form-item'>
                                {
                                    getFieldDecorator('chineseName', {
                                        rules: [{
                                            required: true, message: "请输入中文名", whitespace: true
                                        },
                                        { validator: handleValidate[Validation.非空格] }
                                        ],

                                        initialValue: details.chineseName
                                    })(
                                        <Input placeholder='中文名' disabled={true} />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label='英文名' className='gym-employee-add-form-item'>
                                {
                                    getFieldDecorator('englishName', {
                                        rules: [{
                                            required: true, message: "请输入英文名"
                                        }],
                                        initialValue: details.englishName,
                                    })(
                                        <Input placeholder='英文名' disabled={true} />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label='岗位' className='gym-employee-add-form-item'>
                                {
                                    getFieldDecorator('staffPostName', {
                                        rules: [{
                                            required: true, message: "请输入英文名"
                                        }],
                                        initialValue: staffName.toString(),
                                    })(
                                        <Input placeholder='岗位' disabled={true} />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={16}>
                            <FormItem label='填写申请理由'>
                                {
                                    getFieldDecorator('applyReason', {
                                        rules: [{
                                            required: true, message: "填写申请理由"
                                        }],
                                    })(
                                        <TextArea placeholder='请填写申请理由' maxLength={500} style={{ width: '600px' }} />
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <div className='text-c mt30'>
                    <button
                        key="submit"
                        className="gym-button-sm gym-button-default mr20"
                        onClick={this.handleSubmit}
                    >
                        发起申请
                    </button>
                    <button
                        key="back"
                        className="gym-button-xs gym-button-white"
                        onClick={this.handleCancel}
                    >
                        取消
                    </button>
                </div>
                <Modal
                    visible={visible}
                    handleOk={this.onOk}
                    handleCancel={this.onCancel}
                    contentText='确定提交吗？'
                />
            </div>
        )
    }
}

export { employeeApprove }
