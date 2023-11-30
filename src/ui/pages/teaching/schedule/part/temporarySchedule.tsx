/**
 * Desc: 临时排课
 * User: Debby.Deng
 * Date: 2018/12/4,
 * Time: 下午2:47
 */
import * as React from "react";
import {TimeSider} from "./timeSider";
import {Form} from "antd";
import {ColorTable} from "./colorTable";
import {AddGymGuard} from "../../component/addGymGuardButton";
import {ListModal} from "@/ui/component/listModal";
import {AddTeachingCourse} from "./addCourse";
import {form} from "@/common/decorator/form";
import {ColorTableStyle} from "../common/setStyle";
import {User} from "@/common/beans/user";
import moment from 'moment';
import {
    addDaySchedule,
    editDaySchedule,
    getTemporarySchedule,
    removeWeekSchedule
} from "@redux-actions/teaching/scheduleAction";
import {connect} from "@/common/decorator/connect";
import {selectScheduleRoom, selectScheduleRoomOnlyId} from "@/saga/selectors/teaching/scheduleSelector";
import {Message} from "@/ui/component/message/message";
import {ModalFooter} from "./modalFooter";
import {Provider} from "@/common/decorator/context";
import EventProxy from "../../../../../common/utils/EventProxy";
import {CommonUtils} from "@/common/utils/commonUtils";
import {DateInput} from "@/ui/component/datePicker";
import {FUNC} from "@/ui/pages/setting/enum/functions";

const FormItem = Form.Item;

interface Props {
    [propsName: string]: any,
}

@form()
@connect(
    (state) => ({
        roomList: selectScheduleRoom(state),
        roomListOnlyId: selectScheduleRoomOnlyId(state),
    }),
    {}
)
class TemporarySchedule extends React.Component<Props, any> {
    daySchedule: any;
    fromGymGuard = CommonUtils.hasParams(this.props) ? CommonUtils.parse(this.props).fromGymGuard : undefined;
    state = {
        time: moment().valueOf(),
        courseList: [],         // 临时课程
        showAdd: false,
        activeCourseInfo: {},   // 点击排课的具体信息
        withDelete: false,
        isHoliday: false,       // 是否节假日
    };

    /**
     * 保存课程
     * @returns {any}
     */
    handleOk = () => {
        const {form} = this.props;
        const {time, withDelete, activeCourseInfo}:any = this.state;
        form.validateFields((err, values) => {
            if (!err) {
                const {startTime, courseLength, capacity, maxCapacity} = values;
                const endTime = moment(startTime, 'HH-mm').add(courseLength, 'm');

                if (maxCapacity < capacity ) {
                    Message.error('最大人数不能小于标准人数');
                    return;
                }
                const endHH = Number(moment(endTime).format('HH'));
                const endmm = Number(moment(endTime).format('mm'));
                if (endHH >= 21) {
                    if (!(endHH === 21 && endmm === 0)) {
                        Message.error('课程结束时间不能大于21点');
                        return;
                    }
                }
                const params = Object.assign(
                    {},
                    values,
                    {
                        currentCenterId: User.currentCenterId,
                        date: time,
                        startTime: moment(startTime).format('HH:mm'),
                        endTime: moment(endTime).format('HH:mm')
                    },
                    {courseLength: null, datePicker: null}
                );

                if (withDelete) {   // 编辑周课程
                    const editParams = Object.assign({}, params, {
                        classScheduleId: activeCourseInfo.classScheduleId,
                        id: activeCourseInfo.lessonId,
                    });
                    editDaySchedule(editParams).then((res) => {
                        this.drawCourse();
                        this.setState({showAdd: false});
                    });
                } else {    // 新建周课程
                    addDaySchedule(params).then(() => {     // 保存成功后关闭弹窗
                        this.drawCourse();
                        this.setState({showAdd: false});
                    });
                }
            }
        });
    };

    handleCancel = () => {
        this.setState({showAdd: false, activeCourseInfo: {}});
    };

    /**
     * 删除课程
     * @returns {any}
     */
    handleDelete = () => {
        const {activeCourseInfo, time}:any = this.state;
        const params = {
            currentCenterId: User.currentCenterId,
            classScheduleId: activeCourseInfo.classScheduleId,
            date: time,
            id: activeCourseInfo.lessonId,
        };
        removeWeekSchedule(params).then(() => {
            this.drawCourse();
            this.setState({showAdd: false});
        })
    };

    /**
     * 通过roomId获取教室标准容量和最大容量
     * @param roomId
     * @returns {capacity,maxCapacity}
     */
    getRoomCapacity = (roomId) => {
        const {roomList} = this.props;
        const cRoom = roomList.filter((room) => (room.id === roomId))[0];
        return {
            capacity: cRoom.capacity,
            maxCapacity: cRoom.maxCapacity,
        }
    };

    /**
     * 点击空白位置添加课程
     * @param time:几点
     * @param roomId: 教室id
     * @param week: 日期时间戳
     * @returns {any}
     */
    addCourse = (time, roomId, week) => {
        this.setState({
            showAdd: true, activeCourseInfo: {
                classroomId: roomId, ...this.getRoomCapacity(roomId)
            }, withDelete: false
        });
    };

    /**
     * 切换日期
     * @param date
     * @returns {any}
     */
    changeDate = (date) => {
        this.setState({time: date.valueOf()}, () => {
            this.drawCourse();
        });
    };

    /**
     * slideTitle切换日期
     * @param date:毫秒
     * @returns {any}
     */
    switchDate = (date) => {
        const {form} = this.props;
        this.setState({time: date}, () => {
            this.drawCourse();
            form.setFieldsValue({datePicker: moment(date)})
        });
    };

    /**
     * 点击具体课程callback
     * @param squareInfo:点击课程的具体信息
     * @returns {any}
     */
    handleEditInfo = (squareInfo) => {
        this.setState({activeCourseInfo: squareInfo, withDelete: true, showAdd: true});
    };

    getTable() {
        const {time, courseList, isHoliday} = this.state;
        const {roomListOnlyId} = this.props;
        const table = document.querySelectorAll('.gym-teaching-schedule-temporary table');

        if (!this.daySchedule && roomListOnlyId.length) {
            this.daySchedule = new ColorTableStyle({  // 临时排课，高宽随屏幕变化
                originalTop: 42,
                xAxisArr: roomListOnlyId,
                width: 250,
                table: table[0],
                height: 50,
                display: 'bigSize',
                defaultSquareColor: '#E3F9FF',
            });
        }

        return (
            <ColorTable
                onEditSquare={this.handleEditInfo}
                onEmptyClick={this.addCourse}
                courseData={courseList}
                isBlock={true}
                week={time}
                isHoliday={isHoliday}
            />
        )
    }

    /**
     * 请求后台数据重新绘画排课表
     * @returns {any}
     */
    drawCourse = () => {
        getTemporarySchedule({
            currentCenterId: User.currentCenterId,
            date: this.state.time
        }).then((res) => {
            let {lessonList, isHoliday} = res;
            lessonList = lessonList || [];
            if (lessonList instanceof Array) {
                if (this.daySchedule) {
                    this.daySchedule.setStyle(lessonList);
                }
                this.setState({
                    courseList: lessonList,
                    isHoliday
                })
            }
        });
    };

    componentDidMount() {
        const {roomListOnlyId} = this.props;
        // 表格宽度设置
        const table: any = document.querySelectorAll('.gym-teaching-schedule-temporary table')[0];
        table && (table.style.width = 250 * (roomListOnlyId.length) + 'px');
        // slideTitle宽度设置
        const title: any = document.querySelectorAll('.gym-teaching-slide-title')[0];
        if (roomListOnlyId.length && title.clientWidth >= 250 * (roomListOnlyId.length)) {
            title.style.width = 250 * (roomListOnlyId.length) + 'px';
        }
        this.drawCourse();
        EventProxy.on('temporaryRequest', this.drawCourse);
    }

    /**
     * 权限控制
     * @param func key
     */
    isExist = (funcId) => {
        const permissionList = User.permissionList;
        return permissionList.includes(funcId)
    };

    render() {
        const {form, roomList} = this.props;
        const {getFieldDecorator} = form;
        const {time, activeCourseInfo, withDelete, isHoliday} = this.state;
        const providerValue = {
            switchDate: this.switchDate
        };
        return (
            <Provider value={providerValue}>
                <div className='bgWhite gym-teaching-schedule-temporary bgWhite pos_rel'>
                    <FormItem label={'日期选择'} className='flex'>
                        {
                            getFieldDecorator(`datePicker`, {
                                initialValue: moment()
                            })(
                                <DateInput allowClear={false} onChange={this.changeDate}/>
                            )
                        }
                        {isHoliday &&
                        <span className='gym-teaching-schedule-signin-warning ml10'>* 节假日不能进行任何操作 </span>}
                    </FormItem>
                    {
                        this.isExist(`${FUNC[`GYM Guard`]}`) &&
                        <div className='gym-teaching-schedule-temporary-gym-guard'>
                            <AddGymGuard fromGymGuard={this.fromGymGuard}/>
                        </div>
                    }
                    <div className='pos_rel gym-teaching-schedule-table-sider clear'>
                        {roomList.length ?
                            <TimeSider/> : ''}
                        <div className='gym-teaching-schedule-table-content'>
                            {this.getTable()}
                        </div>

                    </div>
                    <ListModal
                        visible={this.state.showAdd}
                        closable={true}
                        maskClosable={true}
                        width={'840px'}
                        handleCancel={this.handleCancel}
                        footer={
                            <ModalFooter
                                curseInfo={activeCourseInfo}
                                onOk={this.handleOk}
                                onDelete={this.handleDelete}
                                onCancel={this.handleCancel}
                                withDelete={withDelete}
                            />
                        }
                        destroyOnClose={true}
                    >
                        <AddTeachingCourse
                            type={`day`}
                            withDelete={withDelete}
                            time={`${moment(time).format('YYYY-MM-DD')}`}
                            form={form}
                            courseInfo={activeCourseInfo}
                        />
                    </ListModal>
                </div>
            </Provider>
        )
    }
}

export {TemporarySchedule}
