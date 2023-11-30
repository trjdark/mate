/**
 * desc: 编辑活动
 * User: Lyon.li@gymboglobal.com
 * Date: 2018/12/7
 * Time: 下午1:38
 */
import React, {Component} from 'react';
import {Form, message} from "antd";
import {connect} from "react-redux";
import {BreadCrumb} from "@/ui/component/breadcrumb";
import BaseInfoForm from "../components/baseInfoForm";
import CostInfoForm from "../components/costInfoForm";
import DetailForm from "../components/activityDetail";
import ConfirmBtnGroup from "../../../component/confirmBtnGroup";
import {
    createActivity,
    getActivityDetail,
    getActivityTypeDef,
    getClassroomList,
    approveActivity
} from "@redux-actions/activity/activityDetail";
import {resetActivityData, setActivityData} from "@/saga/actions/activity/activityDetail";
import {CommonUtils} from "@/common/utils/commonUtils";
import {User} from "@/common/beans/user";
import './style/index.scss';

const enum approveEnum {
    '审批通过' = '1',
    '审批拒绝' = '0',
}

class ActivityApprove extends Component<any, any> {
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
            id: '',     // 活动id
            currentCenterId: User.user.currentCenterId
        };

        this.handleApprove = this.handleApprove.bind(this);
        this.handleConfirmClick = this.handleConfirmClick.bind(this);
        this.handleCancelClick = this.handleCancelClick.bind(this);
    }

    render() {
        const {breadCrumbRoutes} = this.state;
        const {form} = this.props;
        return (
            <Form>
                <BreadCrumb routes={breadCrumbRoutes}/>
                <div className='page-wrap'>
                    {/*基本信息*/}
                    <BaseInfoForm form={form} isView={true}/>
                    {/*费用信息*/}
                    <CostInfoForm form={form} isView={true}/>
                    {/*活动详情信息*/}
                    <DetailForm form={form} isView={true}/>
                    {/*确认按钮组*/}
                    <div className='mb15'>
                        <ConfirmBtnGroup
                            form={form}
                            okText="同意"
                            cancelText="拒绝"
                            handleConfirmClick={this.handleConfirmClick}
                            tipText="确认拒绝该教学活动吗？"
                            handleCancelClick={this.handleCancelClick}
                        />
                    </div>

                </div>
            </Form>
        );
    }

    componentDidMount() {
        // 页面加载时获取类型值，教室列表
        const {getActivityType, getClassroom, getActivityDetail: getDetail} = this.props;
        const {currentCenterId} = this.state;
        getActivityType({ currentCenterId: User.currentCenterId});
        getClassroom(currentCenterId);

        // 页面加载时判断url是都带有id值
        const {hasParams, parse} = CommonUtils;
        const props = this.props;
        if (hasParams(props)) {
            // id值存在，说明是处于编辑页面
            const id = parse(props).id;
            this.setState({
                isView: true,   // 把页面标记为查看
                id
            });

            // 查询详情数据
            getDetail({
                id,
                currentCenterId
            })
        }
    }

    componentWillUnmount() {
        // 离开页面前，重置所有数据
        this.props.resetActivityData();
    }

    /*审批通过*/
    handleConfirmClick() {
        this.handleApprove(approveEnum.审批通过, '已同意该教学活动');
    }

    /*审批拒绝*/
    handleCancelClick() {
        this.handleApprove(approveEnum.审批拒绝, '已拒绝该教学活动');
    }

    /*请求审批接口*/
    handleApprove(type, text) {
        const {id, currentCenterId} = this.state;
        const params = {
            approvalOperateType: type,
            currentCenterId,
            id,
        };
        approveActivity(params).then(res => {
            message.success(text);
            this.props.history.goBack();
        });
    }
}

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
        }
    }
};

export default connect(null, mapDispatchToProps)(Form.create()(ActivityApprove));
