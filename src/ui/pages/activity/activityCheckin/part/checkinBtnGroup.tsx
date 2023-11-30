/**
 * desc: 签到页面的按钮组组件
 * User: Lyon.li@gymboglobal.com
 * Date: 2018/12/7
 * Time: 下午1:38
 */
import React, {Component, Fragment} from 'react';
import {withRouter} from "react-router";
import {Button, message} from "antd";
import {connect} from "react-redux";
import {User} from "@/common/beans/user";
import {CommonUtils} from "@/common/utils/commonUtils";
import {resetActivityData} from "@/saga/actions/activity/activityDetail";
import {signIn, cancelEnroll} from "@redux-actions/activity/activityDetail";
import {Modal} from "@/ui/component/customerCreateModal";
import moment from "moment";


class CheckinBtnGroup extends Component<any, any> {
    constructor(props) {
        super(props);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleToPrint = this.handleToPrint.bind(this);
        this.handleSign = this.handleSign.bind(this);
        this.handleEnrollCancel = this.handleEnrollCancel.bind(this);
        this.state = {
            visible: false,
            contentText: null,
            callback: null
        }
    }

    render() {
        const { openBabyModal, startDateTime} = this.props;
        const {visible, contentText, callback} = this.state;
        const nowTime = new Date().getTime();
        const nowMonth = new Date().getMonth()+1;
        const startTime = moment(startDateTime).format();
        const startMonth = new Date(startTime)
        const startMonths = startMonth.getMonth()+1;
        return (
            <Fragment>
                <div className="checkin-btn-group mb20">
                    <div className="left ml25">
                        <button
                            className="gym-button-xs gym-button-default"
                            onClick={openBabyModal}
                        >
                            报名
                        </button>
                        <button
                            className="gym-button-xs gym-button-white"
                            onClick={() => this.handleOpen('确认取消报名吗？', this.handleEnrollCancel)}
                        >
                            取消报名
                        </button>
                        <Button
                            className="gym-button-xs gym-button-blue"
                            onClick={() => this.handleOpen('确认签到吗？', this.handleSign)}
                            disabled={startDateTime - nowTime > 0 && startMonths - nowMonth>0 ?true:false}
                        >
                            签到
                        </Button>
                    </div>
                    <div className="right">
                        <Button
                            htmlType="button"
                            className="gym-button-lg gym-button-wBlue"
                            onClick={() => this.handleToPrint(true)}
                        >
                            打印（有联系方式）
                        </Button>
                        <Button
                            htmlType="button"
                            className="gym-button-lg gym-button-wBlue"
                            onClick={() => this.handleToPrint(false)}
                        >
                            打印（无联系方式）
                        </Button>
                    </div>
                </div>
                <Modal
                    handleOk={callback}
                    handleCancel={() => this.setState({visible: false})}
                    visible={visible}
                    contentText={contentText}
                />
            </Fragment>
        );
    }

    // 打开确认弹框
    handleOpen(text, cb) {
        const {selectedBabyId} = this.props;
        // 如果还没有选择任何宝宝，弹出警告弹框
        if (selectedBabyId.length === 0) {
            message.warning('请先选择宝宝！');
            return;
        }
        this.setState({
            contentText: text,
            callback: cb,
            visible: true
        })

    };

    // 处理活动签到
    handleSign() {
        const {
            applicationConsumption, applicationFee, payMode, startDateTime,
            getSignList, selectedBabyId, setSelectedBabyId, id, type,
        } = this.props;
        const currentCenterId = User.currentCenterId;
        let signInDatas = selectedBabyId.map(item => {
            const {attendanceId, contractId, leadsId, babyId, babyName} = item;
            return ({
                attendanceId, contractId, leadsId, currentCenterId, babyId, babyName
            });
        });
        const params = {
            currentCenterId,
            applicationConsumption,
            applicationFee,
            payMode,
            startDateTime,
            signInDatas,
            id,
            type,
        };
        signIn(params).then(res => {
            if (res.msg) {
                message.info(res.msg, 4);
            }
            // 签到完毕后，更新数据
            resetActivityData();
            getSignList();
            setSelectedBabyId([]);
        });
        this.setState({visible: false})
    }

    // 处理取消活动报名
    handleEnrollCancel() {
        const {
            applicationConsumption, getSignList, applicationFee, payMode,
            startDateTime, selectedBabyId, setSelectedBabyId
        } = this.props;

        let cancelBookDatas = selectedBabyId.map(item => {
            const {attendanceId, contractId, leadsId} = item;
            return ({
                attendanceId, contractId, leadsId
            });
        });

        const params = {
            currentCenterId: User.currentCenterId,
            applicationConsumption,
            applicationFee,
            payMode,
            startDateTime,
            cancelBookDatas
        };

        cancelEnroll(params).then(res => {
            // 取消报名后，更新数据
            resetActivityData();
            getSignList();
            setSelectedBabyId([]);
        });
        this.setState({visible: false})
    }

    // 跳转打印页面
    handleToPrint(bool) {
        const activityId = this.props.activityId;
        const params = CommonUtils.stringify({contract: bool, activityId});
        this.props.history.push(`/activity/print/${params}`);
    }
}

const mapStateToProps = state => {
    const {
        selectedBabyId,          // 签到时选中的宝宝
        applicationConsumption,  // 扣课数
        applicationFee,          // 付费金额
        payMode,                 // 扣费方式
        startDateTime,           // 活动时间
        id,                      // 活动Id
        type,                    // 活动类型
    } = state.activityDetail;
    return {
        selectedBabyId,
        applicationConsumption,
        applicationFee,
        payMode,
        startDateTime,
        id,
        type
    }
};

export default connect(mapStateToProps)(withRouter(CheckinBtnGroup));
