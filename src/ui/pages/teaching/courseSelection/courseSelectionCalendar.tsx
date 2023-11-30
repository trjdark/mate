/**
 * desc: 选课情况列表模式
 * User: colin.lu
 * Date: 2018/9/01
 * Time: 上午10:00
 */

import React from 'react';
import {BreadCrumb} from "../../../component/breadcrumb";
import {form} from "../../../../common/decorator/form";
import {Icon} from "../../../component/icon";
import moment from 'moment';
import { message, Row, Col, Calendar} from "antd";
import history from '../../../../router/history';
import {Routes} from "@/router/enum/routes";
import {User} from "../../../../common/beans/user";
import {CourseDot} from "./part/courseDot";
import {CommonUtils} from "../../../../common/utils/commonUtils";
import {getAttendanceRecordCalendar, deleteUnClass} from "@redux-actions/teaching/courseSelection";
import {ArrangeCalendarItem} from "./part/arrangeCalendarItem";
import {isManualMonth, leaveConfirmList, leaveSubmit} from "@redux-actions/teaching/scheduleAction";
import {MultLeaveConfirm} from "../component/multLeaveConfirm";
import {Modal as MyModal} from "../../../component/customerCreateModal";
import '../courseSelection/style/index'

@form()

class CourseSelectionCalendar extends React.Component<any, any> {
    //路由代码块
    private routes:Array<any> = [
        {
            name: '客户360',
            path: '',
            link: '#',
            id: 'customer360'
        },{
            name: '选课情况',
            path: '',
            link: '#',
            id: 'courseSelection'
        }
    ];
    leadsId:string;
    table:Array<Object>;

    constructor(props: any) {
        super(props);
        if (CommonUtils.hasParams(props)) {
            this.leadsId = CommonUtils.parse(props).leadsId;
        }
    }

    state = {
        calendar: [],
        //modal
        visible: false,
        leaveList: [],
        deleteList: [],
        lessonList: [],
        weekList: [],
        courseIdList: [],
        sortName: null,
        sortOrder: null,
        selectYears: [],
        time:moment().startOf('day').valueOf(),
        chooseMonth:moment().startOf('day').valueOf(),
        visibleClass: false,
        selectedDate: null,
        currentMonth: moment(),
        selectedClassList: [],
        calendarLeaveId: [],
        calendarDeleteId: [],
        askLeaveDataSource: [],
        showLeaveModal: false,
        showList: false,
        hasLessonDateList: [],
        currentDateList: []
    };


    componentDidMount() {
        this.getCalendar();
    }

    /**
     * delete操作
     */
    deleteDetail = (record) => {
        this.setState({
            visible: true,
            id: record.financialRecordId
        })

    };

    onCancel = () => {
        this.setState({
            visible: false,
            id: ''
        })
    };

    onOk = () => {
        this.setState({
            visible: false,
        });

    };

    /**
     *查询列表
     */
    getCalendar = () => {
        const postData = {
            "currentCenterId": User.currentCenterId,
            "leadsId": this.leadsId,
            "yearMonth": moment(this.state.chooseMonth).startOf('month').valueOf()
        };

        getAttendanceRecordCalendar(postData).then((res) => {

            for(let i = 0; i < res.length; i++){
                this.state.hasLessonDateList.push(moment(res[i].date).format("YYYY-MM-DD"))
            }

            this.setState({
                calendar:res,
                hasLessonDateList:this.state.hasLessonDateList
            })
        }, (err) => {
            //返回请求reject
            message.error(err.msg)
        });

    };


    /**
     * 列表日历模式切换
     * @param pageInfo
     */
    goToList = () =>{
        history.push(`${Routes.选课情况列表.link}${
            CommonUtils.stringify({
                leadsId:this.leadsId
            })
        }`)
    };

    /**
     * 选择一个日期
     */
    onSelectDay =(values:any)=>{
        //通过选择的日期去filter筛选所有的月课程数据，最后得到只有当天的课程数据
        let showCurrentDateList = [];
        showCurrentDateList = this.state.calendar.filter(item=>
            (moment(item.date).format('YYYY-MM-DD')) === moment(values).format("YYYY-MM-DD")
        );
        this.setState({
            showList:true,
            currentDateList: showCurrentDateList
        })

    };

    /**
     * 切换月份
     * @param date
     */
    handleChange = (date:any) => {
        this.setState({
            chooseMonth:moment(date).format('YYYY-MM-DD')
        }, () => {
            this.getCalendar()
        });

    };

    /**
     * 重写日历内容
     * @param current
     * @param value
     * @returns {any}
     */
    dateCellRender = (current) => {
        if(this.state.hasLessonDateList.includes(current.format("YYYY-MM-DD"))){

            let showDateList = [];
            showDateList = this.state.calendar.filter(item=>
                (moment(item.date).format('YYYY-MM-DD')) === current.format("YYYY-MM-DD")
            );

            return (
                <ul className="events">
                    {
                        showDateList.map(item => (
                            <li key={item.attendanceId}>
                                <CourseDot status={item.courseCode} text={item.courseCode} />
                            </li>
                        ))
                    }
                </ul>
            )
        }
    };

    /**
     * 请假
     */
    leave =(value:any)=>{
        this.state.calendarLeaveId = [];
        this.state.calendarLeaveId.push(value.attendanceId);
        this.setState({
            calendarLeaveId: this.state.calendarLeaveId
        });

        //先判断是否月结，如果已月结不做请假
        isManualMonth({date:value.date,currentCenterId:User.currentCenterId}).then((res) => {
            //未月结可以请假
            const postParams={
                currentCenterId:User.currentCenterId,
                attendanceIdList:this.state.calendarLeaveId
            };
            leaveConfirmList(postParams).then((res)=>{
                this.setState({askLeaveDataSource:res});
            },err=>{
                message.error(err.msg)
            });
            this.setState({showLeaveModal:true});
        }, (err) => {
           message.error(err.msg);
        })
    };

    /**
     * 请假弹框弹框取消按钮
     * @returns {any}
     */
    handleLeaveCancel=()=>{
        this.setState({showLeaveModal:false});
    };
    /**
     * 请假弹框确定按钮
     * @returns {any}
     */
    handleLeaveOk=(value)=>{
        let leaveList=[];
        for(let key in value){
            leaveList.push({
                attendanceId:key,
                leaveReason:value[key]
            })
        }
        const params={
            currentCenterId:User.currentCenterId,
            leaveList
        };
        leaveSubmit(params).then(()=>{
            message.success('请假操作成功！');
            this.setState({
                showLeaveModal:false,
                calendarLeaveId: []
            });
            //重新获取页面数据
            this.getCalendar();
        },(err)=>{
            message.error(err.msg)
        })
    };

    /**
     * 删课
     */
    delete =(value:any)=>{
        this.state.calendarDeleteId = [];
        this.state.calendarDeleteId.push(value.attendanceId);
        this.setState({
            calendarDeleteId: this.state.calendarDeleteId
        });
        this.setState({
            visible: true
        })
    };

    handleDelete = () => {
        const postData = {
            "currentCenterId": User.currentCenterId,
            "id": this.state.calendarDeleteId
        };

        deleteUnClass(postData).then(() => {
            message.success('删除成功!');
            this.setState({
                visible:false,
                calendarDeleteId: []
            });
            //重新获取页面数据
            this.getCalendar();
        }, (err) => {
            //返回请求reject
            message.error(err.msg)
        });
    };

    /**
     * 日历选取新的年月
     */
    setNewDate = (value:any) =>{
    };

    render() {
        const { visible, lessonList, askLeaveDataSource, showLeaveModal, showList, currentDateList} = this.state;

        let filterLessonList = [];

        if(lessonList !== []) {
            for (let i = 0; i < lessonList.length; i++) {
                let pushData = {
                    text: '',
                    value: ''
                };

                pushData.text = lessonList[i].courseCode;
                pushData.value = lessonList[i].courseId;
                filterLessonList.push(pushData)
            }
        }

        return (
            <div id='gym-course' className='gym-course-selection'>
                <BreadCrumb routes={this.routes} />
                <div className='gym-contract'>
                    <div className='gym-course-selection-calendar-btn-group'>
                        <div className='gym-course-selection-calendar-select mr20'>
                            <span className='gym-course-selection-calendar-select-icon-unSelected' onClick={this.goToList}>
                                <Icon className='gym-course-selection-calendar-select-icon' type={"liebiaomoshi"}/><span className='gym-course-selection-calendar-select-text'>列表模式</span>
                            </span>
                            <span className='gym-course-selection-calendar-select-icon-selected ml15'>
                                <Icon className='gym-course-selection-calendar-select-icon' type={"rili"}/><span className='gym-course-selection-calendar-select-text'>日历模式</span>
                            </span>
                        </div>
                    </div>
                    <div className='gym-course-calendar page-wrap'>
                        <Row>
                            <Col span={18}>
                                <div>
                                    <Calendar
                                        dateCellRender={this.dateCellRender}
                                        onChange={this.handleChange}
                                        onSelect={(value:any) => this.onSelectDay(value)}
                                        style={{ zIndex: 10 }}
                                        onPanelChange={this.setNewDate}
                                    />
                                </div>
                            </Col>
                            <Col span={6} className="course-operation">
                                {
                                    //判断是否点击选取了一天的课程
                                    showList &&
                                    <div>
                                        <div className='arrange-border'>
                                        </div>
                                        <div className="arrange">
                                            <React.Fragment>
                                                <div className="arrange-title">
                                                <span className='arrange-title-header-dot'>
                                                </span>
                                                    <span className='arrange-title-header-date'>{currentDateList.length > 0 ? moment(currentDateList[0].date).format('YYYY-MM-DD'): ''}</span>
                                                </div>
                                                {
                                                    //只要选取的那天有课才会展示list
                                                    currentDateList.length > 0 &&
                                                    <div className="arrange-body">
                                                        {
                                                            (currentDateList || []).map((item,idx)=>
                                                                <ArrangeCalendarItem
                                                                    leaveBtn={this.leave}
                                                                    deleteBtn={this.delete}
                                                                    key={idx}
                                                                    course={item}
                                                                />
                                                            )
                                                        }
                                                    </div>
                                                }
                                            </React.Fragment>
                                        </div>
                                    </div>
                                }
                            </Col>
                        </Row>
                    </div>
                </div>
                <MultLeaveConfirm
                    dataSource={askLeaveDataSource}
                    onCancel={this.handleLeaveCancel}
                    onOk={this.handleLeaveOk}
                    showModal={showLeaveModal}/>
                <MyModal
                    visible={visible}
                    handleOk={this.handleDelete}
                    handleCancel={() => this.setState({visible: false})}
                    contentText={'是否确认删除课程？'}
                />
            </div>
        )
    }
}

export {CourseSelectionCalendar}
