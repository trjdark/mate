/**
 * Desc: 固定排课
 * User: Debby.Deng
 * Date: 2018/12/3,
 * Time: 下午7:45
 */
import * as React from "react";
import {scheduleWeekDay, weekSquareWidth} from "../../enum/schedule";
import {ColorTable} from "./colorTable";
import {TimeSider} from "./timeSider";
import {Form} from "antd";
import {Select, Option} from "../../../../component/select";
import {ListModal} from "@/ui/component/listModal";
import {AddTeachingCourse} from "./addCourse";
import {form} from "@/common/decorator/form";
import {Message} from "@/ui/component/message/message";
import {User} from "@/common/beans/user";
import moment from 'moment';
import {
    addWeekSchedule,
    deleteWeekSchedule,
    editWeekSchedule,
    getWeekSchedule
} from "@redux-actions/teaching/scheduleAction";
import {Consumer} from "@/common/decorator/context";
import {connect} from "@/common/decorator/connect";
import {
    selectScheduleCourse,
    selectScheduleRoom, selectScheduleRoomOnlyId
} from "@/saga/selectors/teaching/scheduleSelector";
import {ColorTableStyle} from "../common/setStyle";
import {ModalFooter} from "./modalFooter";
import EventProxy from "../../../../../common/utils/EventProxy";
import {Confirm} from "@/ui/component/customerCreateModal";
import {FUNC} from "@/ui/pages/setting/enum/functions";
import {selectTotalEmployeeList} from "@/saga/selectors/home";

const FormItem = Form.Item;
const isPostTransRole = User.permissionList.includes(FUNC['岗位转角色（非业务使用）'])
const selectInsOption = isPostTransRole
    ? {
        workingStatus: '1',
        roleList: ['INS', 'HI']
    }
    : {
        workingStatus: '1',
        postName: ["INS", 'HI']
    };

@form()
@connect(
    (state) => ({
        courseList: selectScheduleCourse(state),
        roomList: selectScheduleRoom(state),
        roomListOnlyId: selectScheduleRoomOnlyId(state),
        insList: selectTotalEmployeeList(state, selectInsOption),

    }),
    {}
)
class WeekSchedule extends React.Component<any, any> {
    weekSchedule: any;
    state = {
        firstOpen: true,
        scheduleList: [],       // 课程表
        showAdd: false,
        week: '',
        ins: '',
        activeCourseInfo: {},   // 点击排课的具体信息
        withDelete: false,
    };
    /**
     * 新增，编辑固定排课页面，点击保存
     */
    handleOk = () => {
        const {form} = this.props;
        const {week, withDelete} = this.state;
        const activeCourseInfo: any = this.state.activeCourseInfo;
        form.validateFields((err, values) => {
            if (!err) {
                const {startTime, courseLength, capacity, maxCapacity} = values;
                const endTime = moment(startTime, 'HH-mm').add(courseLength, 'm');
                if (maxCapacity < capacity) {
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
                const weekDayArr = scheduleWeekDay.filter((item) => (item.name === week));
                const weekDay = weekDayArr.length && weekDayArr[0].value;
                const params = Object.assign(
                    {},
                    values,
                    {
                        currentCenterId: User.currentCenterId,
                        weekDay: weekDay,
                        startTime: moment(startTime).format('HH:mm'),
                        endTime: moment(endTime).format('HH:mm')
                    },
                    {courseLength: null});

                if (withDelete) {// 编辑周课程
                    const editParams = Object.assign({}, params, {
                        id: activeCourseInfo.id,
                    });
                    const that=this;
                    Confirm({
                        content: '提交后将会更新当前时间之后所有临时课表信息，是否继续',
                        onOk() {
                            editWeekSchedule(editParams).then(() => {// 编辑成功后关闭弹窗
                                that.drawCourse();
                                that.setState({showAdd: false});
                            })
                        }
                    })
                } else {// 新增周课程
                    addWeekSchedule(params).then(() => {// 保存成功后关闭弹窗
                        this.drawCourse();
                        this.setState({showAdd: false});
                    })
                }


            }
        });
    };
    /**
     * 新增，编辑固定排课页面，点击取消
     */
    handleCancel = () => {
        this.setState({showAdd: false, activeCourseInfo: {}});
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
     * 增加固定排课
     */
    addCourse = (time, roomId, week) => {
        this.setState({
            showAdd: true,
            activeCourseInfo: {
                classroomId: roomId, ...this.getRoomCapacity(roomId)
            },
            week: week,
            withDelete: false
        });
    };
    /**
     * 编辑固定课程表
     */
    handleEditInfo = (squareInfo) => {
        const weekDay = scheduleWeekDay.filter((week) => (week.value === Number(squareInfo.weekDay)))[0].name;
        this.setState({activeCourseInfo: squareInfo, withDelete: true, showAdd: true, week: weekDay});
    };
    /**
     * 删除固定课程表
     */
    handleDelete = () => {
        const activeCourseInfo: any = this.state.activeCourseInfo;
        deleteWeekSchedule({
            currentCenterId: User.currentCenterId,
            id: activeCourseInfo.id
        }).then(() => {
            this.drawCourse();
            this.setState({showAdd: false});
        })
    };

    /**
     * 遍历生成每天课表
     */
    getWeekTable() {
        let {scheduleList} = this.state;
        const {roomListOnlyId} = this.props;
        if (!this.weekSchedule && roomListOnlyId.length) {
            this.weekSchedule = new ColorTableStyle({// 固定排课，格子定高宽
                originalTop: 44,
                xAxisArr: roomListOnlyId,
                width: weekSquareWidth,
                height: 50,
                defaultSquareColor: "#da291c",
            });
        }
        return scheduleList.map((res, index) => {
            if (this.weekSchedule) {
                this.weekSchedule.setStyle(res.classScheduleResponseList)
            }
            const weekDayArr = scheduleWeekDay.filter((week) => (week.value === Number(res.weekDay)));
            const weekDay = weekDayArr.length && weekDayArr[0].name;
            return (
                <ColorTable
                    key={index}
                    onEditSquare={this.handleEditInfo}
                    onEmptyClick={this.addCourse}
                    courseData={res.classScheduleResponseList}
                    week={weekDay}
                />
            )
        })
    }

    /**
     * 获取固定课程表
     */
    drawCourse = () => {
        getWeekSchedule({
            currentCenterId: User.currentCenterId,
            ins: this.state.ins,
        }).then((res) => {
            if (res instanceof Array) {
                this.setState({
                    scheduleList: res
                })
            }
        });
    };
    /**
     * 搜索ins对应的固定课程表
     */
    handleSearch = (value) => {
        this.setState({ins: value}, () => {
            this.drawCourse();
        });
    };

    /**
     * 定义gym-teaching-schedule-week-inner容器宽度
     */

    componentDidUpdate() {
        const {roomListOnlyId} = this.props;
        const {firstOpen} = this.state;
        const innerWrap: HTMLDivElement = document.querySelector('.gym-teaching-schedule-week-inner');
        if (roomListOnlyId.length && firstOpen && innerWrap) {
            innerWrap.style.width = Number(roomListOnlyId.length * 7 * weekSquareWidth) + 10 + "px";
            this.setState({
                firstOpen: false
            });
        }
    }

    componentDidMount() {
        this.drawCourse();
        EventProxy.on('weekScheduleRequest', this.drawCourse);
    }

    render() {
        const {form, insList, roomList} = this.props;
        const {activeCourseInfo, withDelete} = this.state;
        return (
            <Consumer>
                {commonParams => (
                    <div className='bgWhite gym-teaching-schedule-week'>
                        <FormItem label={'INS'} className='flex'>
                            <Select allowClear={true} onChange={this.handleSearch}>
                                {insList.map((item) => {
                                    return (
                                        <Option key={item.staffId} value={item.staffId}>
                                            {item.englishName}{item.chineseName}
                                        </Option>
                                    )
                                })}
                            </Select>
                        </FormItem>
                        <div className='pos_rel gym-teaching-schedule-table-sider clear'>
                            <TimeSider/>
                            {
                                roomList.length ?
                                    <div className='gym-teaching-schedule-week-outer clear'>
                                        <div className='gym-teaching-schedule-week-inner flex'>
                                            {this.getWeekTable()}
                                        </div>
                                    </div> : ''
                            }
                        </div>
                        <ListModal
                            visible={this.state.showAdd}
                            closable={true}
                            width={'840px'}
                            maskClosable={true}
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
                                form={form}
                                withDelete={withDelete}
                                type={`week`}
                                time={this.state.week}
                                courseInfo={activeCourseInfo}
                            />
                        </ListModal>
                    </div>
                )}
            </Consumer>
        )
    }

}

export {WeekSchedule}
