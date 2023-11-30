import React, {Component} from 'react';
import moment from 'moment';
import {Row, Col, message, Popover,Tooltip} from 'antd';
import {PageTitle} from "../../component/client360WrapperTitle";
import {appearanceType} from "@/ui/pages/customer/enum/assign";
import {FUNC} from "@/ui/pages/setting/enum/functions";
import {User} from "@/common/beans/user";
import {ListModal} from "@/ui/component/listModal";
import {AssignLeads} from "@/ui/pages/customer/assign/part/assignLeads";
import {handleAssignGAGB} from "@redux-actions/client360";
import {toUnassign} from "@redux-actions/customer/historyList";
import {LeadsToCenter} from "@/ui/pages/customer/assign/part/assignLeadsToCenter";
import {TablePagination} from "@/ui/component/tablePagination";
import {PageTitle as PageCaption} from "@/ui/component/pageTitle";
import {Provider} from "@/common/decorator/context";
import history from '../../../../../router/history';
import {Routes} from "@/router/enum/routes";
import {CommonUtils} from "@/common/utils/commonUtils";
import {Message} from "@/ui/component/message/message";
import {Confirm} from "@/ui/component/customerCreateModal";
import {CustomerRoutes} from "@/router/enum/customerRoutes";
import {RepeatIcon} from "@/ui/pages/customer/client360/part/repeatIcon";

const appearanceTypeObj = {};
appearanceType.forEach(item => appearanceTypeObj[item.value] = item.label);

class EssentialInfo extends Component<any, any> {
    static getDerivedStateFromProps(nextProps, prevState) {
        const {ChannelTypeList} = nextProps;
        if (JSON.stringify(ChannelTypeList) !== prevState.ChannelTypeList) {
            const channelTypeObj = {};
            ChannelTypeList.forEach(item => {
                const {code, codeValue} = item;
                channelTypeObj[code] = codeValue;
            });

            return {
                ChannelTypeList,
                channelTypeObj,
            }
        }

        return null;
    }

    constructor(props) {
        super(props);
        this.state = {
            appearanceTypeObj,       // 出现方式枚举值
            showAssignModal: false,  // 控制分配GA或GB的弹框显示和隐藏
            showAssignCenterModal: false,   // 控制leads转中心弹框的显示和隐藏
            role: '',               // 分配给gb或者ga
            showErrList: false,     // 转中心失败弹框
            errList: [],            // 转中心失败list
            currentErrList: [],     // 当前页转中心失败list
            pageInfo: {
                pageSize: 10,
                pageNo: 1,
                totalSize: 0
            },
            columns: [
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
            ]
        };
    }

    render() {
        const {basicInfo, leadsInfo, packageDetail, handedRecycle, lastLeadsInfo} = this.props;
        const {
            channelTypeObj, appearanceTypeObj, showAssignModal, role, showAssignCenterModal,
            showErrList, currentErrList, pageInfo, columns,
        } = this.state;
        const {inquireDate = '', appearanceType = '', channelType = '', channelComment = '', leadsId} = leadsInfo;
        const {keyInfo = {}, phase} = basicInfo;
        const {
            gb, ga, contractData, costCourseNum, attendanceNum,
        } = keyInfo;
        const {pageNo, pageSize, totalSize} = pageInfo;
        return (
            <div className="essentialInfoWrapper shadow">
                <Row>
                    <Col span={12}>
                        <PageTitle title={
                            basicInfo.isCrossCenter
                                ? <RepeatIcon leadsId={leadsInfo.leadsId}/>
                                : 'Leads信息'} hn="h4"
                        />
                        <div className="info-content">
                            <div className="rowInfo">
                                <span className="key">获取日期：</span>
                                <span>{inquireDate && moment(inquireDate).format("YYYY-MM-DD")}</span>
                            </div>
                            <div className="rowInfo">
                                <span className="key">出现方式：</span>
                                <span>{appearanceType && appearanceTypeObj[appearanceType]}</span>
                            </div>
                            <div className="rowInfo">
                                <span className="key">渠道来源：</span>
                                <span>
                                    {channelType && channelTypeObj[channelType]}
                                </span>
                            </div>
                            <div className="rowInfo">
                                <span className="key">渠道备注：</span>
                                <Tooltip
                                    title={channelComment}
                                    mouseEnterDelay={0}
                                    mouseLeaveDelay={0}
                                >
                                    <span>{channelComment && (channelComment.length > 30 ? `${channelComment.slice(0, 30)}...` : channelComment)}</span>
                                </Tooltip>
                            </div>
                            {/*如果有最新获取日期，则显示*/}
                            {
                                lastLeadsInfo.lastInquireDate &&
                                <Popover
                                    title='最近导入渠道信息：'
                                    content={(
                                        <div className='p10'>
                                            <div>
                                                <span>最近获取日期：</span>
                                                <span>{moment(lastLeadsInfo.lastInquireDate).format("YYYY-MM-DD")}</span>
                                            </div>
                                            <div>
                                                <span>最近出现方式：</span>
                                                <span>{lastLeadsInfo.appearanceTypeValue}</span>
                                            </div>
                                            <div>
                                                <span>最近渠道来源：</span>
                                                <span>{lastLeadsInfo.channelTypeValue}</span>
                                            </div>
                                            <div>
                                                <span>最近渠道备注：</span>
                                                <span>{lastLeadsInfo.channelComment}</span>
                                            </div>
                                        </div>
                                    )}
                                    placement="right"
                                >
                                    <span className='cDefault'>查看最近导入渠道信息</span>
                                </Popover>
                            }
                            {
                                // phrase === 1是待分配阶段
                                (this.isExist(`${FUNC[`leads转中心`]}`) && phase === '1') ? (
                                    <div className="rowInfo btnWrap">
                                        <button
                                            className="gym-button-sm gym-button-default"
                                            onClick={() => this.handleClick('leads转中心')}
                                        >
                                            leads转中心
                                        </button>
                                    </div>
                                ) : null
                            }
                            {
                                // handedRecycle === true是手动回收站阶段
                                (this.isExist(`${FUNC[`转移至待分配`]}`) && handedRecycle) ? (
                                    <div className="rowInfo btnWrap">
                                        <button
                                            className="gym-button-sm gym-button-default"
                                            onClick={() => this.handleClick('转移至待分配')}
                                        >
                                            转移至待分配
                                        </button>
                                    </div>
                                ) : null
                            }
                        </div>
                    </Col>
                    <Col span={12}>
                        <PageTitle title="关键信息" hn="h4"/>
                        <div className="info-content">
                            <div className="rowInfo">
                                <span className="key">GB：</span>
                                <span>{gb}</span>
                                {
                                    // phase !== 0排除回收站阶段
                                    (this.isExist(`${FUNC[`分配给GB`]}`) && phase !== '0') ? (
                                        <a
                                            href={void (0)}
                                            className="btn"
                                            onClick={() => this.handleClick('分配GB')}
                                        >
                                            分配
                                        </a>
                                    ) : null
                                }
                            </div>
                            <div className="rowInfo">
                                <span className="key">GA：</span>
                                <span>{ga}</span>
                                {
                                    // phase !== 0排除回收站阶段 phase！==10排除历史会员阶段
                                    (this.isExist(`${FUNC[`分配给GA`]}`) && phase !== '0' && phase !== '10') ? (
                                        <a
                                            href={void (0)}
                                            className="btn"
                                            onClick={() => this.handleClick('分配GA')}
                                        >
                                            分配
                                        </a>
                                    ) : null
                                }
                            </div>
                            <div className="rowInfo">
                                <span className="key">剩余课时：</span>
                                <a href={void (0)}>
                                    <Tooltip
                                        title={`剩余课时: (${packageDetail})`}
                                        mouseEnterDelay={0}
                                        mouseLeaveDelay={0}
                                    >
                                        <span>{packageDetail}</span>
                                    </Tooltip>
                                </a>
                                {
                                    // 有合同的用户点击跳转至客户获取的合同信息页签下
                                    (parseInt(phase) > 6) ? (
                                        <a
                                            href={`${CustomerRoutes.客户获取.link}/${CommonUtils.stringify({
                                                leadsId,
                                                id: '2'
                                            })}`}
                                            className="btn"
                                            target="_blank"
                                        >
                                            查看详情
                                        </a>
                                    ) : null
                                }
                            </div>
                            <div className="rowInfo">
                                <span className="key">合同到期：</span>
                                <span className="highlight">
                                    {
                                        contractData ? (moment(contractData).format('YYYY-MM-DD')) : ''
                                    }
                                </span>
                            </div>
                            <div className="rowInfo">
                                <span className="key">近6个月平均周耗课：</span>
                                <span>{costCourseNum}</span>
                            </div>
                            <div className="rowInfo">
                                <span className="key">近4周出席：</span>
                                <span>{attendanceNum}</span>
                            </div>
                        </div>
                    </Col>
                </Row>
                <ListModal
                    visible={showAssignModal}
                    footer={null}
                    width={650}
                    destroyOnClose={true}
                    closable={true}
                    maskClosable={true}
                    onCancel={this.hideAssignModal}
                >
                    <AssignLeads
                        onHideClick={this.hideAssignModal}
                        role={role}
                        leadsArr={[leadsId]}
                        totalLeadsNum={1}
                        handleAssign={this.handleAssign}
                    />
                </ListModal>
                <ListModal
                    visible={showAssignCenterModal}
                    width={500}
                    footer={null}
                    destroyOnClose={true}
                    closable={true}
                    maskClosable={true}
                    onCancel={this.hideAssignModal}
                >
                    <Provider value={{callback: this.toCustomerCenter}}>
                        <LeadsToCenter
                            onHideClick={this.hideAssignModal}
                            handleErr={this.showCenterError}
                            leadsArr={[leadsId]}
                            totalLeadsNum={1}
                        />
                    </Provider>
                </ListModal>
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
                        <PageCaption title={`Leads分配至中心`}/>
                        <p className='gym-leads-assign-center-notice mb15'>
                            检测到以下leads无法转入对应中心
                        </p>
                        <TablePagination
                            rowKey={`leadsId`}
                            handleChangePage={this.handleErrChange}
                            pageNo={pageNo}
                            pageSize={pageSize}
                            totalSize={totalSize}
                            columns={columns}
                            dataSource={currentErrList}
                        />
                    </div>
                </ListModal>
            </div>
        )
    }

    /*判断权限*/
    isExist = (funcId) => {
        const permissionList = User.permissionList;
        return permissionList.includes(funcId)
    };

    /*打开分配GAGB或leads转中心的弹框*/
    handleClick = (type) => {
        switch (type) {
            case '分配GA': {
                this.setState({showAssignModal: true, role: 'GA'});
                break;
            }
            case '分配GB': {
                this.setState({showAssignModal: true, role: 'GB'});
                break;
            }
            case 'leads转中心': {
                this.setState({showAssignCenterModal: true});
                break;
            }
            case '转移至待分配': {
                const _this=this;
                Confirm({
                    content:<div><p className='size18 c333 mb10'>确定要手动激活？</p>激活后的leads会回到"<span className='cDefault'>待分配</span>"</div>,
                    okText:'分配',
                    cancelText:'取消',
                    onOk(){
                        toUnassign({
                            currentCenterId: User.currentCenterId,
                            leadsIdList: [_this.props.leadsInfo.leadsId],
                        }).then(() => {
                            Message.success('转移至待分配成功');
                            // 分配成功后重新刷新一次页面
                            setTimeout(
                                function () {
                                    window.location.reload();
                                },
                                2000
                            );
                        });
                    }
                });

                break;
            }
            default:
                break;
        }
    };

    /*隐藏分配GAGB或leads转中心的弹框*/
    hideAssignModal = () => {
        this.setState({
            showAssignModal: false,
            showAssignCenterModal: false,
        })
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

    /*隐藏转中心失败list弹框*/
    hideErrModal = () => {
        this.setState({showErrList: false});
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

    /*分配GAGB*/
    handleAssign = (param) => {
        handleAssignGAGB(param).then(res => {
            message.success('分配leads成功');
            this.hideAssignModal();
        }).catch(err => {
            message.error('分配leads失败');
            this.hideAssignModal();
        })
    };

    /*分配完leads应当返回客户中心页面待分配阶段*/
    toCustomerCenter = (arg:boolean) => {
        arg && history.push(`${Routes.分配客户.link}/${CommonUtils.stringify({phaseId: '1'})}`)
    }
}

export {EssentialInfo}
