/**
 * desc: 活动签到
 * User: Lyon.li@gymboglobal.com
 * Date: 2018/12/7
 * Time: 下午1:38
 */
import React, {Component, Fragment} from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {Modal, message} from "antd";
import {TablePagination} from "@/ui/component/tablePagination";
import {PageTitle} from "@/ui/component/pageTitle";
import CheckinBtnGroup from './part/checkinBtnGroup';
import ChooseBaby from './part/chooseBaby';
import ChoosePackage from "../../../component/coursePackage";
import EnrollDetail from "../../../component/enrollDetail";
import EnrollStep from "../../../component/enrollStep";
import {setSelectedBabyId, resetActivityData, resetCheckinData} from "@/saga/actions/activity/activityDetail";
import {connect} from "react-redux";
import {CommonUtils} from "@/common/utils/commonUtils";
import {User} from "@/common/beans/user";
import {
    getActivityDetail,
    getActivityTypeDef,
    getSignList,
    completeEnroll
} from "@redux-actions/activity/activityDetail";
import './style/index.scss';

const enum signBayList {
    '不能签到' = 1,     // 合同不正常和已签到的两种状态不能签到
    '能签到' = 0,       // 可以正常签到的状态
}

class ActivityCheck extends Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            breadCrumbRoutes: [
                {
                    name: '活动'
                }, {
                    name: '活动管理'
                }, {
                    name: '签到'
                }
            ],
            columns: [
                {
                    title: '宝宝姓名',
                    dataIndex: 'babyName'
                },
                {
                    title: '联系人',
                    dataIndex: 'contactName'
                },
                {
                    title: '联系电话',
                    dataIndex: 'contactTelphone'
                },
                {
                    title: 'GB',
                    dataIndex: 'gbFullName'
                },
                {
                    title: '扣费方式',
                    dataIndex: 'payMode',
                    render: (text) => {
                        return (this.props.activityPayModeObj || {})[text];
                    }
                },
                {
                    title: '费用',
                    dataIndex: 'applicationFee'
                },
                {
                    title: '状态',
                    dataIndex: 'attendanceStatus',
                    render: (text) => {
                        return (this.props.teachActivityAttendanceStatusObj || {})[text];
                    }
                },
            ],
            visible: false,     // 控制宝宝选择弹框
            activityId: '',      // 活动id
            pageNo: 1,          // 当前页码
            pageSize: 10,       // 请求条数
            totalSize: 0,       // 总记录数
            currentCenterId: User.currentCenterId
        };
        this.openBabyModal = this.openBabyModal.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleChangePage = this.handleChangePage.bind(this);
        this.getSignList = this.getSignList.bind(this);
        this.handleCheckChange = this.handleCheckChange.bind(this);
        this.handleCompleteEnroll = this.handleCompleteEnroll.bind(this);
    }

    render() {
        const {breadCrumbRoutes, columns, visible, pageNo, pageSize, totalSize, activityId} = this.state;
        const {selectedBabyId, signList, selectedBaby} = this.props;
        const steps = [
            {
                title: '选择宝宝',
                content: <ChooseBaby/>,
            },
            {
                title: '选择课时包',
                content: <ChoosePackage selectedBaby={selectedBaby}/>,
            },
            {
                title: '完成',
                content: <EnrollDetail selectedBaby={selectedBaby}/>,
            }
        ];
        return (
            <Fragment>
                <BreadCrumb routes={breadCrumbRoutes}/>
                <div className='page-wrap'>
                    <CheckinBtnGroup
                        getSignList={this.getSignList}
                        openBabyModal={this.openBabyModal}
                        setSelectedBabyId={this.props.setSelectedBabyId}
                        activityId={activityId}
                    />
                    <TablePagination
                        columns={columns}
                        rowKey={item => item.attendanceId}
                        dataSource={signList}
                        rowSelection={{
                            selectedRowKeys: selectedBabyId.map(item => item.attendanceId),
                            getCheckboxProps: item => ({
                                disabled: item.isDisabled === signBayList.不能签到
                            }),
                            onChange: this.handleCheckChange
                        }}
                        totalSize={totalSize}
                        pageSize={pageSize}
                        handleChangePage={this.handleChangePage}
                        pageNo={pageNo}
                    />
                </div>
                {
                    visible ? (
                        <Modal
                            title={<PageTitle className="content-modal-title" title="报名"/>}
                            visible={visible}
                            width={1030}
                            style={{top: 20}}
                            footer={null}
                            wrapClassName="content-modal-wrap"
                            onCancel={this.handleCancel}
                        >
                            <EnrollStep
                                handleComplete={this.handleCompleteEnroll}
                                steps={steps}
                            />
                        </Modal>
                    ) : null
                }
            </Fragment>
        )
    }

    componentDidMount() {
        // 页面加载时判断url是都带有id
        const {hasParams, parse} = CommonUtils;
        const props = this.props;
        const {currentCenterId} = this.state;
        if (hasParams(props)) {
            // id值存在，说明是处于编辑页面
            const id = parse(props).id;
            this.setState(
                {
                    activityId: id
                },
                () => {
                    // 查询签到列表
                    this.getSignList();

                    // 查询类型数据
                    props.getActivityType({ currentCenterId: User.currentCenterId});

                    // 查询活动详情数据
                    props.getActivityDetail({
                        id,
                        currentCenterId
                    })
                });
        }
    }

    componentWillUnmount() {
        // 离开页面前，重置所有数据
        this.props.resetActivityData();
    }

    /*报名时显示弹框*/
    openBabyModal() {
        this.setState({
            visible: true
        })
    }

    /*处理分页查询*/
    handleChangePage({pageNo, pageSize}) {
        this.setState(
            {
                pageNo,
                pageSize
            },
            () => {
                this.getSignList();
            });
    };

    /*关闭报名弹框*/
    handleCancel() {
        this.setState({
            visible: false
        });
        // 重置报名的数据
        this.props.resetCheckinData();
    }

    /*表格选取行*/
    handleCheckChange(selectedRowKeys: string[], selectedRows: any[]) {
        // 选择宝宝时，把数据设置到redux
        this.props.setSelectedBabyId(selectedRows);
    };

    /*获取签到列表*/
    getSignList() {
        const {currentCenterId} = this.state;
        const params = {
            data: {
                activityId: this.state.activityId,
                currentCenterId,
                pageNo: this.state.pageNo,
                pageSize: this.state.pageSize,
            }, cb: (res) => {
                const {pageNo, pageSize, totalSize} = res;
                this.setState({
                    pageNo,
                    pageSize,
                    totalSize
                })
            }
        };
        this.props.getSignList(params);
    }

    /*报名*/
    handleCompleteEnroll() {
        const {
            selectedBaby,       // 选中的宝宝
            selectedCourse,     // 选中的课程
            payMode,            // 付费方式
            id,                 // 活动id
            startDateTime,          // 开始时间
            endDateTime,            // 结束时间
            applicationConsumption,     // 活动扣课数
            activityPayModeEnum,        // 活动付费类型
        } = this.props;
        if (selectedCourse === undefined) {
            message.error('西格玛课包不可报名活动');
            return;
        }
        const {remainingCourseNum} = selectedCourse;
        if ((payMode === activityPayModeEnum.仅扣课 || payMode === activityPayModeEnum.扣课且付费 || payMode === activityPayModeEnum.扣课或付费) && (remainingCourseNum < applicationConsumption)) {
            // 当付费类型包含扣课并且课时数不足时，不能报名
            message.error('可选课时数不足,不能报名该活动！');
            return;
        }

        if (Array.isArray(selectedBaby) && selectedBaby.length > 0) {
            // 存在选中的宝宝，进行报名
            const {contractId} = selectedCourse;
            const {babyId, leadsId} = selectedBaby[0];
            const {currentCenterId} = this.state;
            const params = {
                currentCenterId,
                activityId: id,
                payMode,
                contractId,
                babyId,
                leadsId,
                startTime: startDateTime,
                endTime: endDateTime,
                applicationConsumption
            };
            completeEnroll(params).then(res => {
                // 报名成功后关闭弹框，刷新报名数据
                this.handleCancel();
                this.getSignList();
            });
        } else {
            // 没有选中的宝宝
            message.error('请先选择一位宝宝');
        }
    }
}

const mapStateToProps = state => {
    const {
        types,
        selectedBabyId,     // 签到时选中的baby
        signList,           // 签到列表
        selectedBaby,       // 报名时选中的宝宝
        selectedCourse,     // 选中的课程
        payMode,            // 付费方式
        id,                 // 活动id
        applicationConsumption, // 活动扣课数
        endDateTime,            // 结束时间
        startDateTime,          // 开始时间
    } = state.activityDetail;
    const {
        activityPayModeObj,            // 支付状态枚举
        teachActivityAttendanceStatusObj,   // 活动参加状态枚举(用于取值)
        activityPayModeEnum,    // 活动付费类型，用于比较
    } = types;
    return {
        selectedBabyId,
        signList,
        activityPayModeObj,
        teachActivityAttendanceStatusObj,
        selectedBaby,
        selectedCourse,
        payMode,
        id,
        activityPayModeEnum,
        applicationConsumption,
        endDateTime,
        startDateTime,
    }
};

const mapDispatchToProps = dispatch => ({
    getActivityType(params) {
        dispatch(getActivityTypeDef(params));
    },
    setSelectedBabyId(params) {
        dispatch(setSelectedBabyId(params));
    },
    getActivityDetail(params) {
        dispatch(getActivityDetail(params));
    },
    resetActivityData() {
        dispatch(resetActivityData());
    },
    getSignList(params) {
        dispatch(getSignList(params));
    },
    resetCheckinData() {
        dispatch(resetCheckinData());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(ActivityCheck);
