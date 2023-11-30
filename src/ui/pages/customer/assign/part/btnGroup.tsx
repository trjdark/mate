/**
 * Desc: 根据角色获取不同按钮组
 * User: Debby.Deng
 * Date: 2018/10/9,
 * Time: 下午3:44
 */
import React, {Fragment} from "react";
import {Link} from 'react-router-dom';
import {User} from "@/common/beans/user";
import {CommonUtils} from "@/common/utils/commonUtils";
import {LeadsReturn} from "./leadsReturn";
import {AssignLeads} from "./assignLeads";
import {LeadsToCenter} from "./assignLeadsToCenter";
import {connect} from "@/common/decorator/connect";
import {receiveLeads, recycleLeads} from "@redux-actions/customer/assignActions";
import {LeadsRecycle} from "./leadsRecycle";
import {Modal} from "@/ui/component/customerCreateModal";
import {Message} from "@/ui/component/message/message";
import {Consumer} from "@/common/decorator/context";
import {FUNC} from "../../../setting/enum/functions";
import {AssignCustomers} from "./assignCustomers";
import {ListModal} from "@/ui/component/listModal";
import {PageTitle} from "@/ui/component/pageTitle";
import {TablePagination} from "@/ui/component/tablePagination";
import {MultiTaskForm} from "@/ui/pages/customer/assign/part/multiTaskForm";
import {queryTaskInfo} from "@redux-actions/customerCreate";
import {recordTelephoneMembers} from "@redux-actions/telephone/callLeads";
import {Routes} from "@/router/enum/routes";
import { Menu, Dropdown } from 'antd';


declare interface BtnProps {
    type: string,
    className: string,
    // onBtnClick?: (id) => (void),
    totalLeadsNum: number,
    assignLeads?: Array<number>,// 选中的leads id 数组
    assignLeadsName?:Array<string>,
    // 以下为redux props
    permissionList?: Array<any>,
    downloadLeads?: (value) => (void),// 导出按钮点击事件
    onCallback?:any

}

@connect(
    () => ({}),
    {receiveLeads, recycleLeads}
)
class BtnGroup extends React.Component<BtnProps> {
    className = this.props.className || '';
    state = {
        showLeadsReturn: false,// 交还主管
        showLeadsAssign: false,// leads 分配给GB/GA
        reShowLeadsAssign: false,// leads重新分配给GB/GA
        showLeadsAssignCenter: false,// leads 转中心
        showLeadsRecycle: false,// leads加入回收站
        showLeadsReceive: false,// 领取leads
        showCustomerAssign: false,// 会员转GA
        reShowCustomerAssign: false,// 会员重转GA
        showLeadsApplyTask: false,  // 是否安排任务弹框开关
        showTask: false,            // 现实创建批量任务开关
        isCheckHasTask: false,         // 检测3天是否有lead
        role: 'GB',// 分配给gb
        showErrList: false,// 转中心失败弹框
        errList: [],// 转中心失败list
        currentErrList: [],// 当前页转中心失败list
        pageInfo: {
            pageSize: 10,
            pageNo: 1,
            totalSize: 0
        },

    };

    btnOptions: Array<any>;
    reBtnOptions: Array<any>;
    btnOptionsCustomer: Array<any>;
    reBtnOptionsCustomer: Array<any>;
    columns: Array<any>;

    constructor(props) {
        super(props);
        this.btnOptions = [
            {title: 'Leads转中心', id: '转中心', funcId: FUNC[`leads转中心`]},
            {title: '分配给GA', id: '转GA', funcId: FUNC[`分配给GA`]},
            {title: '分配给GB', id: '转GB', funcId: FUNC[`分配给GB`]},
        ];
        this.reBtnOptions = [
            {title: '分配给GA', id: '重转GA', funcId: FUNC[`分配给GA`]},
            {title: '分配给GB', id: '重转GB', funcId: FUNC[`分配给GB`]},
        ];

        this.btnOptionsCustomer = [
            {title: '分配给GA', id: '会员转GA', funcId: FUNC[`分配给GA`]},
            {title: '分配给GB', id: '会员转GB', funcId: FUNC[`分配给GB`]},
        ];
        this.reBtnOptionsCustomer = [
            {title: '分配给GA', id: '会员重转GA', funcId: FUNC[`分配给GA`]},
            {title: '分配给GB', id: '会员重转GB', funcId: FUNC[`分配给GB`]},
        ];
        this.columns = [
            {
                title: '联系人姓名',
                dataIndex: 'contactName',
                key: 'contactName',
            },
            {
                title: '手机号码',
                dataIndex: 'contactTel',
                key: 'contactTel',
            },
            {
                title: '原因',
                dataIndex: 'reason',
                key: 'reason',
            },
        ];
    }

    downloadBtn = (value) => {
        const role = User.role;
        const {totalLeadsNum} = this.props;
        return <span className='clear'>
                {
                    this.isExist(FUNC[`客户查询（新）`]) &&
                    <Link to={Routes.新客户中心.link} target='_blank'>
                        <button  className="gym-button-default gym-button-lg fr ">
                            查询与导出
                        </button>
                    </Link>
                }
                {
                    (CommonUtils.isInclude(role, ['BMS'])) &&
                    <button
                        className={`${totalLeadsNum > 0 ? 'gym-button-default-sm' : 'gym-button-greyb-sm'} fr`}
                        onClick={totalLeadsNum > 0 ? this.downloadLeads.bind(this, value) : null}
                        style={{marginRight: 45}}
                    >
                        导出
                    </button>
                }


            </span>;
    };
    /**
     * 导出leads
     * @param value:any index.tsx provider传入的值
     * @returns {any}
     */
    downloadLeads = (value) => {
        value.exportLeads();
    };

    componentDidMount() {
        queryTaskInfo({
            currentCenterId: User.currentCenterId,
            executorStaffId: User.userId
        }).then((res:any) => {
            if(res.customerNum > 0){
                const keys = res.customerList.map((item:any) => item.leadsId);
                const names = res.customerList.map((item:any) => item.customerName);
                this.setState({
                    isCheckHasTask: true,
                    showLeadsApplyTask:true,
                })
                this.props.onCallback(keys, names)
            }
        })
    }

    isExist(funcId) {
        if (funcId) {
            return User.permissionList.includes(funcId);
        } else {
            return true;
        }
    }

    handleReceiveOk = (value) => {
        receiveLeads({
            currentCenterId: User.currentCenterId,
            leadsList: this.props.assignLeads
        }).then(() => {
            Message.success('领取成功');
            this.setState({showLeadsApplyTask: true});
        });
        this.setState({showLeadsReceive: false});
    };
    /**
     * 确认安排首次联系时间
     */
    handleApplyTask = () => {
        this.setState({
            showTask: true,
            showLeadsApplyTask: false
        })
    };
    handleCancel = () => {
        this.setState({showLeadsReceive: false});
    };
    /**
     * 取消安排首次联系时间
     */
    handleApplyTackCancel = (value) => {
        this.setState({
            showLeadsApplyTask: false,
            isCheckHasTask: false,
        });
        value.callback();
    };
    /**
     * 取消批量任务弹层
     */
    handleCancelTaskForm = () => {
        this.setState({
            showTask:false,
            showLeadsApplyTask: true
        })
    };
    handleOkTaskForm = (value:any) => {
        this.setState({showTask: false}, () => {
            value.callback();
        })
    };
    handleClick(id) {
        if (!this.props.assignLeads.length) {
            Message.warning('请选择客户');
            return;
        }
        switch (id) {
            case 'return': {// 交还主管
                this.setState({showLeadsReturn: true});
                break;
            }
            case '转中心': {//
                this.setState({showLeadsAssignCenter: true});
                break;
            }
            case '转GA': {// leads 转ga
                this.setState({showLeadsAssign: true, role: 'GA'});
                break;
            }
            case '转GB': {// leads 转gb
                this.setState({showLeadsAssign: true, role: 'GB'});
                break;
            }
            case '重转GA': {// leads 重转ga
                this.setState({reShowLeadsAssign: true, role: 'GA'});
                break;
            }
            case '重转GB': {// leads 重转gb
                this.setState({reShowLeadsAssign: true, role: 'GB'});
                break;
            }
            case 'recycle': {// 加入回收站
                this.setState({showLeadsRecycle: true});
                break;
            }
            case 'receive': {// 领取
                this.setState({showLeadsReceive: true});
                break;
            }
            case '会员转GA': {
                this.setState({showCustomerAssign: true, role: 'GA'});
                break;
            }
            case '会员转GB': {
                this.setState({showCustomerAssign: true, role: 'GB'});
                break;
            }
            case '会员重转GA': {
                this.setState({reShowCustomerAssign: true, role: 'GA'});
                break;
            }
            case '会员重转GB': {
                this.setState({reShowCustomerAssign: true, role: 'GB'});
                break;
            }
            case 'call': {
                recordTelephoneMembers(this.props.assignLeads)
                window.open(Routes.语音拨打.path, 'call');
                break;
            }
            default:
                break;
        }
    }

    hideLeadsMask = (type) => {
        switch (type) {
            case 'return': {// 交还主管
                this.setState({showLeadsReturn: false});
                break;
            }
            case 'assign': {// 分配给GA/GB
                this.setState({showLeadsAssign: false});
                break;
            }
            case 'reassign': {// 重新分配给GA/GB
                this.setState({reShowLeadsAssign: false});
                break;
            }
            case 'center': {// 分配至中心
                this.setState({showLeadsAssignCenter: false});
                break;
            }
            case 'recycle': {// 加入回收站
                this.setState({showLeadsRecycle: false});
                break;
            }
            case 'assignCustomer': {
                this.setState({showCustomerAssign: false});
                break;
            }
            case 'reAssignCustomer': {
                this.setState({reShowCustomerAssign: false});
                break;
            }
            default:
                break;
        }

    };

    unAssign(value) {// 待分配按钮组
        return (
            <div className={this.className}>
                <Dropdown
                    overlay={
                        <Menu>
                            {
                                (this.btnOptions || []).map((item, index) =>
                                    User.permissionList.includes(item.funcId) && <Menu.Item key={`button_${index}`} onClick={() => this.handleClick(item.id)}>{item.title}</Menu.Item>
                                )
                            }
                        </Menu>
                    }
                    placement='topCenter'
                >
                    <button className='gym-button-white gym-button-lg'>首次分配</button>
                </Dropdown>
                {this.isExist(FUNC[`加入回收站`]) &&
                    <button
                        className='gym-button-sm gym-button-default ml15'
                        onClick={this.handleClick.bind(this, 'recycle')}
                    >
                        加入回收站
                    </button>
                }
                {this.downloadBtn(value)}
            </div>
        )

    }

    assign(value) {// 已分配
        let btn1, btn3;
        btn1 = (
            <Fragment>
                <Dropdown
                    overlay={
                        <Menu>
                            {
                                (this.reBtnOptions || []).map((item, index) =>
                                    User.permissionList.includes(item.funcId) && <Menu.Item key={`button_${index}`} onClick={() => this.handleClick(item.id)}>{item.title}</Menu.Item>
                                )
                            }
                        </Menu>
                    }
                    placement='topCenter'
                >
                    <button className='gym-button-white gym-button-lg mr15'>重新分配</button>
                </Dropdown>
            </Fragment>
        );

        btn3 = (
            this.isExist(FUNC[`加入回收站`]) &&
            (
                <button
                    className='gym-button-sm gym-button-default mr15'
                    onClick={this.handleClick.bind(this, 'recycle')}
                >
                    加入回收站
                </button>
            )
        );

        const btn2 = (
            <span>
                {this.isExist(FUNC[`领取`]) &&
                <button
                    className='gym-button-sm gym-button-default mr15'
                    onClick={this.handleClick.bind(this, 'receive')}
                >
                    领取
                </button>
                }
                {this.isExist(FUNC['交还主管']) &&
                <button
                    className='gym-button-sm gym-button-default'
                    onClick={this.handleClick.bind(this, 'return')}
                >
                    交还主管
                </button>
                }
            </span>
        );

        return (
            <div className={this.className}>
                {btn1}{btn3}{btn2}
                {this.downloadBtn(value)}
            </div>
        )
    }

    commonBtnGroup(value:any, isShowCallButton:boolean) {// 已领取,已联络,诺访，已到访
        const btn1 = (
            this.isExist(FUNC[`重新分配`]) && (
                <Fragment>
                    <Dropdown
                        overlay={
                            <Menu>
                                {
                                    (this.reBtnOptions || []).map((item, index) =>
                                        User.permissionList.includes(item.funcId) && <Menu.Item key={`button_${index}`} onClick={() => this.handleClick(item.id)}>{item.title}</Menu.Item>
                                    )
                                }
                            </Menu>
                        }
                        placement='topCenter'
                    >
                        <button className='gym-button-white gym-button-lg'>重新分配</button>
                    </Dropdown>
                </Fragment>
            )
        );

        const btn2 = (
            this.isExist(FUNC[`交还主管`]) &&
            (
                <button
                    className='gym-button-sm gym-button-default ml15'
                    onClick={this.handleClick.bind(this, 'return')}>
                    交还主管
                </button>
            )
        );
        const btn3 = (
            this.isExist(FUNC[`加入回收站`]) &&
            (
                <button
                    className="gym-button-sm gym-button-default ml15"
                    onClick={this.handleClick.bind(this, 'recycle')}
                >
                    加入回收站
                </button>
            )
        );
        // todo
        const btn4 = (
                <button
                    className="gym-button-sm gym-button-default mlr15"
                    onClick={this.handleClick.bind(this, 'call')}
                >
                    批量外呼
                </button>
        );
        return (
            <div className={this.className}>
                {btn1}{btn2}{btn3}{isShowCallButton && btn4}
                {this.downloadBtn(value)}
            </div>
        )
    }

    custBtnGroup(value, isShowCallButton:boolean) {// 新会员,老会员
        const btn1 = (this.isExist(FUNC[`分配给GA`]) && (
            <Fragment>
                <Dropdown
                    overlay={
                        <Menu>
                            {
                                (this.btnOptionsCustomer || []).map((item, index) =>
                                    User.permissionList.includes(item.funcId) &&  <Menu.Item key={`button_${index}`} onClick={() => this.handleClick(item.id)}>{item.title}</Menu.Item>
                                )
                            }
                        </Menu>
                    }
                    placement='topCenter'
                >
                    <button className='gym-button-white gym-button-lg'>首次分配</button>
                </Dropdown>
            </Fragment>

            )
        );
        const btn2 = (
            <Fragment>
                <Dropdown
                    overlay={
                        <Menu>
                            {
                                (this.reBtnOptionsCustomer || []).map((item, index) =>
                                    User.permissionList.includes(item.funcId) && <Menu.Item key={`button_${index}`} onClick={() => this.handleClick(item.id)}>{item.title}</Menu.Item>
                                )
                            }
                        </Menu>
                    }
                    placement='topCenter'
                >
                    <button className='gym-button-white gym-button-lg ml15'>重新分配</button>
                </Dropdown>
            </Fragment>

        );
        // todo
        const btn3 = (
                <button
                    className="gym-button-sm gym-button-default mlr15"
                    onClick={this.handleClick.bind(this, 'call')}
                >
                    批量外呼
                </button>
        );
        return (
            <div className={this.className}>
                {btn1}{btn2}{ isShowCallButton && btn3}
                {this.downloadBtn(value)}
            </div>
        )
    }

    payCustBtnGroup(value, isShowCallButton) {// 待续会员
        const btn1 = (
                <button
                    className="gym-button-sm gym-button-default mlr15"
                    onClick={this.handleClick.bind(this, 'call')}
                >
                    批量外呼
                </button>
        );
        return (
            <div className={this.className}>
                {isShowCallButton && btn1}
                {this.downloadBtn(value)}
            </div>
        )
    }

    hideErrModal = () => {
        this.setState({showErrList: false});
    };
    /**
     * 显示转中心失败list
     * @param list
     * @returns {any}
     */
    showCenterError = (list) => {
        const cErrlist = this.getCurrentErrList(list, 1, 10);
        this.setState({showErrList: true, errList: list, currentErrList: cErrlist}
        );
    };
    /**
     * leads转中心失败list分页事件
     * @param pageInfo
     * @returns {any}
     */

    handleErrChange = (pageInfo) => {
        const {errList} = this.state;
        const {pageNo, pageSize} = pageInfo;
        const cErrlist = this.getCurrentErrList(errList, pageNo, pageSize);
        this.setState({currentErrList: cErrlist, pageInfo: {pageNo, pageSize, totalSize: errList.length}})
    };
    /**
     * 获取当前页转中心失败list
     * @param errList
     * @param pageNo
     * @returns {any}
     */
    getCurrentErrList = (errList, pageNo, pageSize?) => {
        pageSize = pageSize || 10;
        this.setState({pageInfo: {pageNo: pageNo, pageSize: pageSize, totalSize: errList.length}});
        const numRange = [(pageNo - 1) * pageSize, pageNo * pageSize];
        return errList.filter((item, index) => {
            return (numRange[0] <= index && index < numRange[1])
        })
    };

    render() {
        const {type, totalLeadsNum, assignLeads, assignLeadsName} = this.props;
        const {
            showLeadsReturn, showLeadsAssign, reShowLeadsAssign,
            showLeadsAssignCenter, showLeadsRecycle, role, showCustomerAssign, reShowCustomerAssign, showErrList,
            currentErrList, showLeadsApplyTask, showTask, isCheckHasTask
        } = this.state;
        const {pageNo, pageSize, totalSize} = this.state.pageInfo;
        const isCD = User.role.includes("CD");
        const isGB = User.role.includes("GB") || User.role.includes("HGB") ;
        const isGA = User.role.includes("GA") || User.role.includes("HGA") ;
        const isShowCallButton = (isCD || isGB || isGA);
        let content;
        switch (type) {
            case '待分配':
                content = this.unAssign.bind(this);
                break;
            case '已分配':
                content = this.assign.bind(this);
                break;
            case '已领取':
            case '已联络':
            case '诺访':
            case '已到访':
                content = this.commonBtnGroup.bind(this);
                break;
            case '新会员-老会员':
                content = this.custBtnGroup.bind(this);
                break;
            case '待续会员':
                content = this.payCustBtnGroup.bind(this);
                break;
            default:
                content = this.commonBtnGroup.bind(this);
                break;
        }
        return (
            <Consumer>
                {(value) => (
                    <div>
                        {content(value, isShowCallButton)}
                        <ListModal
                            visible={showLeadsReturn}
                            width={650}
                            footer={null}
                            destroyOnClose={true}
                            closable={true}
                            maskClosable={true}
                            onCancel={this.hideLeadsMask.bind(this, 'return')}
                        >
                            <LeadsReturn
                                onHideClick={this.hideLeadsMask.bind(this, 'return')}
                                leadsArr={assignLeads}
                                totalLeadsNum={totalLeadsNum}
                            />
                        </ListModal>
                        <ListModal
                            visible={showLeadsAssign}
                            width={650}
                            footer={null}
                            destroyOnClose={true}
                            closable={true}
                            maskClosable={true}
                            onCancel={this.hideLeadsMask.bind(this, 'assign')}
                        >
                            <AssignLeads
                                onHideClick={this.hideLeadsMask.bind(this, 'assign')}
                                leadsArr={assignLeads}
                                totalLeadsNum={totalLeadsNum}
                                role={role}
                            />
                        </ListModal>
                        <ListModal
                            visible={reShowLeadsAssign}
                            width={650}
                            footer={null}
                            destroyOnClose={true}
                            closable={true}
                            maskClosable={true}
                            onCancel={this.hideLeadsMask.bind(this, 'reassign')}
                        >
                            <AssignLeads
                                onHideClick={this.hideLeadsMask.bind(this, 'reassign')}
                                leadsArr={assignLeads}
                                reAssign={true}
                                totalLeadsNum={totalLeadsNum}
                                role={role}
                            />
                        </ListModal>

                        <ListModal
                            visible={showLeadsAssignCenter}
                            width={500}
                            footer={null}
                            destroyOnClose={true}
                            closable={true}
                            maskClosable={true}
                            onCancel={this.hideLeadsMask.bind(this, 'center')}
                        >
                            <LeadsToCenter
                                onHideClick={this.hideLeadsMask.bind(this, 'center')}
                                handleErr={this.showCenterError}
                                leadsArr={assignLeads}
                                totalLeadsNum={totalLeadsNum}
                            />
                        </ListModal>
                        <ListModal
                            visible={showLeadsRecycle}
                            width={650}
                            destroyOnClose={true}
                            closable={true}
                            maskClosable={true}
                            onCancel={this.hideLeadsMask.bind(this, 'recycle')}
                            footer={null}
                        >
                            <LeadsRecycle
                                onHideClick={this.hideLeadsMask.bind(this, 'recycle')}
                                leadsArr={assignLeads}
                                totalLeadsNum={totalLeadsNum}
                            />
                        </ListModal>
                        <ListModal
                            visible={showCustomerAssign}
                            width={650}
                            footer={null}
                            destroyOnClose={true}
                            closable={true}
                            maskClosable={true}
                            onCancel={this.hideLeadsMask.bind(this, 'assignCustomer')}
                        >
                            <AssignCustomers
                                onHideClick={this.hideLeadsMask.bind(this, 'assignCustomer')}
                                role={role}
                                customerArr={assignLeads}
                                totalCustomerNum={totalLeadsNum}
                            />
                        </ListModal>
                        <ListModal
                            visible={reShowCustomerAssign}
                            footer={null}
                            width={650}
                            destroyOnClose={true}
                            closable={true}
                            maskClosable={true}
                            onCancel={this.hideLeadsMask.bind(this, 'reAssignCustomer')}
                        >
                            <AssignCustomers
                                onHideClick={this.hideLeadsMask.bind(this, 'reAssignCustomer')}
                                reAssign={true}
                                role={role}
                                customerArr={assignLeads}
                                totalCustomerNum={totalLeadsNum}
                            />
                        </ListModal>

                        {<Modal
                            visible={this.state.showLeadsReceive}
                            handleOk={this.handleReceiveOk.bind(this, value)}
                            handleCancel={this.handleCancel}
                            contentTitle={`本次共领取${assignLeads.length}个leads,共${totalLeadsNum}个`}
                            contentText={`确定领取吗？`}
                        />}
                        <Modal
                            visible={showLeadsApplyTask}
                            handleOk={this.handleApplyTask.bind(this)}
                            handleCancel={this.handleApplyTackCancel.bind(this, value)}
                            contentTitle={`${isCheckHasTask ? `检测到近3天有${assignLeads.length}个leads待跟进` : `本次共领取${assignLeads.length}个leads`}`}
                            contentText={"现在就安排首次联系时间吗？"}
                            footer={
                                <div>
                                    <button className="gym-button-xs gym-button-default" onClick={this.handleApplyTask.bind(this)}>安排</button>
                                    <button className="gym-button-xs gym-button-white" onClick={this.handleApplyTackCancel.bind(this, value)}>不安排</button>
                                </div>
                            }
                        />
                        {
                            showTask &&
                            <MultiTaskForm
                                handleCancel={this.handleCancelTaskForm.bind(this)}
                                handleOk={this.handleOkTaskForm.bind(this, value)}
                                leads={assignLeads}
                                leadsName={assignLeadsName}
                            />
                        }
                        <ListModal
                            visible={showErrList}
                            footer={null}
                            width={650}
                            destroyOnClose={true}
                            closable={true}
                            maskClosable={true}
                            onCancel={this.hideErrModal}
                        >
                            <div>
                                <PageTitle title='Leads分配至中心'/>
                                <p className='gym-leads-assign-center-notice mb15'>
                                    检测到以下leads无法转入对应中心
                                </p>
                                <TablePagination
                                    rowKey={`leadsId`}
                                    handleChangePage={this.handleErrChange}
                                    pageNo={pageNo}
                                    pageSize={pageSize}
                                    totalSize={totalSize}
                                    columns={this.columns}
                                    dataSource={currentErrList}
                                />
                            </div>
                        </ListModal>

                    </div>
                )}
            </Consumer>
        );
    }
}

export {BtnGroup}
