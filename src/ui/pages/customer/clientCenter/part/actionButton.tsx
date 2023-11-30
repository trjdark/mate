/**
 * desc: 操作
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2023/5/17
 * Time: 下午3:21
 */
import React, {Component, Fragment} from 'react';
import {PageTitle} from "@/ui/component/pageTitle";
import {Dropdown, Menu, Icon} from 'antd';
import {ListModal} from "@/ui/component/listModal";
import {NewAssignLeads} from "@/ui/pages/customer/clientCenter/part/newAssignLeads";
import {Modal} from "@/ui/component/customerCreateModal";
import {NewLeadsReturn} from "@/ui/pages/customer/clientCenter/part/newLeadsReturn";
import {NewLeadsRecycle} from "@/ui/pages/customer/clientCenter/part/newLeadsRecycle";
import {NewLeadsToCenter} from "@/ui/pages/customer/clientCenter/part/newLeadsToCenter";
import {User} from "@/common/beans/user";
import {FUNC} from "@/ui/pages/setting/enum/functions";
import {Tooltip} from "antd";
import {Icon as MyIcon} from "@/ui/component/icon";


class ActionButton extends Component<any, any>{
    constructor(props){
        super(props);
        this.state = {
            reShowLeadsAssign: false,
            showLeadsReturn:false,
            showLeadsReceive:false,
            showLeadsAssignCenter:false,
            showLeadsRecycle: false,
            showTransferTmk: false,
            role: ''
        }
    }
    actionMenu = () => {
        const list = [
            {
                label: '分配GB',
                value: 'gb',
                authority: '分配给GB',
                id: 0,
            },{
                label: '分配GA',
                value: 'ga',
                authority: '分配给GA',
                id: 1,
            },{
                label: '领取',
                value: 'receive',
                desc: '领取已分配的Leads',
                authority: '领取',
                id: 2,
            },{
                label: '返回待分配',
                value: 'return',
                desc: '将当前阶段的非会员Leads返回待分配',
                authority: '转移至待分配',
                id: 3,
            },{
                label: '加入回收站',
                value: 'recycle',
                desc: '将当前阶段的非会员Leads加入回收站',
                authority: '加入回收站',
                id: 4,
            },{
                label: '批量外呼',
                value: 'call',
                desc: '对所属Leads进行批量外呼',
                authority: '批量外呼',
                id: 5,
            },{
                label: 'Leads转中心',
                value: 'center',
                desc: '将待分配的Leads转到其他中心',
                authority: 'leads转中心',
                id: 6,
            },{
                label: '转至TMK跟进',
                value: 'tmk',
                desc: '将Leads转移至TMK中心并在本中心锁定',
                authority: '转至TMK跟进',
                id: 7,
            },
        ];
        return (
                <Menu>
                    {
                        list.filter(item => User.permissionList.includes(FUNC[item.authority]))
                            .map(item => (
                            <Menu.Item
                                key={`action_${item.id}`}
                                onClick={()=>this.action(item.value)}>
                                <Tooltip title={item.desc} placement="right">
                                    <div>
                                        <span className='gym-client-center-action-span'>{item.label}</span>{item.desc && <MyIcon className='ml5' type="wenti"/>}
                                    </div>
                                </Tooltip>
                            </Menu.Item>
                        ))
                    }
                </Menu>
        )
    };
    /**
     * 选择操作弹层
     * @param type
     */
    action = (type) => {
        switch (type){
            case 'gb':
            case 'ga':
                this.setState({reShowLeadsAssign: true, role: type});
                break;
            case 'receive':
                this.setState({showLeadsReceive: true, role: 'receive'});
                break;
            case 'return':
                this.setState({showLeadsReturn: true, role: 'return'});
                break;
            case "recycle":
                this.setState({showLeadsRecycle: true, role: 'recycle'});
                break;
            case 'call':
                // this.setState({showLeadsCall: true, role: 'call'});
                this.handleAction(this.props.selectedRowKeys, 'call');
                break;
            case "center":
                this.setState({showLeadsAssignCenter: true, role: 'center'});
                break;
            case "tmk":
                this.setState({showTransferTmk: true, role: 'tmk'});

                break;
        }
    };
    /**
     * 关闭弹层
     * @param {string} type
     */
    hideLeadsMask = (type:string) => {
        switch (type){
            case 'gb':
            case 'ga':
                this.setState({reShowLeadsAssign: false});
                break;
            case 'receive':
                this.setState({showLeadsReceive: false,});
                break;
            case 'return':
                this.setState({showLeadsReturn: false,});
                break;
            case "recycle":
                this.setState({showLeadsRecycle: false,});
                break;
            case "center":
                this.setState({showLeadsAssignCenter: false,});
                break;
            case "tmk":
                this.setState({showTransferTmk: false,});
                break;
        }
    };
    /**
     * 执行操作
     */
    handleAction = (param, type:string) => {
        this.props.emitAction(param, type);
        this.hideLeadsMask(type)
    };
    render(){
        const {selectedRowKeys} = this.props;
        const {
            reShowLeadsAssign, role, showLeadsReturn,
            showLeadsRecycle, showLeadsAssignCenter,
            showTransferTmk
        } = this.state;
        return (
            <Fragment>
                <PageTitle title={
                    <div>
                        <span className='mr30'>查询结果</span>
                        {
                            selectedRowKeys.length > 0
                                ? (
                                    <Dropdown
                                        overlay={this.actionMenu()}
                                    >
                                        <button className='gym-button-white gym-button-xs size14'>操作<Icon type="down" className='ml5' /></button>
                                    </Dropdown>
                                ): (
                                    <button className='gym-button-grey-white gym-button-xs size14'>操作</button>
                                )
                        }
                    </div>
                }
                />



                {/*分配GB/GA*/}
                <ListModal
                    visible={reShowLeadsAssign}
                    width={650}
                    footer={null}
                    destroyOnClose={true}
                    closable={true}
                    maskClosable={true}
                    onCancel={this.hideLeadsMask.bind(this, role)}
                >
                    <NewAssignLeads
                        onHideClick={this.hideLeadsMask.bind(this, role)}
                        leadsArr={selectedRowKeys}
                        totalLeadsNum={selectedRowKeys.length}
                        role={role}
                        emitAssign={this.handleAction}
                    />
                </ListModal>
                {/*领取*/}
                <Modal
                    visible={this.state.showLeadsReceive}
                    handleOk={this.handleAction.bind(this, {leadsList:selectedRowKeys}, 'receive')}
                    handleCancel={this.hideLeadsMask.bind(this, 'receive')}
                    contentText={`已选择${selectedRowKeys.length}个Leads,将操作${selectedRowKeys.length}个Leads`}
                    // contentText={`确定领取吗？`}
                />
                {/*返回待分配*/}
                <ListModal
                    visible={showLeadsReturn}
                    width={650}
                    footer={null}
                    destroyOnClose={true}
                    closable={true}
                    maskClosable={true}
                    onCancel={this.hideLeadsMask.bind(this, 'return')}
                >
                    <NewLeadsReturn
                        emitSubmit={(e) => this.handleAction(e, 'return')}
                        onHideClick={this.hideLeadsMask.bind(this, 'return')}
                        leadsArr={selectedRowKeys}
                        totalLeadsNum={selectedRowKeys.length}
                    />
                </ListModal>
                {/*回收站*/}
                <ListModal
                    visible={showLeadsRecycle}
                    width={650}
                    destroyOnClose={true}
                    closable={true}
                    maskClosable={true}
                    onCancel={this.hideLeadsMask.bind(this, 'recycle')}
                    footer={null}
                >
                    <NewLeadsRecycle
                        onHideClick={this.hideLeadsMask.bind(this, 'recycle')}
                        emitSubmit={(e) => this.handleAction(e, 'recycle')}
                        leadsArr={selectedRowKeys}
                        totalLeadsNum={selectedRowKeys.length}
                    />
                </ListModal>
                {/*leads转中心*/}
                <ListModal
                    visible={showLeadsAssignCenter}
                    width={500}
                    footer={null}
                    destroyOnClose={true}
                    closable={true}
                    maskClosable={true}
                    onCancel={this.hideLeadsMask.bind(this, 'center')}
                >
                    <NewLeadsToCenter
                        onHideClick={this.hideLeadsMask.bind(this, 'center')}
                        emitSubmit={(e) => this.handleAction(e, 'center')}
                        leadsArr={selectedRowKeys}
                        totalLeadsNum={selectedRowKeys.length}
                    />
                </ListModal>
                {/*转移至TMK*/}
                <Modal
                    visible={showTransferTmk}
                    handleOk={this.handleAction.bind(this, {leadsIdList:selectedRowKeys}, 'tmk')}
                    handleCancel={this.hideLeadsMask.bind(this, 'tmk')}
                    contentText={`已选择${selectedRowKeys.length}个Leads，将操作${selectedRowKeys.length}个Leads`}
                    contentTitle={`注意：仅回收站阶段的Leads可进行转移至TMK中心的操作`}
                />
            </Fragment>
        )
    }
}

export {ActionButton}
