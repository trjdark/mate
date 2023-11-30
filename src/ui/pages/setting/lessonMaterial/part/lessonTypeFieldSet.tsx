import React, {Component} from 'react';
import {Button, Form} from "antd";
import {Option, Select} from "@/ui/component/select";
import {form} from "@/common/decorator/form";

declare interface LessonAttrProps {
    form: any,
    value:any,
    index:any,
    deleteItem:any,
    options:any,
    startMonth:any,
    endMonth:any,
    handleLessonChange:any,
    handleFocus:any,
}

/*解构出二级组件,方便调用*/
const FormItem = Form.Item;

@form()
export class LessonFieldSet extends Component<LessonAttrProps, any> {
    constructor(props) {
        super(props);
    }

    render() {
        const {form, value, index, deleteItem, options,startMonth, endMonth, handleLessonChange, handleFocus} = this.props;
        const {getFieldDecorator} = form;
        return (
            <div className="gym-center-achievement-gb-set">
                <FormItem label="课程等级" style={{display:'inline-flex',width:'40%'}} className='gym-lesson-row-level'>
                    {
                        getFieldDecorator(`${index}-${(value && value !== '') ? value : null}`, {
                            initialValue: value? value : '',
                            rules: [
                                {
                                    required: true,
                                    message: '请选择课程等级'
                                },
                            ]
                        })(
                            <Select
                                onChange={(value,row) => handleLessonChange(value,row, index)}
                                onFocus={() => handleFocus(value)}
                                style={{width:200}}
                                placeholder={'请选择'}
                            >
                                {
                                    options.map(item => {
                                        const {levelName, endMonth, beginMonth, disabled, id} = item;
                                        return (
                                            <Option
                                                key={`${levelName}-${beginMonth}-${endMonth}`}
                                                value={id}
                                                disabled={disabled}
                                            >
                                                {levelName}
                                            </Option>
                                        );
                                    })
                                }
                            </Select>
                        )
                    }
                </FormItem>
                <FormItem label="月龄起止" style={{display:'inline-flex',width:'40%'}} className='gym-lesson-row-month'>
                    {
                        getFieldDecorator(`${index}-${startMonth}-${endMonth}`, {
                            initialValue: `${startMonth}-${endMonth}个月`,

                        })(
                            <span>{`${startMonth} - ${endMonth}个月`}</span>
                        )
                    }
                </FormItem>
                <Button htmlType={'button'} className='gym-button-wBlue-xs reset' onClick={() => deleteItem(index)}>删除</Button>
            </div>
        )
    }
}
