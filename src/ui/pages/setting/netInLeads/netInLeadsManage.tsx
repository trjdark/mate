/**
 * desc: NetInLeadsManage
 * User: colin.lu
 * Date: 2018/9/01
 * Time: 上午10:00
 */

import React from 'react';
import {Form, Row, Col, message} from "antd";
import {Input} from "@/ui/component/input";
import {form} from "@/common/decorator/form";
import {getNetInLeadsCenterManagerPhone, saveNetInLeadsCenterManagerPhone} from "@redux-actions/setting/netInLeads";
import {User} from "@/common/beans/user";
import {CancelButton} from "@/ui/component/cancelButton";
import {handleValidate, Validation} from "@/common/utils/validate";
import {connect} from "@/common/decorator/connect";
import {selectTotalEmployeeList} from "@/saga/selectors/home";
import {Select, Option} from "@/ui/component/select";

const FormItem = Form.Item;

// 在职员工
const selectOption = {
    workingStatus: "1",
};

@connect((state:any) => ({
    stuffList: selectTotalEmployeeList(state, selectOption)
}), {})
@form()
class NetInLeadsManage extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            netInCdMobile: '',       // 值班伙伴电话
            dutyStaffId:'',          // 值班伙伴id
            dutyPost:'',             // 备注
            id: '',
        }
    }

    componentDidMount() {
        this.getPhoneInfo();
    }

    /**
     * 获取各个主管的联系手机号
     */
    getPhoneInfo = () => {
        const postData ={
           currentCenterId: User.currentCenterId
        };

        getNetInLeadsCenterManagerPhone(postData).then((res) => {
            this.setState({
                netInCdMobile: res.netInCdMobile ? res.netInCdMobile: '',
                dutyStaffId: res.dutyStaffId,
                dutyPost: res.dutyPost,
                id: res.id,
            })
        }, (err) => {
           message.error(err.msg);
        })
    };

    onSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err,values)=>{
            if(!err){
                let postData = {
                    netInCdMobile: values.netInCdMobile === '' ? null : values.netInCdMobile,
                    currentCenterId: User.currentCenterId,
                    id: this.state.id,
                    dutyStaffId: values.dutyStaffId,
                    dutyPost: values.dutyPost
                };

                saveNetInLeadsCenterManagerPhone(postData).then(() => {
                   message.success('保存成功');
                }, (err) => {
                   message.error(err.msg);
                })

            }
        })
    };

    render() {
        const { form, stuffList }=this.props;
        const { getFieldDecorator } = this.props.form;
        const {netInCdMobile, dutyStaffId, dutyPost} = this.state;
        // 中小屏幕表单居左
        const formItemLayout = {
            labelCol: {
                sm: { span: 4 },
                md: { span: 8 }
            }
        };
        return (
            <div id='gym-net' className='gym-net'>
                <Form onSubmit={this.onSubmit} >
                    <Row>
                        <FormItem label={'值班伙伴姓名'} {...formItemLayout}>
                            {
                                getFieldDecorator('dutyStaffId', {
                                    initialValue: dutyStaffId
                                })(
                                    <Select
                                        showSearch
                                        filterOption={(input, option:any) => option.props.children.indexOf(input) >= 0}
                                    >
                                        {
                                            stuffList.map((item:any, index:number) =>
                                                <Option
                                                    key={`${item.staffId}${index}`}
                                                    value={item.staffId}
                                                >{item.userName}</Option>
                                            )
                                        }
                                    </Select>
                                )
                            }
                        </FormItem>
                        <FormItem label={'值班伙伴电话'} {...formItemLayout}>
                            {
                                getFieldDecorator('netInCdMobile', {
                                    rules: [
                                        {
                                            validator:handleValidate[Validation.可为空手机号]
                                        }
                                    ],
                                    initialValue: netInCdMobile
                                })(
                                    <Input type={'text'} placeholder={`请输入手机号`} maxLength={11}/>
                                )
                            }
                        </FormItem>
                        <FormItem label={'岗位备注'} {...formItemLayout}>
                            {
                                getFieldDecorator('dutyPost', {
                                    initialValue: dutyPost
                                })(
                                    <Input type={'text'} max={20}/>
                                )
                            }
                        </FormItem>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <CancelButton form={form} goBackLink={undefined}/>
                        </Col>
                    </Row>
                </Form>
            </div>
        )
    }
}

export {NetInLeadsManage}
