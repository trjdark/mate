/**
*Desc: 创建续约跟进记录
*User: Debby.Deng
*Date: 2018/11/28,
*Time: 上午10:49
*/
import {DatePicker, Form, Select} from "antd";
import * as React from "react";
import {TextArea} from "../../../../../../component/input";
import {reNewStatus} from "../../../../enum/client360";
import {PageTitle} from "@/ui/component/pageTitle";
const {Option}=Select;
const FormItem = Form.Item;

interface propsFormat {
    form:any,
    onHideClick:()=>(void),
    intensionList:Array<any>,
    [propName:string]:any,
}
class AddRenewFollow extends React.Component<propsFormat>{

    render(){
        const {form,intensionList}=this.props;
        const {getFieldDecorator}=form;
       return  (
            <Form>
                <div className='gym-growth-renew-follow bgWhite'>
                    <div>
                        <PageTitle title={`新建续约跟进信息`}/>
                    </div>
                    <div>
                        <FormItem label={'续约沟通'} className='flex'>
                        {
                            getFieldDecorator('contactDate',{
                                rules:[{required:true,message: '请填入续约沟通时间'}]
                            })(
                                <DatePicker/>
                            )
                        }
                        </FormItem>
                    </div>
                    <div>
                        <FormItem label={'续约状态'} className='flex'>
                            {
                                getFieldDecorator('status',{
                                    rules:[{required:true,message:'请选择续约状态'}]
                                })(
                                    <Select>
                                        {reNewStatus.map((status)=>{
                                           return <Option key={status.value} value={status.value}>
                                               {status.name}
                                               </Option>
                                        })
                                        }
                                    </Select>
                                )
                            }
                        </FormItem>
                    </div>
                    <div>
                        <FormItem label={'续约意向'} className='flex'>
                            {
                                getFieldDecorator('intention')(
                                    <Select>
                                        {
                                            intensionList.map((intension)=>{
                                                return <Option key={intension.centerPackageId}
                                                               value={intension.centerPackageId}>
                                                    {intension.packageName}
                                                </Option>
                                            })
                                        }
                                    </Select>
                                )
                            }
                        </FormItem>
                    </div>
                    <div>
                        <FormItem label='续约备注' className='flex no-margin'>
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

export {AddRenewFollow};
