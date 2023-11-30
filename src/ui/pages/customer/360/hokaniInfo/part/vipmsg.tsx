import React from 'react';
import { Checkbox,Form,Input } from 'antd';
import {ReserveRow} from '@/ui/pages/teaching/component/selectCourseRow';
import {form} from "@/common/decorator/form";
import {getMemberInfo,updateMemberInfo} from "@redux-actions/customer/hokaniInfo";
import {User} from "@/common/beans/user";
const Fragment=React.Fragment;
const FormItem=Form.Item;

@form()
class VipMessage extends React.Component<any,any>{
  constructor(props){
    super(props)
    this.state = {
      modeEdit:false,
      cardId:undefined,
      cardPwd:undefined,
      hasAppDownload:undefined,
      isCertificated:undefined
    }
  }

  onEditClick = ()=>{
    this.setState({modeEdit:true})
  }
  onChange = ()=>{}

  save = (e)=>{
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        updateMemberInfo({
          cardId:values.cardId,
          cardPwd:values.cardPwd,
          hasAppDownload:values.hasAppDownload?'1':'0',
          isCertificated:values.isCertificated?1:0,
          currentCenterId:User.currentCenterId,
          leadsId:this.props.leadsId
        }).then(res=>{
          this.setState({
            cardId:values.cardId,
            cardPwd:values.cardPwd,
            hasAppDownload:values.hasAppDownload?'1':'0',
            isCertificated:values.isCertificated?1:0,
            modeEdit:false
          })
        })
      }
    });
  }

  componentDidMount (){
    getMemberInfo({
      currentCenterId:User.currentCenterId,
      leadsId:this.props.leadsId
    }).then(res=>{
      this.setState({
        cardId:res.cardId,
        cardPwd:res.cardPwd,
        hasAppDownload:res.hasAppDownload,
        isCertificated:res.isCertificated
      })
    })
  }

  render(){
    const {
      getFieldDecorator
    }=this.props.form;

    const {
      modeEdit,
      cardId,
      cardPwd,
      hasAppDownload,
      isCertificated
    }=this.state;

    return(
      <Fragment>
        <div className="pane-wrapper">
          {
            modeEdit?(
              <button onClick={this.save}
                      className="gym-button-default-xs btn">保存
              </button>
            ):(
              <button onClick={this.onEditClick}
                      className="gym-button-default-xs btn">编辑
              </button>
            )
          }
          <ReserveRow name="会员卡号："
                      nameWidth="40%"
                      hasBordertop={true}
                      className="first-row"
                      render={()=>(
                        modeEdit?(
                          <FormItem>
                            {getFieldDecorator(`cardId`, {
                                rules: [],
                                initialValue:cardId
                            })(
                              <Input style={{width:200}} />
                            )}
                          </FormItem>
                        ):(
                          <div>{cardId}</div>
                        )
                      )}
          />
          <ReserveRow name="会员卡密码："
                      nameWidth="40%"
                      render={()=>(
                        modeEdit?(
                          <FormItem>
                            {getFieldDecorator(`cardPwd`, {
                                rules: [],
                                initialValue:cardPwd
                            })(
                              <Input style={{width:200}} />
                            )}
                          </FormItem>
                        ):(
                          <div>{cardPwd}</div>
                        )
                      )}
          />
          <ReserveRow name="APP是否已下载"
                      nameWidth="40%"
                      render={()=>(
                        modeEdit?(
                          <FormItem>
                            {getFieldDecorator(`hasAppDownload`, {
                                rules: [],
                                initialValue:hasAppDownload==="1"?true:false,
                                valuePropName:'checked'
                            })(
                              <Checkbox onChange={this.onChange} />
                            )}
                          </FormItem>
                        ):(
                          <Checkbox checked={hasAppDownload==="1"?true:false} disabled />
                        )
                      )}
          />
          <ReserveRow name="Gymboclub是否已注册"
                      nameWidth="40%"
                      className="last-row"
                      render={()=>(
                        modeEdit?(
                          <FormItem>
                            {getFieldDecorator(`isCertificated`, {
                                rules: [],
                                initialValue:isCertificated,
                                valuePropName:'checked'
                            })(
                              <Checkbox onChange={this.onChange} />
                            )}
                          </FormItem>
                        ):(
                          <Checkbox checked={isCertificated} disabled />
                        )
                      )}
          />
        </div>
      </Fragment>
    )
  }
}

export {VipMessage}
