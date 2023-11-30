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
import { Routes } from "@/router/enum/routes";
import { getProveListDetail, operateApprove} from '@redux-actions/report/approve';
import { handleValidate, Validation } from "../../../../../common/utils/validate";
import { User } from "../../../../../common/beans/user";
import { Modal } from '@/ui/component/customerCreateModal';
import history from '@/router/history';
import '../style/index.scss';
const FormItem = Form.Item;
const applyType = {//
    "1005001": "帐号解锁",
    "1005002": "人员信息变更",
};
const approveType = {
    "1006001": "待审批",
    "1006002": "审批通过",
    "1006003": "审批不通过",
}
@form()

class ApproveSheet extends React.Component<any, any> {
    id: string;
    isEdit:number;
    form: any;
    constructor(props: any) {
        super(props)
        if (CommonUtils.hasParams(props)) {
            this.id = CommonUtils.parse(props).id,
            this.isEdit = CommonUtils.parse(props).isEdit
        };
        this.state = {
            center: {},
            visible: false,
            refuseVisible: false,
            detail: [],
            applyType: '',
        }
    }
    componentDidMount() {
        getProveListDetail({
            currentCenterId: User.currentCenterId,
            id: this.id,
        }).then((res:any)=>{
            this.setState({ detail: res, applyType: res.applyType})
        })

    }
    handleSubmit = (e: any) => {
        e.preventDefault();
        const { validateFields} = this.props.form;
        validateFields((err:any,values:any)=> {
            if(!err){
                this.setState({visible:true})

            }
        })

    }
    handleCancel = () => {
        this.setState({ refuseVisible: true })
    }
    onRefuseCancel =()=>{
        this.setState({ refuseVisible: false })
    }
    // 取消
    onCancel = () => {
        this.setState({ visible: false});
    }
    onOk = () => {
        operateApprove({
            id:this.id,
            currentCenterId: User.currentCenterId,
            approvalStatus: '1'
        }).then((res:any)=>{
            message.success('审批通过')
            this.setState({ visible: false });
            history.goBack()
        })
    }
    onRefuseOk = () => {
        operateApprove({
            id: this.id,
            currentCenterId: User.currentCenterId,
            approvalStatus: '0'
        }).then((res: any) => {
            message.warning('审批不通过')
            this.setState({ refuseVisible: false });
            history.goBack();
        })
    }
    // 查看详情
    detail = () => {
        history.push(`${Routes.审批管理单详情.link}/${CommonUtils.stringify({ id: this.id, applyType: this.state.applyType })}`)
    }
    render() {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        const { detail, visible, refuseVisible } = this.state;
        return (
            <div className='gym-employee-add'>
                <Form ref={(ref: any) => this.form = ref}>
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

                                        initialValue: detail.chineseName
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
                                        initialValue: detail.englishName,
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
                                        initialValue: detail.staffPostName,
                                    })(
                                        <Input placeholder='岗位' disabled={true} />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={16} className='gym-apply-account'>
                            <div className='gym-apply-type'>
                                申请事项:<span className='gym-apply-deblock'>{applyType[detail.applyType]}</span>
                                {
                                    detail.applyType === '1005002'&&
                                    < span onClick={this.detail}>查看详情</span>
                                }
                            </div>
                        </Col>
                        <Col span={16}>
                            <FormItem label={this.isEdit === 0?`申请理由`:`请填写申请理由`}>
                                {
                                    getFieldDecorator('applyReason', {
                                        initialValue: detail.applyReason,
                                    })(
                                        <TextArea placeholder={`员工账号正常使用`} maxLength={500} style={{ width: '600px' }} disabled={true}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        {
                            this.isEdit===0&&
                            <Col span={16}>
                                <FormItem label={`申请结果`}>
                                    {
                                        getFieldDecorator('applyReason', {
                                            initialValue: detail.approvalStatus,
                                        })(
                                            <div>{approveType[detail.approvalStatus]}</div>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        }
                    </Row>
                </Form>
                {
                    this.isEdit=== 1 &&
                    <div className='text-c mt30'>
                        <button
                            key="submit"
                            className="gym-button-xs gym-button-default mr20"
                            onClick={this.handleSubmit}
                        >
                            审批通过
                        </button>
                        <button
                            key="back"
                            className="gym-button-xs gym-button-white"
                            onClick={this.handleCancel}
                        >
                            拒绝
                        </button>
                    </div>
                }
                <Modal
                    visible={visible}
                    handleOk={this.onOk}
                    handleCancel={this.onCancel}
                    contentText={`确认审批通过吗？`}
                    okText="审批通过"
                    cancelText="取消"
                />
                <Modal
                    visible={refuseVisible}
                    handleOk={this.onRefuseOk}
                    handleCancel={this.onRefuseCancel}
                    contentText={`确认拒绝审批吗？`}
                    okText="拒绝审批"
                    cancelText="取消"
                />
            </div>
        )
    }
}

export { ApproveSheet }
