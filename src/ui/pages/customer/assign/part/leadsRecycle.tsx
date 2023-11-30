/**
 *Desc: 将leads交还主管
 *User: Debby.Deng
 *Date: 2018/10/10,
 *Time: 上午10:22
 */

import * as React from "react";
import {Button, Form, Select} from "antd";
import {form} from "../../../../../common/decorator/form";
import {User} from "../../../../../common/beans/user";
import {recycleLeads} from "@redux-actions/customer/assignActions";
import {Modal} from "../../../../component/customerCreateModal";
import {recycleType} from "../../enum/assign";
import {Message} from "../../../../component/message/message";
import {Consumer} from "../../../../../common/decorator/context";
import {PageTitle} from "@/ui/component/pageTitle";
const FormItem = Form.Item;


const Option=Select.Option;
@form()
class LeadsRecycle extends React.Component<any,any>{
    state={
        successResult:false,
    };
    handleChange=()=>{

    };
    handleOk=()=>{
        this.setState({successResult:false});
    };
    handleCancel=()=>{
        this.setState({successResult:false});
    };
    handleRecycle=(value)=>{
        const {form,leadsArr}=this.props;
        const partParams={
            currentCenterId:User.currentCenterId,
            leadsList:leadsArr,
        };
        const params=Object.assign({},form.getFieldsValue(),partParams);
        if(leadsArr.length===0){
            Message.warning('请选择客户');
            return;
        }
        recycleLeads(params).then(()=>{
            Message.success('加入回收站成功');
            value.callback();
            this.props.onHideClick();
        });
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
                        <Modal
                            visible={this.state.successResult}
                            handleOk={this.handleOk}
                            handleCancel={this.handleCancel}
                            contentText="加入回收站成功"
                        />
                    </div>
                )}
            </Consumer>
        )
    }
}

export {LeadsRecycle};
