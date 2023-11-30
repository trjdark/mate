/**
 * desc: 添加节日
 * Date: 2018/8/15
 * Time: 下午4:13
 */

import React from 'react';
import {Form, DatePicker, Col, Row} from "antd";
import {Input} from "@/ui/component/input";
import {Select, Option as SelectOption} from "@/ui/component/select";
import {form} from "@/common/decorator/form";
import {HolidayType, DefaultHolidayType} from "../../enum/holiday";
import {addHoliday, checkHoliday} from "@redux-actions/setting/holidayActions";
import {User} from "@/common/beans/user";
import {CancelButton} from "@/ui/component/cancelButton";
import {Routes} from "@/router/enum/routes";
import {Message} from "@/ui/component/message/message";
import {Modal} from "@/ui/component/customerCreateModal";

const FormItem = Form.Item;
const {RangePicker} = DatePicker;

@form()
class HolidayAdd extends React.Component<any, any>{
    state = {
      checkVisible: false
    };

    onSubmit = (e) => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if(!err){
                const startDate = values.date[0].format('YYYY-MM-DD');
                const endDate = values.date[1].format('YYYY-MM-DD');
                delete values.date;

                let postData = {
                    "currentCenterId": User.currentCenterId,
                    "endDate": endDate,
                    "holidayName": values.holidayName,
                    "isEnabled": values.isEnabled,
                    "startDate": startDate
                };
                checkHoliday(postData).then(() => {
                    addHoliday(Object.assign({}, values, {startDate, endDate}))
                        .then(() => {
                            Message.success("添加成功");
                        })
                }, (err) => {
                    if(err.code === 0 && err.msg === 'errHoliday'){
                        this.setState({
                            checkVisible: true
                        })
                    }else{
                        Message.error(err.msg)
                    }
                })
            }
        })
    };

    onOk = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const startDate = values.date[0].format('YYYY-MM-DD');
                const endDate = values.date[1].format('YYYY-MM-DD');
                delete values.date;
                addHoliday(Object.assign({}, values, {startDate, endDate}))
                    .then(() => {
                        Message.success("添加成功");
                        this.setState({
                            checkVisible: false,
                        });
                    });

            }
        })
    };

    onCancel = () => {
        this.setState({
            checkVisible: false
        })
    };

    render(){
        const {form} = this.props;
        const {checkVisible} = this.state;
        const {getFieldDecorator} = form;
        const formItemLayout = {
            labelCol: {
                sm: { span: 4 },
            }
        };
        return(
            <div className='gym-holiday-add'>
                <Form onSubmit={this.onSubmit}>
                    <FormItem label={`节假日名称`} {...formItemLayout}>
                        {
                            getFieldDecorator("holidayName", {
                                rules: [{
                                    required: true, message: `请填写节假日名称`
                                }]
                            })(
                                <Input placeholder={`节假日名称`} maxLength={50}/>
                            )
                        }
                    </FormItem>
                    <FormItem label={`开始结束日期`} {...formItemLayout}>
                        {
                            getFieldDecorator("date", {
                                rules: [{
                                    required: true, message: `请选择开始结束时间`
                                }]
                            })(
                                <RangePicker/>
                            )
                        }
                    </FormItem>
                    <FormItem label={`所属中心`} {...formItemLayout}>
                        {
                            getFieldDecorator('currentCenterId', {
                                initialValue: User.currentCenterId
                            })(
                                <span>{User.currentCenterName}</span>
                            )
                        }
                    </FormItem>
                    <FormItem label={`状态`} {...formItemLayout}>
                        {
                            getFieldDecorator("isEnabled", {
                                initialValue: DefaultHolidayType
                            })(
                                <Select className='gym-holiday-add-select'>
                                    {
                                        HolidayType.map((item:any) => (
                                            <SelectOption key={item.key} value={item.value}>{item.name}</SelectOption>
                                        ))
                                    }
                                </Select>
                            )
                        }
                    </FormItem>
                    <Row>
                        <Col span={24}>
                            <CancelButton form={form} goBackLink={Routes.节假日列表.path}/>
                        </Col>
                    </Row>
                </Form>
                <Modal
                    visible={checkVisible}
                    handleOk={this.onOk}
                    handleCancel={this.onCancel}
                    contentText={`节假日内有已选未上课程，保存之后将批量删除，是否继续？`}
                />
            </div>
        )
    }
}

export {HolidayAdd}
