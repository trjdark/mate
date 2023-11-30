/**
 * desc:
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2023/5/19
 * Time: 上午9:52
 */

import * as React from "react";
import {Button, Form} from "antd";
import {form} from "../../../../../common/decorator/form";
import {Consumer} from "../../../../../common/decorator/context";
import {PageTitle} from "@/ui/component/pageTitle";

@form()

class NewLeadsReturn extends React.Component<any,any>{
    state={
        successResult:false,
    };
    handleReturn=()=>{
        const {form,leadsArr}=this.props;
        const partParams = {
            leadsList:leadsArr,
        };
        const params = Object.assign({},form.getFieldsValue(),partParams);
        this.props.emitSubmit(params);
    };

    render(){
        const {leadsArr,totalLeadsNum,form}=this.props;
        const assignLeads=leadsArr.length;
        const {getFieldDecorator}=form;
        return (
            <Consumer>
                {(value)=>(
                    <div className='gym-leads-return'>
                        <PageTitle title='返回待分配'/>
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
                    </div>
                )}
            </Consumer>
        )
    }
}

export {NewLeadsReturn};
