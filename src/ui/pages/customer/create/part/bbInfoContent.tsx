/**
 * desc: 新建客户 => 宝宝信息
 * User: dave.zhang
 * Date:
 * Time:
 */
import { Form, Row, Col, Radio} from 'antd';
import {Input} from "@/ui/component/input";
import {DateInput} from "@/ui/component/datePicker";
import React from 'react'
import {getMonthValue} from "@redux-actions/customerCreate"
import {User} from "@/common/beans/user";
import moment from 'moment'
import {AvatorUploadForm} from '@/ui/component/avatorUploadForm';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class BabyInformationContent extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {}
    }

    /**
     * 修改名字
     * @param e
     */
    onNameChange = (e) => {
        let value = e.target.value
        this.props.onTitleChange({value, key: this.props.tabKey})
    };
    onBirthdayChange = (date, dateStr) => {
        // 设置月龄
        if (date) {
            getMonthValue({
                birthday: date.valueOf(),
                currentCenterId: User.currentCenterId
            }).then((res) => {
                this.props.form.setFieldsValue({
                    [`monthAge-${this.props.tabKey}`]: res.monthValue
                })
            })
        } else {
            this.props.form.setFieldsValue({
                [`monthAge-${this.props.tabKey}`]: ''
            })
        }
    };

    /**
     * 宝宝姓名验证
     * @param rule
     * @param value
     * @param cb
     */
    nameValidator = (rule, value, cb) => {
        let idx = value.indexOf('/')
        if (idx > -1) {
            cb('姓名不能包含特殊字符‘/’')
        }
        if (!value) {
            cb('请输入姓名')
        }
        cb()
    };

    getUrlfromFileId = (photoPath) => {
        if (photoPath) {
            let url = `${location.protocol}//${location.host}/api/mate-basic/basic/file/fileView?fileId=${photoPath}&token=${User.getToken}`;
            return [{uid: '-1', url, fileId: photoPath}]
        } else {
            return []
        }
    };

    render() {
        const {isEdit=true, data} = this.props;
        const field = this.props.data && this.getUrlfromFileId(this.props.data.photoPath)[0];
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 8},
            }
        };
        return (
            <div>
                <Row>
                  {
                    data &&
                    <FormItem label={'id'} {...formItemLayout} style={{display:'none'}}>
                        {getFieldDecorator(`id-${this.props.tabKey}`, {
                            rules: [],
                            initialValue: data.id
                        })(
                            <Input disabled={!isEdit} placeholder={`id`}/>
                        )}
                    </FormItem>
                  }
                </Row>
                <Row>
                    <Col span={8}>
                        <FormItem label={'姓名'} {...formItemLayout}>
                            {getFieldDecorator(`babyName-${this.props.tabKey}`, {
                                rules: [{
                                    required: true,
                                    whitespace:true,
                                    transform:(val)=>(val?val.toString():""),
                                    validator:this.nameValidator
                                }],
                                initialValue: data.babyName || ''
                            })(
                                <Input disabled={!isEdit} placeholder={`姓名`} onChange={this.onNameChange}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label={'出生医院'} {...formItemLayout}>
                            {getFieldDecorator(`birthHospital-${this.props.tabKey}`, {
                                rules: [],
                                initialValue: data.birthHospital || ''
                            })(
                                <Input disabled={!isEdit} placeholder={`出生医院`} maxLength={50} />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <FormItem label={'昵称'} {...formItemLayout}>
                            {getFieldDecorator(`nickname-${this.props.tabKey}`, {
                                rules: [],
                                initialValue: data.nickname || ''
                            })(
                                <Input disabled={!isEdit} placeholder={`昵称`} />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label={'在读学校'} {...formItemLayout}>
                            {getFieldDecorator(`school-${this.props.tabKey}`, {
                                initialValue: data.school || ''
                            })(
                                <Input disabled={!isEdit} placeholder={`在读学校`} />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <FormItem label={'性别'} {...formItemLayout}>
                            {getFieldDecorator(`gender-${this.props.tabKey}`, {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择性别'
                                    }
                                ],
                                initialValue: data.gender
                            })(
                                <RadioGroup disabled={!isEdit}>
                                  <Radio value={1}>男</Radio>
                                  <Radio value={0}>女</Radio>
                                </RadioGroup>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label={'备注'} {...formItemLayout}>
                            {getFieldDecorator(`trait-${this.props.tabKey}`, {
                                rules: [],
                                initialValue: data.trait || ''
                            })(
                                <Input disabled={!isEdit} placeholder={`备注`} />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <FormItem label={`出生日期`} {...formItemLayout}>
                            {
                                getFieldDecorator(`birthday-${this.props.tabKey}`, {
                                    rules: [{required: true, message: '请填写出生日期'}],
                                    initialValue: data.birthday ? moment(data.birthday) : null
                                })(
                                    <DateInput disabled={!isEdit} onChange={this.onBirthdayChange}  />
                                )
                            }
                        </FormItem>
                        <FormItem label={'月龄'} {...formItemLayout}>
                            {getFieldDecorator(`monthAge-${this.props.tabKey}`, {
                                rules: [],
                                initialValue: data.monthValue || ''
                            })(
                                <Input placeholder={`月龄`} disabled  style={{width:200}}/>
                            )}
                        </FormItem>
                    </Col>

                    <Col span={8}>
                        <FormItem label={'照片'} {...formItemLayout}>
                            {
                                isEdit? <AvatorUploadForm form={this.props.form}
                                                          field={`photoPath-${this.props.tabKey}`}/>: (!!field && <img src={field &&field.url} style={{width:104,height:104}}/>)
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <FormItem label={'身份证'} {...formItemLayout}>
                            {getFieldDecorator(`identityCard-${this.props.tabKey}`, {
                                rules: [{required: false, message: '请填写身份证'}],
                                initialValue: data.identityCard || ''
                            })(
                                <Input disabled={!isEdit} placeholder={`如需使用电子合同，请完善宝宝身份证`} />
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </div>
        )
    }
}

export {BabyInformationContent}
