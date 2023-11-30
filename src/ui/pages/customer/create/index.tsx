/**
 * desc: 新建客户
 * User: dave.zhang
 * Date:
 * Time:
 */
import React from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {CreateProgress} from "@/ui/pages/customer/create/part/createProgress";
import {TabForm} from "@/ui/pages/customer/create/part/tabForm";
import {TabFormContact} from "@/ui/pages/customer/create/part/tabFormContact";
import {AddressInformation} from "@/ui/pages/customer/create/part/addressInfo";
import {LeadsInformation} from "@/ui/pages/customer/create/part/leadsInfo";
import {User} from "@/common/beans/user";
import {Modal} from '@/ui/component/customerCreateModal'
import {ListModal} from '@/ui/component/listModal';
import {AssignLeads} from "../assign/part/assignLeads";
import {createleads} from "@redux-actions/customerCreate";

import './style/index.scss';
import {Routes} from "@/router/enum/routes";
import {CommonUtils} from "@/common/utils/commonUtils";

class CreateCustomer extends React.Component<any, any> {
    private routes: Array<any> = [
        {name: '客户', path: '', link: '#', id: 'customer'},
        {name: '客户信息管理', path: '', link: '#', id: 'customer-info-management'},
        {name: '新建Leads', path: '', link: '#', id: 'customer-create'},
    ];
    constructor(props) {
        super(props);
        this.state = {
            step: 0,
            babys: [],
            contacts: [],
            leadsRequest: {},
            addressInfo: {},
            //  提示
            visible: false,
            validateMsgs: [],
            photoUrl: '',
            showLeadsAssign: false,
            createleadsId: '',
            cellphoneExisted: false,
            // 验证手机号是否重复弹出modal
            existedMsg: '',
            existedVisiable: false,
            // 成功，但不需要分配
            visibleNoAssign: false
        }
    }

    /**
     * 保存宝宝信息
     */
    handleSaveBaby = (babys:any) => {
        this.setState( prevState => {
            return {
                step: prevState.step + 1,
                babys
            }
        })
    };
    /**
     * 保存联系人信息
     * @param contacts
     */
    handleSaveContact = (contacts:any) => {
        this.setState( prevState => {
            return {
                step: prevState.step + 1,
                contacts,
            }
        })
    };
    /**
     * 保存住址信息
     */
    handleSaveAddress = (addressInfo:any) => {
        this.setState( prevState => {
            return {
                step: prevState.step + 1,
                addressInfo
            }
        })
    };
    /**
     * 提交
     */
    handleSubmit = (leadsRequest:any) => {
        this.setState({
            leadsRequest
        }, () => {
            const {babys, contacts, leadsRequest, addressInfo} = this.state;
            const param = {
                babys, contacts, leadsRequest, addressInfo,
                currentCenterId: User.currentCenterId
            };
            if(this.checkCellphoneExisted(param['contacts'])){
                return
            }
            createleads(param)
                .then((res) => {
                    if (User.role.length === 1 && User.role[0] === 'GB') {
                        // 弹出成功，但不能分配
                        this.setState({visibleNoAssign: true, createleadsId: res})
                    } else {
                        this.setState({visible: true, createleadsId: res})
                    }
                })
        })
    };
    /**
     * 上一步
     */
    prev = () => {
        this.setState( prevState => {
            return {step: prevState.step - 1}
        })
    };
    /**
     * 检查例子是否存在
     * @param contacts
     * @returns {boolean}
     */
    checkCellphoneExisted = (contacts) => {
        let existed = contacts.some((elem) => elem.cellphoneExisted);
        if (existed) {
            this.setState({
                existedVisiable: true,
                existedMsg: '手机号码已存在，该leads再次获取，请去提醒CD。'
            });
            return true
        }
        return false
    }
    /**
     * 弹层有已存在leads,关闭
     */
    existedHandleOk = () => {
        this.setState({existedVisiable: false})
    };
    /**
     * 弹层创建成功,不分配,确认
     */
    handleNoAssignOk = () => {
        window.location.reload()
    };
    /**
     * 弹层创建成功,不分配,关闭
     */
    handleNoAssignCancel = () => {
        this.setState({visibleNoAssign: false})
    };
    /**
     * 弹层创建成功,分配，确认
     */

    handleOk = () => {
        this.setState({visible: false}, () => {
            this.setState({showLeadsAssign: true});
        })
    }

    hideAssignLeads = () => {
        this.setState({showLeadsAssign: false}, () => {
            window.location.reload();
        });
    }
    /**
     * 弹层创建成功,分配，取消
     */
    handleCancel = () => {
        this.setState({visible: false}, () => {
            // 是否现在分配取消：跳转客户中心待分配
            this.props.history.push(`${Routes.分配客户.link}/${CommonUtils.stringify({phaseId: '1'})}`)
        })
    };

    render() {
        const {step} = this.state;
        return (
            <div>
                <BreadCrumb routes={this.routes}/>
                <div id='gym-customer-create'>
                    <CreateProgress
                        textList={['宝宝信息', '联系人信息', '住址信息', 'Leads信息']}
                        step={step}
                    />
                    <TabForm
                        emitNext={this.handleSaveBaby}
                        style={{display:step === 0 ? 'block' : 'none'}}
                    />
                    <TabFormContact
                        emitNext={this.handleSaveContact}
                        emitPrev={this.prev}
                        style={{display:step === 1 ? 'block' : 'none'}}
                    />
                    <AddressInformation
                        emitNext={this.handleSaveAddress}
                        emitPrev={this.prev}
                        style={{display:step === 2 ? 'block' : 'none'}}

                    />
                    <LeadsInformation
                        emitNext={this.handleSubmit}
                        emitPrev={this.prev}
                        style={{display:step === 3 ? 'block' : 'none'}}
                    />
                </div>
                {/**创建成功,分配**/}
                <Modal
                    visible={this.state.visible}
                    handleOk={this.handleOk}
                    handleCancel={this.handleCancel}
                    contentText="客户创建成功！是否现在分配？"
                    okText="分配"
                    cancelText="不分配"
                />
                {/**创建成功,不分配**/}
                <Modal
                    visible={this.state.visibleNoAssign}
                    handleOk={this.handleNoAssignOk}
                    handleCancel={this.handleNoAssignCancel}
                    contentText="客户创建成功！"
                    hasCancel={0}
                />
                {/**有已存在leads**/}
                <Modal
                    visible={this.state.existedVisiable}
                    handleOk={this.existedHandleOk}
                    handleCancel={this.existedHandleOk}
                    contentText={this.state.existedMsg}
                />

                <ListModal visible={this.state.showLeadsAssign}
                           width={650}
                           destroyOnClose={true}
                           closable={false}
                           maskClosable={true}
                           footer={null}
                >
                    <AssignLeads onHideClick={this.hideAssignLeads}
                                 leadsArr={[this.state.createleadsId]}
                                 role={'GB'}
                    />
                </ListModal>
            </div>
        )
    }
}

export {CreateCustomer}
