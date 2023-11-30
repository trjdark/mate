/**
 * desc: 查看活动详情
 * User: Lyon.li@gymboglobal.com
 * Date: 2018/12/7
 * Time: 下午1:38
 */
import React, {Component} from 'react';
import {Form, message} from "antd";
import {BreadCrumb} from "@/ui/component/breadcrumb";
import BaseInfoForm from '../components/baseInfoForm';
import CostInfoForm from '../components/costInfoForm';
import DetailForm from '../components/activityDetail';
import ConfirmBtnGroup from '../../../component/confirmBtnGroup';
import JoinedMember from './part/joinedMember';
import {
    getActivityTypeDef,
    createActivity,
    editActivity,
    getClassroomList,
    getActivityDetail, checkStaffsConflict
} from "@redux-actions/activity/activityDetail";
import {setActivityData, resetActivityData} from "@/saga/actions/activity/activityDetail";
import {connect} from "react-redux";
import {User} from "@/common/beans/user";
import moment from "moment";
import {CommonUtils} from "@/common/utils/commonUtils";
import {cloneDeep} from 'lodash';
import './style/index.scss';

class ActivityDetail extends Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            breadCrumbRoutes: [
                {
                    name: '活动'
                }, {
                    name: '活动管理'
                }, {
                    name: '创建活动'
                }
            ],
            currentCenterId: User.currentCenterId,
            isView: false,  // 表示是否在查看页面，默认不是
            activityId: '', // 活动id
            staffIsUsable: true,    // 标记员工是否行程冲突，默认不冲突
        };
        this.handleCancelClick = this.handleCancelClick.bind(this);
        this.handleConfirmClick = this.handleConfirmClick.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.setPageStatus = this.setPageStatus.bind(this);
    }

    render() {
        const {breadCrumbRoutes, isView} = this.state;
        const {
            form, setActivityData: setData, approvalStatusTeachEnum, approvalStatus,
            babys, estimateFreeGifts, actualFreeGifts, monthlyFlag,
        } = this.props;
        const isApproved = (approvalStatus === approvalStatusTeachEnum.已通过);
        return (
            <Form>
                <BreadCrumb routes={breadCrumbRoutes}/>
                <div className='page-wrap'>
                    {/*基本信息*/}
                    <BaseInfoForm
                        form={form}
                        setActivityData={setData}
                        isView={isView}
                        checkStaffConflict={this.checkStaffConflict}
                    />
                    {/*费用信息*/}
                    <CostInfoForm
                        form={form}
                        setActivityData={setData}
                        isView={isView}
                        isApproved={isApproved}
                    />
                    {/*活动详情信息*/}
                    <DetailForm
                        form={form}
                        setActivityData={setData}
                        isView={isView}
                        checkStaffConflict={this.checkStaffConflict}
                    />
                    {/*参与会员*/}
                    {
                        (isView && isApproved && babys.length > 0)
                            ? <JoinedMember setActivityData={setData}/>
                            : null
                    }
                    {/*确认按钮组*/}
                    {
                        (!monthlyFlag && (!isView || (isView && isApproved)))
                            ? (
                                <div className='mb15'>
                                    <ConfirmBtnGroup
                                        form={form}
                                        okText={isView ? '保存' : '创建'}
                                        noCancel={true}
                                        handleConfirmClick={this.handleConfirmClick}
                                        treeData={{estimateFreeGifts, actualFreeGifts}}
                                        tipText="是否确定放弃编辑并返回上一页？"
                                        handleCancelClick={this.handleCancelClick}
                                    />
                                </div>

                            ) : null
                    }
                </div>
            </Form>
        )
    }

    componentDidMount() {
        // 页面加载时获取类型值，教室列表
        const {getActivityType, getClassroom} = this.props;
        const {currentCenterId} = this.state;
        getActivityType({ currentCenterId: User.currentCenterId });
        getClassroom(currentCenterId);

        // 设置页面状态
        this.setPageStatus();
    }

    componentDidUpdate(prevProps) {
        // 当路由发生变化，重新设置页面的状态（从查看状态直接切换到新建状态时，组件不会卸载）
        if (prevProps.location.pathname !== this.props.location.pathname) {
            this.setPageStatus();
        }
    }

    componentWillUnmount() {
        // 离开页面前，重置所有数据
        this.props.resetActivityData();
    }

    /*设置页面状态(新建或者查看)*/
    setPageStatus() {
        // 页面加载时判断url是否带有id值
        const {getActivityDetail: getDetail, resetActivityData: resetData} = this.props;
        const {hasParams, parse} = CommonUtils;
        const props = this.props;
        const {currentCenterId} = this.state;
        const breadCrumbRoutes = cloneDeep(this.state.breadCrumbRoutes);

        resetData();    // 首先清除一下旧数据

        if (hasParams(props)) {
            // id值存在，说明是处于编辑页面
            const id = parse(props).id;
            breadCrumbRoutes[2].name = '活动详情';
            this.setState(
                {
                    isView: true,   // 把页面标记为查看
                    activityId: id,
                    breadCrumbRoutes
                },
                () => {
                    // 查询详情数据
                    getDetail({
                        id,
                        currentCenterId
                    })
                });
        } else {
            breadCrumbRoutes[2].name = '新建活动';
            this.setState(
                {
                    isView: false,   // 把页面标记为新建
                    breadCrumbRoutes,
                    activityId: '',
                }
            );
        }
    }

    /*点击提交按钮时，提交或者编辑活动*/
    handleConfirmClick(cb) {
        const {activityId} = this.state;
        if (activityId) {
            // 如果activityId存在，是编辑活动
            this.handleEdit(cb);
        } else {
            // 如果activityId不存在，是新建活动
            this.handleCreate();
        }
    }

    /*创建新的教学活动*/
    handleCreate() {
        const {
            form, createActivity: create, attachments, estimateTotalFee, estimateTotalCourse, classroomUsable,
            estimateFreeGifts, classroomList, applicationFee, applicationConsumption, activityPayModeEnum
        } = this.props;
        const {currentCenterId, staffIsUsable} = this.state;
        if (!classroomUsable) {
            // 如果教室不可用，不能提交
            message.error('当前教室已被占用，请重新选择！');
            return;
        }
        if (!staffIsUsable) {
            // 如果员工行程冲突，不能提交
            message.error('员工行程冲突，请重新选择！');
            return;
        }
        form.validateFields((err, values) => {
            if (!err) {
                const {startDateTime, activityField, classRoomId, payMode} = values;

                if (payMode === activityPayModeEnum.仅付费 && !applicationFee) {
                    message.error('付费金额不能为空!');
                    return;
                } else if (payMode === activityPayModeEnum.仅扣课 && !applicationConsumption) {
                    message.error('扣课数不能为空!');
                    return;

                } else if (payMode === activityPayModeEnum.扣课且付费 && (!applicationFee || !applicationConsumption)) {
                    message.error('付费金额和扣课数不能为空!');
                    return;
                }

                // 把时间转成时间戳形式
                values.startDateTime = moment(startDateTime).valueOf();
                // 把其他必须的数据加到参数上
                values.attachments = attachments;
                values.totalCourse = estimateTotalCourse;
                values.totalFee = estimateTotalFee;
                values.currentCenterId = currentCenterId;
                values.freeGifts = estimateFreeGifts;
                values.applicationFee = applicationFee;
                values.applicationConsumption = applicationConsumption;
                if (!activityField && classRoomId) {
                    // 如果选择的是教室，把教室名称放在活动地点的字段里
                    for (let i = 0; i < classroomList.length; i++) {
                        if (classRoomId === classroomList[i].id) {
                            values.activityField = classroomList[i].classroomName;
                            break;
                        }
                    }
                }
                // 调用新建接口
                create({
                    data: values,
                    cb: () => {
                        // 新建完毕后回到列表页
                        this.props.history.push('/activity/list');
                    }
                });
            }
        })
    }

    /*编辑教学活动*/
    handleEdit(cb) {
        const {activityId, currentCenterId} = this.state;
        const {editActivity: edit, actualActivityCost, babys, actualParticipantNum, actualFreeGifts} = this.props;
        edit({
            data: {
                id: activityId,
                activityCost: actualActivityCost,
                babys,
                participantNum: actualParticipantNum,
                currentCenterId,
                freeGifts: actualFreeGifts
            },
            cb: () => {
                // 编辑完毕进行提示
                message.success('保存成功！');
            }
        })
    }

    /*取消创建时，返回上一页*/
    handleCancelClick() {
        this.props.history.goBack();
    }

    /*检查员工是否冲突*/
    checkStaffConflict = () => {
        const {startDateTime, duration, staffs} = this.props;
        if (startDateTime && duration && staffs.length > 0) {
            const params = {
                currentCenterId: User.currentCenterId,
                duration,
                staffIds: staffs,
                startDateTime,
            };
            checkStaffsConflict(params).then(
                res => {
                    this.setState({
                        staffIsUsable: true
                    });
                },
                error => {
                    this.setState({
                        staffIsUsable: false
                    });
                });
        }
    }
}

const mapStateToProps = state => {
    const {
        types,
        classroomList,  // 教室列表
        approvalStatus, // 审批状态
        attachments,    // 附件列表
        babys,          // 客户列表
        estimateTotalCourse,    // 规划的总扣课数
        estimateTotalFee,       // 规划的总付费金额
        estimateFreeGifts,      // 规划的礼物列表
        actualActivityCost,     // 实际活动花费
        actualParticipantNum,   // 实际宝宝数
        actualFreeGifts,        // 实际的赠品
        applicationFee,         // 付费金额
        applicationConsumption, // 扣课数
        classroomUsable,        // 教室的可用性
        startDateTime,          // 活动开始时间
        duration,               // 活动时长
        staffs,                 // 参与员工
        monthlyFlag,            // 月结标志
    } = state.activityDetail;

    const {
        approvalStatusTeachEnum,    // 审批状态
        activityPayModeEnum,        // 支付类型
    } = types;

    return {
        approvalStatus,
        approvalStatusTeachEnum,
        activityPayModeEnum,
        classroomList,
        attachments,
        estimateTotalCourse,
        estimateTotalFee,
        estimateFreeGifts,
        actualActivityCost,
        actualParticipantNum,
        babys,
        actualFreeGifts,
        applicationFee,
        applicationConsumption,
        classroomUsable,
        startDateTime,
        duration,
        staffs,
        monthlyFlag,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getActivityType(params) {
            dispatch(getActivityTypeDef(params));
        },
        setActivityData(type, data) {
            dispatch(setActivityData(type, data));
        },
        createActivity(params) {
            dispatch(createActivity(params));
        },
        getClassroom(params) {
            dispatch(getClassroomList(params));
        },
        resetActivityData() {
            dispatch(resetActivityData());
        },
        getActivityDetail(params) {
            dispatch(getActivityDetail(params));
        },
        editActivity(params) {
            dispatch(editActivity(params));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ActivityDetail));
