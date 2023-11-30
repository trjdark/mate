/**
 * Desc: 签到列表
 * User: Debby.Deng
 * Date: 2018/12/10,
 * Time: 下午1:50
 */
import React, {Fragment} from "react";
import {PageTitle} from "@/ui/component/pageTitle";
import {CommonUtils} from "@/common/utils/commonUtils";
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {ListModal} from "@/ui/component/listModal";
import {ChooseBaby} from "./chooseBaby";
import history from '@/router/history';
import {TeachingRoutes} from "@/router/enum/teachingRoutes";
import _ from 'lodash';
import {bookWay, signInStatus} from "../../enum/schedule";
import {MultLeaveConfirm} from "../../component/multLeaveConfirm";
import {
    changeStatus, deleteCourse,
    getGaGbInit,
    getSignInBabyList, isManualMonth,
    leaveConfirmList,
    leaveSubmit
} from "@redux-actions/teaching/scheduleAction";
import {User} from "@/common/beans/user";
import moment from 'moment';
import { Col, message, Row, Button, Modal} from "antd";
import {connect} from "@/common/decorator/connect";
import {Message} from "@/ui/component/message/message";
import {Table} from "@/ui/component/tablePagination";
import {CustomerRoutes} from "@/router/enum/customerRoutes";
import {Confirm} from "@/ui/component/customerCreateModal";
import { AlleleTable } from './alleleTable';
import { FUNC } from "@/ui/pages/setting/enum/functions";

function TablePart(props) {
    return (
        <div className={`${props.className ? props.className : ''} gym-table-part`}>
            <p className='bgGrey'>{props.label}</p>
            <p>{props.content}</p>
        </div>
    )
}
/**
 * 权限控制
 * @param func key
 */
function isExist(funcId) {
    const permissionList = User.permissionList;
    return permissionList.includes(funcId)
};
@connect((state) => ({}), {
    getGaGbInit
})
class SignInList extends React.Component<any, any> {
    value: any; // context 传入的值
    state = {
        showChoose: false,
        showLeaveModal: false,
        lessonId: '',
        babyList: [],
        courseInfo: {},
        selectedRowKeys: [],
        askLeaveDataSource: [],
        selectEnable:false, // 临时选课按钮是否可点
        visible:false
    };
    routes = [
        {name: '教学', path: '', link: '#', id: 'teaching'},
        {name: '课程表', path: '', link: '#', id: 'signIn'},
        {name: '签到', path: '', link: '#', id: 'signInList'},
    ];
    columns = [
        {
            title: '宝宝姓名',
            dataIndex: 'babyName',
            key: 'babyName',
            render: (text, record) => {
                return <a href={`${CustomerRoutes.客户360.link}${CommonUtils.stringify({leadsId: record.leadsId})}`}
                          target="_blank">{text}</a>
            }
        }, {
            title: '昵称',
            dataIndex: 'nickName',
            key: 'nickName',
        }, {
            title: '性别',
            dataIndex: 'gender',
            key: 'gender',
            render: (text) => (this.getGender(text))
        }, {
            title: '出生日期',
            dataIndex: 'birthday',
            key: 'birthday',
            render: (text) => (text && moment(Number(text)).format('YYYY-MM-DD'))
        }, {
            title: '排课类型',
            dataIndex: 'bookWay',
            key: 'bookWay',
            render: (text, record) => (text && (!!Number(record.isWaiting) ? 'W' : this.bookWayEnum[text].name))
        }, {
            title: '排课时间',
            dataIndex: 'bookTime',
            key: 'bookTime',
            render: (text) => (text && moment(Number(text)).format('YYYY-MM-DD'))
        }, {
            title: '排课人',
            dataIndex: 'bookStaffName',
            key: 'bookStaffName',
        }, {
            title: '状态',
            dataIndex: 'attendanceStatus',
            key: 'attendanceStatus',
            render: (text) => (text && this.courseStatusValueEnum[text].name)
        }, {
            title: '随堂反馈',
            dataIndex: 'feedback',
            key: 'feedback',
            // todo
        },
    ];
    routeParams = CommonUtils.hasParams(this.props) ? CommonUtils.parse(this.props) : {};
    courseStatusEnum = _.keyBy(signInStatus, (item) => {
        return item.name
    });
    courseStatusValueEnum = _.keyBy(signInStatus, (item) => {
        return item.value
    });
    bookWayEnum = _.keyBy(bookWay, (item) => {
        return item.value
    });
    getFeedbackBtns = (type) => {
        if (type === this.courseStatusEnum.未上.value || type === this.courseStatusEnum.已上.value) {// 未上，已上
            return <button className='gym-button-white gym-button-xs'>填写</button>
        } else if (type === 0) {
            return <button className='gym-button-white gym-button-xs'>查看</button>
        }
    };
    /**
     * 将数字转换为性别字符
     * @param genderNumber
     * @returns {any}
     */
    getGender = (genderNumber) => {
        if (genderNumber === 0 || genderNumber === '0') {
            return '女'
        } else if (genderNumber === 1 || genderNumber === '1') {
            return '男'
        } else {
            return ''
        }
    };

    /**
     * 选择宝宝弹框确定按钮
     * @returns {any}
     */
    handleBookOk = () => {
        this.setState({showChoose: false});
    };
    /**
     * 选择宝宝弹框取消按钮
     * @returns {any}
     */
    handleBookCancel = () => {
        this.setState({showChoose: false});
    };
    /**
     * 点击预约按钮 临时选课
     * @returns {any}
     */
    addBaby = () => {
        isManualMonth({date: this.routeParams.date, currentCenterId: User.currentCenterId}).then(() => {
            this.setState({showChoose: true});
        })

    };
    /**
     * 点击请假按钮
     * @returns {any}
     */
    askLeave = () => {
        const {selectedRowKeys} = this.state;
        const params = {
            currentCenterId: User.currentCenterId,
            date: this.routeParams.date,
            attendanceIdList: selectedRowKeys
        };
        isManualMonth({date: this.routeParams.date, currentCenterId: User.currentCenterId}).then(() => {
            if (selectedRowKeys.length) {
                leaveConfirmList(params).then(
                    (res) => {
                        this.setState({askLeaveDataSource: res});
                    },
                    err => {
                        console.log(err)
                        // todo mock数据
                    });
                this.setState({showLeaveModal: true});
            } else {
                message.error('请选择宝宝');
            }
        })

    };
    /**
     * 请假弹框弹框取消按钮
     * @returns {any}
     */
    handleLeaveCancel = () => {
        this.setState({showLeaveModal: false});
    };
    /**
     * 请假弹框确定按钮
     * @returns {any}
     */
    handleLeaveOk = (value) => {
        let leaveList = [];
        for (let key in value) {
            if (value.hasOwnProperty(key)) {
                leaveList.push({
                    attendanceId: key,
                    leaveReason: value[key]
                })
            }
        }
        const params = {
            currentCenterId: User.currentCenterId,
            leaveList
        };
        leaveSubmit(params).then(
            (res) => {
                const content = res.message || '操作成功！';
                Message.success(content);
                this.setState({showLeaveModal: false});
                this.getPageData();
            },
            (err) => {
                console.log(err);
            })
    };

    /**
     * @param status:改变至哪个状态
     * 改变状态：已上，未上，旷课
     * @returns {any}
     */
    changeStatus = (status) => {
        const {selectedRowKeys, lessonId} = this.state;
        const params = {
            attendanceIdList: selectedRowKeys,
            attendanceStatus: status,
            currentCenterId: User.currentCenterId,
            date: this.routeParams.date,
            lessonId: lessonId
        };
        if (selectedRowKeys.length) {
            changeStatus(params).then((res) => {
                const content = res.message || '操作成功！';
                Message.success(content);
                this.getPageData();
            })
        } else {
            message.error('请选择宝宝');
        }
    };

    /**
     * 未上
     * @returns {any}
     */
    unAttend = () => {
        this.changeStatus(this.courseStatusEnum[`未上`].value)
    };
    /**
     * 签到
     * @returns {any}
     */
    signIn = () => {
        this.changeStatus(this.courseStatusEnum[`已上`].value)
    };
    /**
     * 旷课
     * @returns {any}
     */
    absentCourse = () => {
        this.changeStatus(this.courseStatusEnum[`旷课`].value)

    };
    /**
     * 删课
     * @returns {any}
     */
    handleDeleteCourse=()=>{
        const {selectedRowKeys} = this.state;
        const params={
            currentCenterId:User.currentCenterId,
            id:selectedRowKeys
        };
        if (selectedRowKeys.length) {
            const _this=this;
            Confirm({
                content:<p className='gym-teaching-schedule-signinfo-delete-content'>是否确认删除课程？</p>,
                centered:true,
                maskClosable:true,
                onOk(){
                    deleteCourse(params).then(res => {
                        const content = res.message || '删课成功！';
                        Message.success(content);
                        _this.getPageData();
                    })
                }
            })
        }else{
            message.error('请选择宝宝');
        }
    };
    /**
     * 等位日志
     * @returns {any}
     */
    handleAlleleourse=()=>{
        this.setState({visible:!this.state.visible})
    };
    toPrintPage = (i) => {
        const {scheduleId} = this.routeParams;
        const {courseInfo} = this.state;
        history.push(`${TeachingRoutes.签到打印.link}${CommonUtils.stringify({
            lessonId: this.state.lessonId,
            scheduleId: scheduleId,
            courseInfo,
            id: i
        })}`)
    };
    handleTableSelectChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys});
    };
    /**
     * 获取页面数据
     * @returns {any}
     */
    getPageData = () => {
        const params = {currentCenterId: User.currentCenterId, ...this.routeParams};
        getSignInBabyList(params).then((res) => {
            this.setState({
                babyList: res.signInBabyInfoList,
                courseInfo: res.signInLessonDetail,
                lessonId: res.signInLessonDetail.lessonId,
                selectEnable: res.selectEnable,
                selectedRowKeys: []
            })
        })
    };
    /**
     * 获取ga,gb列表
     * @returns {any}
     */
    getGaGbList = () => {
        const {getGaGbInit} = this.props;
        getGaGbInit({
            currentCenterId: User.currentCenterId
        })
    };

    componentDidMount() {
        this.getPageData();
        this.getGaGbList();
    }

    render() {
        const weekString = ['周一', '周二', '周三', '周四', '周五', '周六', '周天',];
        const {showLeaveModal, babyList, courseInfo, selectedRowKeys, askLeaveDataSource,selectEnable, lessonId, visible} = this.state;
        // @ts-ignore
        // businessSource 业务来源
        const {startTime, date, courseCode, classroomName, teacherName, assistantInsStaffName, capacity, regular, makeUp, queuing, preview,businessSource} = courseInfo;
        const rest = capacity - regular - makeUp - preview;
        const courseStartDate = date ?
            `${moment(date).format('YYYY-MM-DD')}(${weekString[moment(date).weekday()]})` : '';
        const lessonStartTimeStamp = (date && startTime) ? moment(`${moment(date).format('YYYY-MM-DD')}${' '}${startTime}`, 'YYYY-MM-DD HH:mm').valueOf() : null;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.handleTableSelectChange,
            getCheckboxProps: (record) => (
                {
                    disabled: !!Number(record.isWaiting),
                    className: `gym-teaching-schedule-signinfo-checkbox-${!!Number(record.isWaiting) ? 'disabled' : 'checkbox'}`
                }
            )
        };
        const nowYear = new Date().getFullYear();
        const nowMonth = new Date().getMonth()+1;
        const dateTime = moment(date).format();
        const old = new Date(dateTime)
        const oldYear = old.getFullYear();
        const oldMonth = old.getMonth() + 1;
        return (
            <div className='gym-teaching-schedule-signinfo pos_rel'>
                <BreadCrumb routes={this.routes}/>
                <div className='gym-teaching-schedule-signinfo-detail bgWhite'>
                    <PageTitle title='课程详情'/>
                    <ul className='gym-teaching-schedule-signinfo-table'>
                        <li>
                            <TablePart label='课程时间:' content={`${courseStartDate}${' '}${startTime}`}/>
                        </li>
                        <li>
                            <Row>
                                <Col span={12}>
                                    <TablePart label={`课程:`} content={courseCode}/>
                                </Col>
                                <Col span={12}>
                                    <TablePart label={`教室:`} content={classroomName}/>
                                </Col>
                            </Row>
                        </li>
                        <li>
                            <Row>
                                <Col span={12}>
                                    <TablePart
                                        label={`INS:`}
                                        content={
                                            <Fragment>
                                                <span>主教：{teacherName}</span>
                                                {
                                                    assistantInsStaffName ?
                                                        <span>助教：{assistantInsStaffName}</span> : null
                                                }
                                            </Fragment>
                                        }
                                    />
                                </Col>
                                <Col span={12}>
                                    <TablePart label={`容量:`} content={capacity}/>
                                </Col>
                            </Row>
                        </li>
                    </ul>
                    <ul className='flex gym-teaching-schedule-signinfo-status'>
                        <li>R:{regular}</li>
                        <li>M:{makeUp}</li>
                        <li>P:{preview}</li>
                        <li>空余:{rest}</li>
                        <li>W:{queuing}</li>
                    </ul>
                </div>

                <div className='gym-teaching-schedule-signinfo-list bgWhite mt20'>
                    <PageTitle title='签到列表'/>
                    <p className='gym-teaching-schedule-signinfo-list-btn-group'>
                        <button
                            className={selectEnable ===true ? 'gym-button-default gym-button-xs mr10':'gym-button-default gym-button-xs mr10 gym-button-greyb'}
                            onClick={this.addBaby}
                            disabled={!selectEnable}
                        >
                            临时选课
                        </button>
                        <Button
                            className='gym-button-white gym-button-xs mr10'
                            onClick={this.unAttend}
                        >
                            未上
                        </Button>
                        {
                            ((oldYear - nowYear == 0 && oldMonth - nowMonth <=0) || (oldYear - nowYear < 0)) &&
                            <Button
                                className='gym-button-white gym-button-xs mr10'
                                onClick={this.signIn}
                            >
                                签到
                            </Button>
                        }
                            <Button
                                className='gym-button-white gym-button-xs mr10'
                                onClick={this.askLeave}
                            >
                                请假
                            </Button>
                        {/* } */}
                        {
                            ((oldYear - nowYear == 0 && oldMonth - nowMonth <=0) || (oldYear - nowYear < 0)) &&
                            <Button
                                className='gym-button-white gym-button-xs mr10'
                                onClick={this.absentCourse}
                            >
                                旷课
                            </Button>
                        }
                        {
                            (isExist(`${FUNC[`试听课删课`]}`) || isExist(`${FUNC[`删课`]}`) ) &&
                            <Button
                                className='gym-button-white gym-button-xs mr10'
                                onClick={this.handleDeleteCourse}
                            >
                                删课
                            </Button>
                        }
                        <Button
                            className='gym-button-white gym-button-sm mr10'
                            onClick={this.handleAlleleourse}
                        >
                            等位日志
                        </Button>
                        <button
                            className='gym-button-wBlue gym-button-lg fr'
                            onClick={this.toPrintPage.bind(this, 2)}
                        >
                            打印（无联系方式）
                        </button>
                        <button
                            className='gym-button-wBlue gym-button-lg fr mr10'
                            onClick={this.toPrintPage.bind(this, 1)}
                        >
                            打印（有联系方式）
                        </button>
                    </p>
                    <Table
                        className='mt15'
                        rowSelection={rowSelection}
                        rowKey='attendanceId'
                        columns={this.columns}
                        dataSource={babyList}
                    />
                </div>

                <ListModal
                    visible={this.state.showChoose}
                    destroyOnClose={true}
                    maskClosable={true}
                    handleOk={this.handleBookOk}
                    handleCancel={this.handleBookCancel}
                    okText='确认'
                    cancelText='取消'
                >
                    <ChooseBaby
                        businessSource={businessSource}
                        lessonId={this.state.lessonId}
                        restCapacity={rest}
                        lessonStartTimeStamp={lessonStartTimeStamp}
                        onClose={this.handleBookCancel}
                        onUpdateData={this.getPageData}

                    />
                </ListModal>


                <MultLeaveConfirm
                    dataSource={askLeaveDataSource}
                    date={this.routeParams.date}
                    onCancel={this.handleLeaveCancel}
                    onOk={this.handleLeaveOk}
                    showModal={showLeaveModal}

                />
                <Modal
                    title={<PageTitle title="等位日志" />}
                    visible={ visible }
                    onCancel={()=>{
                        this.setState({visible:false})
                    }}
                    footer={false}
                    destroyOnClose={true}
                    width={1024}
                    bodyStyle={{maxHeight:"600px",overflowY:"auto"}}
                    style={{minWidth:"740px"}}
                >
                    <AlleleTable lessonId={lessonId}/>
                </Modal>
            </div>
        )
    }
}

export {SignInList}
