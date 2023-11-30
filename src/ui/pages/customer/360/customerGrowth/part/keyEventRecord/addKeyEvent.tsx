/**
 *Desc: 创建关键事件
 *User: Debby.Deng
 *Date: 2018/11/15,
 *Time: 下午2:30
 */
import {DatePicker, Form, Select} from "antd";
import * as React from "react";
import {TextArea} from "../../../../../../component/input";
import {PageTitle} from "@/ui/component/pageTitle";
const {Option}=Select;
const FormItem = Form.Item;

class AddKeyEvent extends React.Component<any>{
    render(){
        const {form}=this.props;
        const {getFieldDecorator}=form;
       return  (
            <Form>
                <div className='gym-growth-key-event bgWhite'>
                    <PageTitle title='创建特殊事件'/>
                    <div>
                        <FormItem label='事件类型' className='flex'>
                        {
                            getFieldDecorator('eventType',{
                                initialValue:'77005'
                            })(
                                <Select style={{width:'200px'}}>
                                    <Option value={`77005`}>特殊事件</Option>
                                </Select>
                            )
                        }
                        </FormItem>
                    </div>
                    <div>
                        <FormItem label='时间' className='flex'>
                            {
                                getFieldDecorator('eventDate',{
                                    rules:[{required:true,message:'请选择时间'}]
                                })(
                                    <DatePicker  />
                                )
                            }
                        </FormItem>
                    </div>
                    <div>
                        <FormItem label='个人笔记' className='flex no-margin'>
                            {
                                getFieldDecorator('comment')(
                                    <TextArea/>
                                )
                            }
                        </FormItem>
                    </div>
                </div>
            </Form>

       )
    }
}

export {AddKeyEvent};
