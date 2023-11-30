/**
 * desc: 联系人信息卡片
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2020/2/10
 * Time: 下午2:59
 */
import React, { Component} from "react";
import {Tabs, Modal, Form} from 'antd';
import {PageTitle} from "@/ui/component/pageTitle";
import {Select, Option} from "@/ui/component/select";
import {form} from "@/common/decorator/form";
import {Input, TextArea} from "@/ui/component/input";
import {User} from "@/common/beans/user";
import {handleValidate, Validation} from "@/common/utils/validate";


const {TabPane} = Tabs;
const FormItem = Form.Item;

declare interface ParentInfoCardProps {
    contactInfo:Array<any>
    customerId:string
    form?:any
    emitSumbit:(res:any, type:'edit'|'add') => void
    isLogin:boolean
    isCalling:boolean
    leadsId:string
    cid:string
    emitDial:(res:any) => void
}



@form()
class ParentInfoCard extends Component<ParentInfoCardProps, any>{
    relactionEnum = [
        {
            name:'爸爸',
            value: '05001',
        },{
            name:'妈妈',
            value: '05002',
        },{
            name:'爷爷',
            value: '05003',
        },{
            name:'奶奶',
            value: '05004',
        },{
            name:'外公',
            value: '05005',
        },{
            name:'外婆',
            value: '05006',
        },{
            name:'其他',
            value: '05007',
        },
    ];
    state = {
        visibleEdit: false,
        type: 'add',
        contactId: '',
        selectContact: {}
    };
    /**
     * 打开弹层
     */
    showEditModal = (type: 'edit'|'add') => {
        this.setState({
            type:type,
            visibleEdit: true,
        });
    };
    /**
     * 关闭弹层
     */
    handleCloseEditModal = () => {
        this.setState({visibleEdit: false});
    };
    /**
     * 切换tab
     * @param value
     */
    changeTab = (value:string) => {
        const {contactInfo} = this.props;
        this.setState({
            contactId:value,
            selectContact: contactInfo.filter((item:any) => item.id === value)[0]
        });
    }
    /**
     * 保存
     */
    handleSubmit = () => {
        const {type, contactId, selectContact}:any = this.state;
        const {customerId, form, contactInfo} = this.props;
        const _contactId = contactId ? contactId : contactInfo[0].id;
        form.validateFields((err,values)=>{
            if(!err){
                let param:any;
                if(type === 'add'){
                    param = Object.assign({}, values, {
                        currentCenterId: User.currentCenterId,
                        customerId,
                    });
                }else{
                    param = Object.assign({}, values, {
                        currentCenterId: User.currentCenterId,
                        customerId,
                        contactId: _contactId
                    });
                }
                this.props.emitSumbit(param, type);
                this.setState({
                    selectContact: Object.assign({}, selectContact, values)
                })
                this.handleCloseEditModal();
            }
        })
    };
    /**
     * 拨打
     */
    handleDial = () => {
        const {leadsId, cid, contactInfo} = this.props;
        const {contactId} = this.state;
        const _contactId = contactId ? contactId : contactInfo[0].id;
        const param = {
            cid: cid,
            leadsId: leadsId,
            contactId: _contactId
        }
        this.props.emitDial(param)
    };
    render(){
        const {contactInfo, form, isLogin, isCalling} = this.props;
        let {visibleEdit, type, selectContact}:any = this.state;
        const {getFieldDecorator} = form;
        // 判断选中的联系人是否为空对象，如果是则默认为第一联系人
        const currentContact = Object.keys(selectContact).length === 0 ? contactInfo[0] : selectContact;
        const isCD = User.role.includes("CD");
        return(
            <div id="gym-call-parent-info-card" className="gym-call-parent-info-card">
                {
                    contactInfo.length > 0
                    ?
                    <Tabs type="card" className="gym-call-parent-info-card-tabs" onChange={this.changeTab}>
                        {
                            (contactInfo || []).map((item:any) => (
                                <TabPane tab={item.familyRelationValue} key={item.id} >
                                    <div className="gym-call-parent-info-card-main gym-call-page-wrap">
                                        <div className="gym-call-parent-info-card-main-info">
                                            {item.isPrimaryContact ? <span className="primary">主</span> : null }
                                            <span className="name">{item.contactName || item.familyRelationValue}</span>
                                            <span className="phone">{item.primaryContactTel}</span>
                                        </div>
                                        <div className="gym-call-parent-info-card-main-remark">
                                            <p>{item.remark}</p>
                                        </div>
                                        <div className="gym-call-parent-info-card-main-buttons">
                                            {
                                                (isLogin && !isCalling)
                                                ?<button className="gym-button-white gym-button-xxs mr10" onClick={this.handleDial}>拨打</button>
                                                :<button className="gym-button-grey gym-button-xxs mr10">拨打</button>
                                            }
                                            <button className="gym-button-white gym-button-xxs mr10" onClick={() => this.showEditModal('edit')}>编辑</button>
                                            <button className="gym-button-white gym-button-xxs" onClick={() => this.showEditModal('add')}>新增</button>
                                        </div>
                                    </div>
                                </TabPane>
                            ))
                        }
                    </Tabs>
                    :
                    <div className="gym-call-page-wrap gym-call-parent-info-card-no-date">
                        <span>暂无数据</span>
                    </div>
                }
                <Modal
                    visible={visibleEdit}
                    footer={false}
                    onCancel={this.handleCloseEditModal}
                    destroyOnClose={true}
                    width={700}
                >
                    <div className="gym-call-parent-modal-main">
                        <PageTitle title={`${type === 'add' ? '新增' : '编辑'}联系人`}/>
                        <Form className="gym-call-parent-modal-main-form">
                            <FormItem label={'家庭关系：'} className="gym-call-parent-modal-main-form-item">
                                {
                                    getFieldDecorator('familyRelation', {
                                        rules: [{required: true, message:"请选择家庭关系"}],
                                        initialValue: (type === 'edit' && currentContact) ? currentContact.familyRelation : ''
                                    })(<Select>
                                        {
                                            this.relactionEnum.map((item:any, index:number) =>(
                                                <Option value={item.value} key={`option_${index}`}>{item.name}</Option>
                                            ))
                                        }
                                    </Select>)
                                }
                            </FormItem>
                            <FormItem label={'手机：'} className="gym-call-parent-modal-main-form-item">
                                {
                                    getFieldDecorator('primaryContactTel', {
                                        rules: [{required: true, validator: handleValidate[Validation.手机号]}],
                                        initialValue: (type === 'edit' && currentContact) ? currentContact.primaryContactTel : ''
                                    })(<Input disabled={type === 'edit' && !isCD}/>)
                                }
                            </FormItem>
                            <FormItem label={'备注：'} className="gym-call-parent-modal-main-form-item long">
                                {
                                    getFieldDecorator('remark',{
                                        initialValue: (type === 'edit' && currentContact) ? currentContact.remark : ''
                                    })(<TextArea className="textarea" maxLength={80}/>)
                                }
                            </FormItem>
                            <div className="gym-call-parent-modal-main-form-buttons">
                                <button className="gym-button-default gym-button-lg mr10" onClick={this.handleSubmit}>保存</button>
                                <button className="gym-button-white gym-button-lg" onClick={this.handleCloseEditModal}>取消</button>
                            </div>
                        </Form>
                    </div>
                </Modal>


            </div>
        )
    }
}

export {ParentInfoCard}
