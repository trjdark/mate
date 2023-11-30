/**
 * desc: 操作leads按钮组件
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2020/2/11
 * Time: 上午9:24
 */
import React, {Component} from "react";
import {PageTitle} from "@/ui/component/pageTitle";
import { Modal, Form, Popover, DatePicker} from 'antd';
import moment from 'moment';
import { Select, Option } from "@/ui/component/select";
import {form} from "@/common/decorator/form";
import {Input} from "@/ui/component/input";
import {User} from "@/common/beans/user";
import {Icon} from "@/ui/component/icon"
import {intentionLevel} from "@/ui/pages/customer/enum/assign";

const FormItem = Form.Item;

declare interface ActionLeadsButtonProps {
    form?:any
    centerList?:Array<any>
    babyInfo:any,
    leadsInfo:any,
    emitSubmitEditBabyInfo:(res:any) => void
    customerId:string
    leadsId:string
}

@form()
class ActionLeadsButton extends Component<ActionLeadsButtonProps, any>{
    state = {
        visibleEditBaby: false,
        visibleTransferLeads: false,
        selectCenterId: '',             // 转移的中心
    };
    /**
     * 打开编辑宝宝弹层
     */
    showEditBabyModal = () => {
        this.setState({
            visibleEditBaby: true,
        })
    };
    /**
     * 关闭编辑宝宝弹层
     */
    handleCloseEditBabyModal = () => {
        this.setState({visibleEditBaby: false})
    };
    /**
     * 提交宝宝信息
     */
    handleSubmitBabyInfo = () => {
        const {babyInfo, form, emitSubmitEditBabyInfo} = this.props;
        form.validateFields((err,values)=>{
            if(!err){
                const param = Object.assign({}, values, {
                    currentCenterId: User.currentCenterId,
                    babyId:babyInfo.id
                });
                emitSubmitEditBabyInfo(param);
            }
        })
        this.handleCloseEditBabyModal();
    };
    render(){
        const {visibleEditBaby} = this.state;
        const { form, babyInfo, leadsInfo} = this.props;
        const {getFieldDecorator} = form;
        return(
            <div className="gym-call-action-buttons" id="gym-call-action-buttons">
                <div className='tmk-short-entrance'>
                    <Popover content={`修改宝宝信息`}>
                        <div>
                            <Icon className='tmk-edit tmk-edit-one tmk-part-title-icon mr10' type={`xiugai`} onClick={this.showEditBabyModal} />
                        </div>
                    </Popover>
                </div>
                <Modal
                    visible={visibleEditBaby}
                    footer={false}
                    width={700}
                    onCancel={this.handleCloseEditBabyModal}
                    destroyOnClose={true}
                >
                    <PageTitle title='修改宝宝信息'/>
                    <Form className="gym-call-action-buttons-form">
                        <FormItem label={'姓名：'} className="gym-call-action-buttons-form-item">
                            {
                                getFieldDecorator('babyName', {
                                    rules: [{required: true, message:"请输入姓名"}],
                                    initialValue: babyInfo.babyName
                                })(<Input/>)
                            }
                        </FormItem>
                        <FormItem label={'昵称：'} className="gym-call-action-buttons-form-item">
                            {
                                getFieldDecorator('nickname', {
                                    initialValue: babyInfo.nickname
                                })(<Input maxLength={10}/>)
                            }
                        </FormItem>
                        <FormItem label={'会员生日：'} className="gym-call-action-buttons-form-item">
                            {
                                getFieldDecorator('birthday', {
                                    initialValue: moment(babyInfo.birthday) ? moment(babyInfo.birthday):null
                                })(<DatePicker
                                    format={"YYYY/MM/DD"}
                                />)
                            }
                        </FormItem>
                        <FormItem label={'意向度：'} className="gym-call-action-buttons-form-item">
                            {
                                getFieldDecorator('intentionLevel', {
                                    initialValue: leadsInfo.intentionLevelCode
                                })(
                                    <Select
                                        showSearch={true}
                                        filterOption={(input, option: any) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        {
                                            (intentionLevel || []).map((item: any) =>
                                                <Option
                                                    key={`${item.code}${item.name}`}
                                                    value={item.code}
                                                >{item.name}
                                                </Option>)
                                        }
                                    </Select>
                                )
                            }
                        </FormItem>
                        <div className="gym-call-action-buttons-form-buttons">
                            <button className="gym-button-default gym-button-lg mr10" onClick={this.handleSubmitBabyInfo}>保存</button>
                            <button className="gym-button-white gym-button-lg" onClick={this.handleCloseEditBabyModal}>取消</button>
                        </div>
                    </Form>

                </Modal>
            </div>
        )
    }
}

export {ActionLeadsButton};
