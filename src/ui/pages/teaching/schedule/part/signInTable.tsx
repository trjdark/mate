/**
 * Desc: 上课签到
 * User: Debby.Deng
 * Date: 2018/12/4,
 * Time: 下午4:11
 */
import * as React from "react";
import {Form, Table} from "antd";
import {TimeSider} from "./timeSider";
import timeLine, {bookWay, signInStatus} from "../../enum/schedule";
import {SlideTitle} from "../../component/slideTitle";
import history from '@/router/history';
import {TeachingRoutes} from "@/router/enum/teachingRoutes";
import {CommonUtils} from "@/common/utils/commonUtils";
import moment from "moment";
import {form} from "@/common/decorator/form";
import {User} from "@/common/beans/user";
import {bulkPrint, getSignInList, changeCheckInTime} from "@redux-actions/teaching/scheduleAction";
import {connect} from "@/common/decorator/connect";
import {
    selectScheduleRoom,
    selectScheduleRoomOnlyId,
    selectChenInTime
} from "@/saga/selectors/teaching/scheduleSelector";
import _ from 'lodash';
import { clearTeachingInit, teachingInit } from "@redux-actions/teaching/scheduleAction";
import EventProxy from "../../../../../common/utils/EventProxy";
import {Message} from "@/ui/component/message/message";
import {DateInput} from "@/ui/component/datePicker";

const FormItem = Form.Item;

interface PropsSet {
    [propsName: string]: any,
}

@form()
@connect(
    (state) => ({
        roomList: selectScheduleRoom(state),
        roomListOnlyId: selectScheduleRoomOnlyId(state),
        checkInTime: selectChenInTime(state)
    }),
        { changeCheckInTime, teachingInit, clearTeachingInit}
)
class SignInTable extends React.Component<PropsSet, any> {
    colorChoice = {
        lightBlue: '#E3F9FF',
        grey: '#EBEFF3'
    };

    // 转换成映射
    bookWayEnum = _.keyBy(bookWay, (item) => {
        return item.value
    });

    // 转换成映射
    signInStatusEnum = _.keyBy(signInStatus, item => (item.value));
    constructor(props:any){
        super(props)
        this.state = {
            time: props.checkInTime.lastCheckInTime ? props.checkInTime.lastCheckInTime : moment().startOf('day').valueOf(),
            signInList: [],
            heightArr: [],
            isBeforeToday: props.checkInTime.lastCheckInTime ? this.isBeforeToday(props.checkInTime.lastCheckInTime) : false,
            isHoliday: false,
            isBulkPrint: false,// 避免短时间多次点击打印多次
        }
    }
    // 转到详情页
    toDetailRoute = (params) => {
        const {isHoliday} = this.state;
        if (!isHoliday) {
            history.push(`${TeachingRoutes.签到.link}${CommonUtils.stringify(params)}`)
        }
    };

    /**
     * 登录的GB，GA分配的宝宝会显示高亮
     * @param code：后台返回选课状态数字
     * @param isWaiting：是否等位，字符0，1 表示
     * @returns {any}
     */
    parseBookWay = (code, isWaiting) => {
        const value = this.bookWayEnum[code].name;
        if (Number(isWaiting)) {
            return 'W'
        } else if (value === 'P') {// 试听高亮
            return (<span className='gym-teaching-schedule-signin-students-active'>{value}</span>)
        } else {
            return value;
        }
    };

    /**
     * 登录的GB，GA分配的宝宝会显示高亮
     * @param gaStaffId
     * @param gbStaffId
     * @param name
     * @returns {any}
     */
    parseName = (gaStaffId, gbStaffId, name) => {
        const {userId} = User;
        if (userId === gaStaffId || userId === gbStaffId) {
            return (
                <span className='gym-teaching-schedule-signin-students-active'>
                    {name}
                </span>
            )
        } else {
            return name
        }
    };
    /**
     * 生成table里面的选课详情
     * @param recordInfo: 每个单元格数据
     * @param index: 遍历索引
     * @returns {any}
     */
    getDom = (recordInfo, index?) => {
        const { time, isBeforeToday, isHoliday} = this.state;
        const {
            lessonId, classScheduleId, courseCode, startTime, endTime,
            selectedStuNum, primaryInsStaffName, babyList, assistantInsStaffName,
        } = recordInfo;
        return (
            <div
                className={`text-c gym-teaching-schedule-signin-students ${isHoliday ? '' : 'pointer'}`}
                style={{background: `${isBeforeToday ? this.colorChoice.grey : this.colorChoice.lightBlue}`}}
                key={`${index ? index : ''}`}
                onClick={this.toDetailRoute.bind(this, {
                    date: time,
                    lessonId: lessonId,
                    scheduleId: classScheduleId,
                })}
            >
                <p>
                    <span className='size18 mr5'>{courseCode}</span>
                    <span
                        className='gym-teaching-schedule-signin-students-common-color'
                    >
                        {`${startTime}-${endTime}`}
                    </span>
                </p>
                <p className='gym-teaching-schedule-signin-students-common-color'>{`选课人数：${selectedStuNum}`}</p>
                <p className='gym-teaching-schedule-signin-students-common-color'>{`主教: ${primaryInsStaffName}`}</p>
                {
                    assistantInsStaffName ?
                        <p className='gym-teaching-schedule-signin-students-common-color'>{`助教: ${assistantInsStaffName}`}</p> : null
                }
                <ul className='gym-teaching-schedule-signin-students-light-color'>
                    {
                        (babyList || []).map((stu, index) => {
                            const {gaStaffId, gbStaffId, babyName, bookWay, isWaiting, attendanceStatus} = stu;
                            return (
                                <li key={index} className='gym-teaching-schedule-signin-students-li'>
                                    <span className='gym-teaching-schedule-signin-name'>
                                        {this.parseName(gaStaffId, gbStaffId, babyName)}
                                    </span>
                                    <span className='ml5 gym-teaching-schedule-signin-bookWay'>
                                        {this.parseBookWay(bookWay, isWaiting)}
                                    </span>
                                    <span className='ml5 gym-teaching-schedule-signin-status'>
                                        {this.signInStatusEnum[attendanceStatus].name}
                                    </span>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        )
    };

    /**
     * columns里面的render函数
     * @param roomId:教室id
     * @param text:当前td的值
     * @param record:当前行record
     * @returns {any}
     */
    renderInnerTableContent = (roomId, text, record) => {
        const recordInfoArr = record[roomId];
        let content = null;
        if (recordInfoArr && recordInfoArr.length > 1) {
            content = recordInfoArr.map((record, index) => (this.getDom(record, index)))
        } else if (recordInfoArr && recordInfoArr.length === 1) {
            content = this.getDom(recordInfoArr[0])
        }
        return recordInfoArr ? (<div>{content}</div>) : <div style={{minHeight: '30px'}}/>;
    };

    /**
     * 生成table
     * @returns {any}
     */
    getTable = () => {
        const {signInList} = this.state;
        const {roomList} = this.props;
        const tdWidth = 230;    // 表格定宽
        const columns = roomList.map((room) => {
            return {
                title: room.classroomName,
                dataIndex: room.id,
                width: tdWidth,
                key: room.id,
                align: 'center',
                render: this.renderInnerTableContent.bind(this, room.id)
            }
        });
        const len = columns.length;     // 教室数量

        return (
            <Table
                pagination={false}
                rowKey={`id`}
                columns={columns}
                scroll={{x: len > 5 ? tdWidth * len : 0}}
                dataSource={this.parseSignInList(signInList)}
            />
        )
    };

    /**
     * 计算在当前时间前或者后
     * @param time:时间戳
     * @returns {any}
     */
    isBeforeToday = (time) => {
        return moment().startOf('day').valueOf() - time > 0;
    };

    /**
     * slideTitle切换日期
     * @param date:毫秒
     * @returns {any}
     */
    switchDate = (date) => {
        this.props.changeCheckInTime(moment(date));
        const {form} = this.props;
        this.setState({time: date, isBeforeToday: this.isBeforeToday(date)}, () => {
            form.setFieldsValue({datePicker: moment(date)});
            this.searchList();
        });
    };

    /**
     * 切换日期
     * @param date
     * @returns {any}
     */
    changeDate = (date) => {
        this.props.changeCheckInTime(date);
        this.setState(
            {
                time: date.startOf('day').valueOf(),
                isBeforeToday: this.isBeforeToday(date.valueOf())
            },
            () => {
                this.searchList();
            }
        );
    };

    /**
     * 将后台返回数据解析为table的dataSource
     * @param res:后台返回data
     * @returns {any}
     */

    parseSignInList = (res) => {
        // 将后台返回数组arr<value>中value，解析为key:教室ID， value：value的数组
        function getObjArr(arr) {
            return _.groupBy(arr, (value) => (value.classroomId))
        }

        const dataSource = [];
        const resObj = _.keyBy(res, (value) => {
            return `${value.hour}`;
        });

        timeLine.map((time, index) => {
            const timeFormat = time.split(':')[0];
            const timeSignList = resObj[timeFormat];
            if (timeSignList) {
                dataSource.push(Object.assign({}, {id: time}, getObjArr(timeSignList.lessonList)));
            } else {
                dataSource.push({id: time});
            }
        });

        return dataSource;
    };

    /**
     * 根据日期搜索签到数据
     * @returns {any}
     */
    searchList = () => {
        const {time} = this.state;
        const params = {
            currentCenterId: User.currentCenterId,
            date: time
        };
        try {
            getSignInList(params).then(
                (res) => {
                    const {signInLessonList, isHoliday} = res;
                    this.setState(
                        {signInList: signInLessonList || [], isHoliday},
                        () => {
                            // 表格渲染成功后，根据表格各行的高度，重新计算时间线的位置
                            window.setTimeout(
                                () => {
                                    const trEle = document.querySelectorAll('.gym-teaching-schedule-signin-table-sider table tbody tr');
                                    let arr = Array.from(trEle).map((tr) => tr.clientHeight);
                                    this.setState({heightArr: arr});
                                },
                                200
                            );
                        }
                    );
                },
                (err) => {
                    //超时或接口报错清空list数据
                    this.setState({signInList:[],issHoliday:false},() => {
                        // 表格渲染成功后，根据表格各行的高度，重新计算时间线的位置
                        window.setTimeout(
                            () => {
                                const trEle = document.querySelectorAll('.gym-teaching-schedule-signin-table-sider table tbody tr');
                                let arr = Array.from(trEle).map((tr) => tr.clientHeight);
                                this.setState({heightArr: arr});
                            },
                            200
                        );
                    });
                });
        } catch (err) {

        }
    };

    /**
     * 批量打印
     * @returns {any}
     */
    handleBulkPrint = () => {
        const {time, signInList} = this.state;
        const params = {
            currentCenterId: User.currentCenterId,
            date: time,
        };
        try {
            if (signInList && signInList.length) {// 当天有排课
                bulkPrint(params);
            } else {
                Message.warning('当天没有排课,无法打印');
            }
        } catch (err) {
            console.log(err);
        }
    };

    componentDidMount() {
        this.searchList();
        EventProxy.on('signInRequest', this.searchList);
    }

    render() {
        const {form, roomList} = this.props;
        const {time, heightArr, isHoliday} = this.state;
        const {getFieldDecorator} = form;
        return (
            <div className='bgWhite gym-teaching-schedule-signin bgWhite'>
                <div className='pos_rel mb20'>
                    <FormItem label={'日期选择'} className='flex'>
                        {
                            getFieldDecorator(`datePicker`, {
                                initialValue:moment(time)
                            })(
                                <DateInput allowClear={false} onChange={this.changeDate}/>
                            )
                        }
                        {isHoliday &&
                        <span className='gym-teaching-schedule-signin-warning ml10'>* 节假日不能进行任何操作 </span>}
                    </FormItem>
                    <button
                        className='gym-button-wBlue-lg gym-teaching-schedule-signin-bulk-print pointer'
                        onClick={_.throttle(this.handleBulkPrint, 500, {trailing: false})}
                        disabled={isHoliday===true?true:false}
                    >
                        批量打印签到表
                    </button>
                </div>

                <div className='pos_rel gym-teaching-schedule-signin-table-sider clear'>
                    {roomList.length ? <TimeSider timeHeight='autoSize' hArr={heightArr}/> : ''}
                    <SlideTitle timeStamp={time} onResetDate={this.switchDate}/>
                    {this.getTable()}
                </div>
            </div>
        )
    }
}

export {SignInTable}
