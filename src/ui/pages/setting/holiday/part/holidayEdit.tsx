/**
 * desc: 节假日修改
 * Date: 2018/8/22
 * Time: 下午8:19
 */

import React from 'react';
import {Form, Input, DatePicker, Select, Row, Col} from "antd";
import {form} from "../../../../../common/decorator/form";
import {HolidayType} from "../../enum/holiday";
import {CommonUtils} from "../../../../../common/utils/commonUtils";
import {getHoliday, updateHoliday, checkHoliday} from "@redux-actions/setting/holidayActions";
import moment from 'moment';
import {User} from "../../../../../common/beans/user";
import {CancelButton} from "../../../../component/cancelButton";
import {Routes} from "@/router/enum/routes";
import {Message} from "@/ui/component/message/message";
import {Modal} from "@/ui/component/customerCreateModal";

const FormItem = Form.Item;
const {RangePicker} = DatePicker;
const SelectOption = Select.Option;

@form()

class HolidayEdit extends React.Component<any, any>{
    holidayId:string;
    constructor(props:any){
        super(props);
        if(CommonUtils.hasParams(props)){
            this.holidayId = CommonUtils.parse(props).id;
        }
        this.state = {
            checkVisible: false,
            changeEnableVisible: false,
            changeDisableVisible: false,
            holiday: {},
        }
    }
    componentDidMount(){
        getHoliday({
            id:this.holidayId,
            currentCenterId: User.currentCenterId
        }).then((res:any) => {
            this.setState({
                holiday: res
            })
        })
    }
    onSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err){
                values.startDate = values.date[0].format('YYYY-MM-DD');
                values.endDate = values.date[1].format('YYYY-MM-DD');
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

                checkHoliday(postData).then((res) => {
                    updateHoliday(Object.assign({}, {id: this.holidayId}, values))
                        .then(() => {
                            Message.success('保存成功')
                        });
                }, (err) => {
                    if(err.code === 0 && err.msg === 'errHoliday'){
                        this.setState({checkVisible: true})
                    }else if(err.msg !== 'errHoliday'){
                        Message.error(err.msg)
                    }
                });
            }
        })
    };

    onOk = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.startDate = values.date[0].format('YYYY-MM-DD');
                values.endDate = values.date[1].format('YYYY-MM-DD');
                delete values.date;

                updateHoliday(Object.assign({}, {id: this.holidayId}, values))
                    .then(() => {
                        Message.success('保存成功')
                        this.setState({
                            checkVisible: false
                        })
                    });

            }
        })
    };

    onOkEnable = () => {
        this.props.form.setFieldsValue({'isEnabled':1});
        this.setState({
            changeEnableVisible: false,
        })
    };

    onOkDisable = () => {
        this.props.form.setFieldsValue({'isEnabled':0});
        this.setState({
            changeDisableVisible: false
        })
    };


    onCancel = () => {
        this.setState({
            checkVisible: false
        })
    };

    onCancelEnable = () => {
        this.props.form.setFieldsValue({'isEnabled':0});
        this.setState({
            changeEnableVisible: false,
        })
    };

    onCancelDisable = () => {
        this.props.form.setFieldsValue({'isEnabled':1});
        this.setState({
            changeDisableVisible: false
        })
    };

    changeEnabled= (value) => {
        let that=this;
        if(value==1){
            that.setState({
                changeEnableVisible: true
            });
        }else if(value==0){
            that.setState({
                changeDisableVisible: true
            });
        }
    };
    render(){
        const {getFieldDecorator} = this.props.form;
        const {checkVisible, changeEnableVisible, changeDisableVisible, holiday} = this.state;
        const{form} = this.props;
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
                                }],
                                initialValue: holiday.holidayName
                            })(
                                <Input placeholder={`节假日名称`} maxLength={50}/>
                            )
                        }
                    </FormItem>
                    <FormItem label={`开始结束日期`} {...formItemLayout}>
                        {
                            getFieldDecorator("date", {
                                rules: [{
                                    required: true, message: `请选择结束截止时间`
                                }],
                                initialValue:[moment(holiday.startDate),moment(holiday.endDate)]
                            })(
                                <RangePicker/>
                            )
                        }
                    </FormItem>
                    <FormItem label={`所属中心`} {...formItemLayout}>
                        {
                            getFieldDecorator('currentCenterId',{
                                initialValue: User.currentCenterId
                            })(
                                <span>{User.currentCenterName}</span>
                            )
                        }
                    </FormItem>
                    <FormItem label={`状态`} {...formItemLayout}>
                        {
                            getFieldDecorator("isEnabled",{
                                initialValue: holiday.isEnabled
                            })(
                                <Select className='gym-holiday-add-select' onChange={this.changeEnabled}>
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
                <Modal
                    visible={changeEnableVisible}
                    handleOk={this.onOkEnable}
                    handleCancel={this.onCancelEnable}
                    contentText={`确定要启用该节假设定吗?`}
                />
                <Modal
                    visible={changeDisableVisible}
                    handleOk={this.onOkDisable}
                    handleCancel={this.onCancelDisable}
                    contentText={`你确定要失效该节假设定吗?`}
                />
            </div>
        )
    }
}

export {HolidayEdit}
