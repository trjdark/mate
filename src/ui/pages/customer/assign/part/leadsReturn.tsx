/**
*Desc: 将leads交还主管
*User: Debby.Deng
*Date: 2018/10/10,
*Time: 上午10:22
*/

import * as React from "react";
import {Button, Form} from "antd";
import {form} from "../../../../../common/decorator/form";
import {User} from "../../../../../common/beans/user";
import { returnLeads} from "@redux-actions/customer/assignActions";
import {Modal} from "../../../../component/customerCreateModal";
import {Message} from "../../../../component/message/message";
import {Consumer} from "../../../../../common/decorator/context";
import {PageTitle} from "@/ui/component/pageTitle";

@form()

class LeadsReturn extends React.Component<any,any>{
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
    handleReturn=(value)=>{
        const {form,leadsArr}=this.props;
        const partParams={
            currentCenterId:User.currentCenterId,
            leadsList:leadsArr,
        };
        const params=Object.assign({},form.getFieldsValue(),partParams);
        returnLeads(params).then(()=>{
            Message.success('交还成功');
            value.callback();
            this.props.onHideClick();
        });
    };

    render(){
        const {leadsArr,totalLeadsNum,form}=this.props;
        const assignLeads=leadsArr.length;
        const {getFieldDecorator}=form;
        return (
            <Consumer>
                {(value)=>(
                        <div className='gym-leads-return'>
                            <PageTitle title='Leads交还主管'/>
                            <p className='gym-leads-return-notice'>确定要交还么？交还后就再也见不到我们咯！</p>
                            <p className='gym-leads-return-number'>
                                已选中<span className='cDefault'>{assignLeads||1}</span>
                                个Leads(共有<span className='corange'>{totalLeadsNum}</span>个Leads可交还)
                            </p>
                            <div className='gym-leads-return-reason'>
                                <Form>
                                    <div className='gym-leads-return-reason-wrap'>
                                        <div className='gym-leads-return-reason-title'>
                                            <p className='gym-warning'>* </p><p>交还原因说明:</p>
                                        </div>
                                        <div className='gym-leads-return-reason-wrap-textarea'>
                                            {getFieldDecorator('returnReason')(
                                                <textarea rows={4} maxLength={200}/>
                                            )}
                                        </div>
                                    </div>
                                    <div className='text-c gym-bottom-btn-group'>
                                        <Button htmlType='submit'
                                                className='gym-button-xs gym-button-default mr20'
                                                onClick={this.handleReturn.bind(this,value)}>交还</Button>
                                        <Button className='gym-button-xs gym-button-white'
                                                onClick={this.props.onHideClick}
                                        >取消</Button>
                                    </div>
                                </Form>
                        </div>
                        <Modal
                            visible={this.state.successResult}
                            handleOk={this.handleOk}
                            handleCancel={this.handleCancel}
                            contentText="确定领取吗？"
                        />
                    </div>
                )}
            </Consumer>
        )
    }
}

export {LeadsReturn};
