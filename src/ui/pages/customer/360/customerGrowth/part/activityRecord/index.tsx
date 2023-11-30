/**
 * Desc: 活动记录
 * User: Vicky.Yu
 * Date: 2018/12/10
 * Time: 上午11:50
 */
import React from "react";
import {message} from 'antd';
import {TablePagination} from "@/ui/component/tablePagination";
import {DetailModal} from "../../../../component/consumptionDetails"
import SignUp from "../../../../component/signUp";
import ChooseBaby from "./chooseBaby";
import {PageTitle} from "@/ui/component/pageTitle";
import EnrollStep from "../../../../../../component/enrollStep"
import ChoosePackage from "../../../../../../component/coursePackage";
import {getActivityList, getActivityDetails} from "@redux-actions/activity/activityDataList";
import {getActivityTypeDef} from "@redux-actions/activity/activityDetail";
import {resetCheckinData} from "@/saga/actions/activity/activityDetail";
import {Modal as AntModal} from 'antd';
import {connect} from "@/common/decorator/connect";
import {form} from "@/common/decorator/form";
import {User} from "@/common/beans/user";
import EnrollDetail from "../../../../../../component/enrollDetail";
import moment from 'moment';
import {ActivityApi} from "@/api/activityApi";
import {Fetch} from "@/service/fetch";
import {getCustomerBasicInfo} from "@redux-actions/client360";
import {selectClient360} from "@/saga/selectors/customer/client360";

interface PropsType {
    leadsId: string,
    type: string,

    [propName: string]: any,
}

const mapStateToProps = state => {
    const {
        payMode,    // 付费类型
        id,         // 活动id
        startDateTime,  // 开始时间
        endDateTime,    // 结束时间
        selectedCourse, // 选择的课程
        types,  // 各种类型值
    } = state.activityDetail;
    const {
        activityList,
        selectedActivity,   // 选择的活动
        selectedBaby,   // 客户360报名时选择的baby
    } = state.activityList;
    const {
        activityPayModeObj,           // 付费方式枚举
        teachingActivityType,         // 教学活动类型
        approvalStatusTeach,          // 审批状态
        teachActivityAttendanceStatusObj,         // 参加状态枚举
        teachingActivityTypeEnum,     // 教学活动类型枚举
        activityPayModeEnum,          // 教学活动付费类型（用于取值）
    } = types;

    return {
        id,
        payMode,
        startDateTime,
        endDateTime,
        activityList,
        teachingActivityType,
        approvalStatusTeach,
        selectedBaby,
        selectedCourse,
        selectedActivity,
        activityPayModeObj,             // 付费方式枚举
        teachActivityAttendanceStatusObj,           // 参加状态枚举
        teachingActivityTypeEnum,       // 教学活动类型枚举
        activityPayModeEnum,
        leadsPhase: selectClient360(state)
    }
};

@form()
@connect(mapStateToProps, {
    getActivityList,
    getActivityDetails,
    getActivityTypeDef,
    resetCheckinData,
    getCustomerBasicInfo
})
class Activity extends React.Component<PropsType, any> {
    constructor(props) {
        super(props);
        this.state = {
            currentCenterId: User.currentCenterId,
            pageNo: 1,
            pageSize: 10,
            type: "", // 活动类型
            theme: "", // 活动名称
            startDate: "", // 活动日期
            showAddEvent: false, // 报名弹框
            showDetailsModal: false, // 活动详情弹框
            id: '', // 活动id
            phase: this.props.phase // leads状态
        };
        this.handleCompleteEnroll = this.handleCompleteEnroll.bind(this);
    }

    handleCancel = () => {
        this.setState({
            showAddEvent: false,
            showDetailsModal: false
        });
        this.props.resetCheckinData();
    };
    /**
     * 报名step弹框
     * 处于leads阶段无法报名
     */
    handleAddEvent = () => {
        if (this.props.leadsPhase.phaseValue === '新会员' ||
            this.props.leadsPhase.phaseValue === '老会员' ||
            this.props.leadsPhase.phaseValue === '待续会员') {
            this.setState({showAddEvent: true});
        } else {
            message.error('您不是会员，无法报名活动')
        }
    };
    /**
     * 活动详情弹框
     */
    showDetails = (id: any) => {
        this.setState({
            showDetailsModal: true,
            id: id
        })
    };

    handleSearch = (body: any) => {
        const {pageNo, pageSize, currentCenterId} = this.state;
        const params = {
            currentCenterId,
            pageNo,
            pageSize,
            leadsId: this.props.leadsId,
        };
        this.props.getActivityList(params);
    };

    componentDidMount() {
        this.props.getActivityTypeDef({currentCenterId:User.currentCenterId});
        this.handleSearch({});
        this.props.getCustomerBasicInfo({
            currentCenterId: User.currentCenterId,
            leadsId: this.props.leadsId,
        })
    };

    /**
     * 分页
     * @param pageInfo
     */
    handleChangePage = (pageInfo: any) => {
        this.setState(pageInfo, () => {
            this.handleSearch({});
        });
    };

    /**
     * 完成报名
     */
    handleCompleteEnroll() {
        const {
            selectedBaby,       // 选中的宝宝
            selectedCourse,     // 选中的课程
            payMode,            // 付费方式
            id,                 // 活动id
            startDateTime,          // 开始时间
            endDateTime,            // 结束时间
            applicationConsumption,     // 活动扣课数
            selectedActivity,   // 选择的活动
            activityPayModeEnum,    // 教学活动付费类型（用于取值）
        } = this.props;
        if (selectedCourse === undefined){
            message.error('西格玛课包不可报名活动');
            return;
        }
        if (selectedActivity.length === 0) {
            // 如果没有选活动，
            message.error('请先选择一项活动');
            return;
        }

        const {remainingCourseNum} = selectedCourse;
        if ((payMode === activityPayModeEnum.仅扣课 || payMode === activityPayModeEnum.扣课且付费 || payMode === activityPayModeEnum.扣课或付费) && (remainingCourseNum < applicationConsumption)) {
            // 付费类型包含扣课并且课时数不足，不能报名
            message.error('课时数不足,不能报名该活动！');
            return;
        }

        if (Object.keys(selectedBaby).length > 0) {
            // 存在选中的宝宝，进行报名
            const {contractId} = selectedCourse;
            const {babyId, leadsId} = selectedBaby;
            const {currentCenterId} = this.state;
            const params = {
                url: ActivityApi.报名,
                data: {
                    currentCenterId,
                    activityId: id,
                    payMode,
                    contractId,
                    babyId,
                    leadsId,
                    startTime: startDateTime,
                    endTime: endDateTime,
                    applicationConsumption
                }
            };
            Fetch.post(params).then(res => {
                // 报名成功后关闭弹框，更新数据
                this.handleCancel();
                this.handleSearch({});
            });
        } else {
            // 没有选中宝宝
            message.error('请先选择一位宝宝');
        }
    }

    render() {
        const {leadsId, activityList, selectedBaby, teachingActivityType} = this.props;
        const {showAddEvent, showDetailsModal, id, pageSize, pageNo} = this.state;
        const activityColumns = [
            {
                title: '宝宝姓名',
                dataIndex: 'babyName',
                key: 'babyName',
            }, {
                title: '活动类型',
                dataIndex: 'activityType',
                render: (text) => {
                    const res = teachingActivityType.filter((item: any) => item.code === text);
                    return res.length > 0 ? res[0].codeValue : '-';
                }
            }, {
                title: '活动名称',
                dataIndex: 'activityTheme',
                key: 'activityTheme'
            }, {
                title: '活动日期',
                dataIndex: 'activityStartTime',
                key: 'activityStartTime',
                render: (text, record) => (moment(text).format('YYYY-MM-DD (dddd) HH:mm'))

            }, {
                title: '消耗课时',
                dataIndex: 'applicationConsumption',
                key: 'applicationConsumption',
            }, {
                title: '消耗费用',
                dataIndex: 'applicationFee',
                key: 'applicationFee',
                render:(text)=>(!!text? text.toFixed(2)  : 0.00)
            },{
                title: '地点',
                dataIndex: 'activityField',
                key: 'activityField',
            },
            {
                title: '付费方式',
                dataIndex: 'payMode',
                key: 'payMode',
                render: (text) => {
                    return (this.props.activityPayModeObj || {})[text]
                }
            }, {
                title: '参加状态',
                dataIndex: 'attendanceStatus',
                render: (text) => {
                    return (this.props.teachActivityAttendanceStatusObj || {})[text];
                }
            }, {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                render: (text, record) => {
                    return (
                        <button
                            className='gym-button-xs gym-button-default'
                            onClick={this.showDetails.bind(this, record.id)}
                        >
                            查看
                        </button>
                    )
                }
            }
        ];
        const steps = [
            {
                title: '选择宝宝',
                content: <ChooseBaby leadsId={leadsId}/>,
            },
            {
                title: '活动报名',
                content: <SignUp leadsId={leadsId}/>,
            },
            {
                title: '选择课时包',
                content: <ChoosePackage selectedBaby={selectedBaby}/>,
            },
            {
                title: '会员活动详情',
                content: <EnrollDetail selectedBaby={selectedBaby}/>
            }
        ];
        return (
            <div>
                <p>
                    <button
                        onClick={this.handleAddEvent}
                        className='gym-button-default gym-button-xs mt15 mb20 ml30'
                    >
                        报名
                    </button>
                </p>
                <TablePagination
                    columns={activityColumns}
                    dataSource={activityList.list}
                    rowKey={`id`}
                    totalSize={activityList.totalSize}
                    pageSize={pageSize}
                    pageNo={pageNo}
                    handleChangePage={this.handleChangePage}
                />
                {
                    showAddEvent
                        ? (
                            <div className="stepList">
                                <AntModal
                                    title={<PageTitle className="content-modal-title" title="报名"/>}
                                    centered={true}
                                    visible={true}
                                    maskClosable={false}
                                    onCancel={this.handleCancel}
                                    wrapClassName="content-modal-wrap"
                                    footer={null}
                                    width={1030}
                                    style={{top: 20}}
                                >
                                    <EnrollStep
                                        steps={steps}
                                        handleComplete={this.handleCompleteEnroll}
                                    />
                                </AntModal>
                            </div>
                        ) : null
                }
                {/* 查看活动详情弹框 */}
                {
                    showDetailsModal
                        ? (
                            <AntModal
                                onCancel={this.handleCancel}
                                maskClosable={false}
                                visible={showDetailsModal}
                                footer={null}
                                width={500}
                            >
                                <DetailModal id={id}/>
                            </AntModal>
                        ) : null
                }
            </div>
        )
    }
}

export {Activity}
