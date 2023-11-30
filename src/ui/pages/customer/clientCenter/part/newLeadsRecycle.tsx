/**
 * desc:
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2023/5/19
 * Time: 上午10:56
 */
import * as React from "react";
import {Button, Form, Select} from "antd";
import {form} from "../../../../../common/decorator/form";
import {recycleType} from "../../enum/assign";
import {Consumer} from "../../../../../common/decorator/context";
import {PageTitle} from "@/ui/component/pageTitle";
const FormItem = Form.Item;


const Option=Select.Option;
@form()
class NewLeadsRecycle extends React.Component<any,any>{
    handleRecycle = ()=>{
        const {form,leadsArr}=this.props;
        const partParams = {
            leadsList:leadsArr,
        };
        const params = Object.assign({},form.getFieldsValue(),partParams);
        this.props.emitSubmit(params);
    };

    render(){
        const { leadsArr,totalLeadsNum,form}=this.props;
        const {getFieldDecorator}=form;
        const assignLeads=leadsArr.length;
        return (
            <Consumer>
                {(value)=>(
                    <div>
                        <div className='gym-leads-recycle'>
                            <PageTitle title='Leads加入回收站'/>
                            <p className='gym-leads-return-notice'>确定要丢弃么，丢弃后GB再也看不见哦</p>
                            <p className='gym-leads-recycle-number'>
                                已选中<span className='cDefault'>{assignLeads||1}</span>
                                个Leads(共有<span className='corange'>{totalLeadsNum}</span>个Leads可回收)
                            </p>
                            <div className='gym-leads-recycle-reason'>
                                <Form>
                                    <FormItem label='丢弃原因' className='flex ml20'>
                                        {getFieldDecorator('recycleType',{
                                            rules:[{required:true}]
                                        })(
                                            <Select style={{width:'200px'}}>
                                                {recycleType.map((type)=>{
                                                    return(<Option value={type.value} key={type.value}>
                                                        {type.name}
                                                    </Option>)
                                                })}

                                            </Select>
                                        )}
                                    </FormItem>
                                    <div className='gym-leads-recycle-reason-wrap'>
                                        <div className='gym-leads-recycle-reason-title'>
                                            <p className='gym-warning'>* </p><p>丢弃原因说明:</p>
                                        </div>
                                        <div className='gym-leads-recycle-reason-wrap-textarea'>
                                            {getFieldDecorator('recycleReason')(
                                                <textarea rows={4} maxLength={200}/>
                                            )}
                                        </div>
                                    </div>
                                    <div className='text-c gym-bottom-btn-group'>
                                        <Button htmlType='submit'
                                                className='gym-button-xs gym-button-default mr20'
                                                onClick={this.handleRecycle.bind(this,value)}>丢弃</Button>
                                        <Button className='gym-button-xs gym-button-white'
                                                onClick={this.props.onHideClick}
                                        >取消</Button>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                )}
            </Consumer>
        )
    }
}

export {NewLeadsRecycle};
