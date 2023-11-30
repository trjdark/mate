/**
 * Desc: 选课试听预定提交
 * User: dave.zhang
 */
import React, {Fragment, Component} from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {ReserveRow} from '../component/selectCourseRow';
import {Checkbox, Button, Row, Radio, message} from 'antd';
import {connect} from "@/common/decorator/connect";
import {cloneDeep} from 'lodash';
import {
    getBackupLessonListNew,
    submitChangeCourse,
    preselectionList,
    getCenterConfig,
    getTeachContractList
} from '@redux-actions/teaching/chooseLesson';
import {CommonUtils} from '@/common/utils/commonUtils'
import {crowdType} from '../enum/selectCourse';
import {User} from "@/common/beans/user";
import {Provider} from '../selection/context';
import {getSubmitToReservation} from '@/saga/selectors/teaching/choose';
import {modalWrapper} from '@/ui/pages/teaching/component/modalWrapper';
import {ReservationContent} from './part/reservationContent';
import {NoCourseNum} from './part/noCourseNum';
import {Routes} from "@/router/enum/routes";
import {transWeekday} from "./common";
import moment from 'moment';
import history from '@/router/history';
import {getSelectCourseList} from "@redux-actions/teaching/courseSelection";

const CheckboxGroup = Checkbox.Group;
const Modal = modalWrapper(ReservationContent);
const ModalNoNum = modalWrapper(NoCourseNum);

@connect(state => ({params: getSubmitToReservation(state)}), {})
class ReserveSubmitNew extends Component<any, any> {
    private couldSubmit = true;  // 提交按钮是否可用 默认情况下可用
    constructor(props) {
        super(props);
        const { currContract, babyInfo, leadsId, cacheCourseList, promoteType, exchangeClassNum,} = CommonUtils.parse(this.props);
        const crowdTypeName = crowdType.map(i => i.name);
        const oldCourseInfo = getSelectCourseList();
        this.state = {
            crumb: [
                {name: '客户360', path: '', link: '#', id: 'client360'},
                {
                    name: currContract ? '选课' : '试听',
                    path: '',
                    link: '#',
                    id: 'selection'
                },
            ],
            babyInfo: babyInfo || {},                   // 宝宝信息
            currContract: currContract || null,         // 当前合同
            leadsId: leadsId || '',                     // leadsId
            cacheCourseList: cacheCourseList || [],
            courseList: [],                             // 课程list
            weeklist: [],                               // 周课程list
            promoteType: promoteType,                   // 选课类型

            // checkbox 拥挤程度
            options: crowdTypeName,
            indeterminate: false,
            checkAll: true,
            checkedList: crowdTypeName,

            submitVisible: false,                       // 提交预览可见
            submitlist: [],                             // 已选定即将提交的课程
            noNumVisible: false,
            noNumMessage: '',                           // 课时数不足时的提示信息
            enablePreviewApproval: undefined,           // 是否需要审批
            selectedCourseNum: 0,                        // 本次已选课程
            exchangeClassNum: exchangeClassNum,          // 本次可换课课时
            oldCourseInfo: oldCourseInfo,                      // 原课程列表
        }
    }
    componentDidMount() {
        this.search();
        // 获取中心是否设置审批
        getCenterConfig({
            centerId: User.currentCenterId,
            currentCenterId: User.currentCenterId
        }).then(res => {
            this.setState({enablePreviewApproval: res.enablePreviewApproval})
        });
        // 获取课程包
        getTeachContractList({
            currentCenterId: User.currentCenterId,
            leadsId: this.state.leadsId
        }).then((res) => {
            const {currContract} = this.state;
            let contract = res.filter(_c =>
                _c.contractId === currContract.contractId
            )[0];
            this.setState({currContract: contract ? contract : null})
        })
    }
    /**
     * Desc 控制拥挤程度 checkbox
     * @param checkedList   选中的选项
     * @returns {any}
     */
    onCrowdedChange = (checkedList) => {
        const {options} = this.state;
        this.setState({
            checkedList,
            indeterminate: checkedList.length && (checkedList.length < options.length),
            checkAll: checkedList.length === options.length,
        });
    };

    /**
     * Desc 控制拥挤程度 checkbox
     * @param e 事件对象
     * @returns {any}
     */
    onCheckAllChange = (e) => {
        const {options} = this.state;
        const checked = e.target.checked;
        this.setState({
            checkedList: checked ? options : [],
            indeterminate: false,
            checkAll: checked,
        });
    };

    /**
     * Desc 课程全选、反选
     * @param colIdx 循环课程列表时的索引
     * @param e 事件对象
     * @returns {any}
     */
    onCheckAllChangeCourse = (colIdx, e) => {
        let {indeterminate} = this.getAllCourseColCheckedStatus(colIdx);
        let list = cloneDeep(this.state.weeklist);

        // 非半选中状态下，正选反选
        if (!indeterminate) {
            list.forEach((row, rowIdx) => {
                let _list = row.list;
                // 当前列的所有 checkbox 批量逻辑：
                if (!_list[colIdx].disabled && _list[colIdx].date) {
                    this.onChangeCheckbox({weekidx: rowIdx, idx: colIdx})
                }
            })
        }

        // 半选中状态下，只能选中所有
        if (indeterminate && e.target.checked) {
            list.forEach((row, rowIdx) => {
                let _list = row.list;
                // 当前列的所有 checkbox 批量逻辑：
                if (!_list[colIdx].disabled && _list[colIdx].date) {
                    this.onChangeCheckbox({weekidx: rowIdx, idx: colIdx, force: true})
                }
            })
        }
    };

    /**
     * Desc 设置课程行 checkbox 的选择状态：
     * @param idx 循环课程列表时的索引
     * @returns {any}
     */
    getAllCourseColCheckedStatus = (idx) => {
        let list = this.state.weeklist;
        // 得到课程列中选中的 checkbox 个数
        let ff = list.filter((row, rowIdx) => {
            let course = row.list[idx];
            return (course.date && !course.disabled && course.checked)
        });
        // 得到课程列中可选的 checkbox 最大数
        let ffmax = list.filter((row, rowIdx) => {
            let course = row.list[idx];
            return (course.date && !course.initDisabled)
        });
        let indeterminate = (ff.length > 0 && ff.length < ffmax.length);
        let checkedAll = (ff.length === ffmax.length && ff.length > 0);
        return {indeterminate, checkedAll}
    };

    /**
     * Desc 查询课程数据
     */
    search = () => {
        const {checkedList, babyInfo, currContract, leadsId, cacheCourseList, promoteType, oldCourseInfo} = this.state;
        let crowdTypeList = checkedList.map(i => crowdType.filter(j => j.name === i)[0].value);
        let isHoliday = crowdTypeList.some(i => i === 'holiday');
        if (currContract) {
            // 有合同选课
            getBackupLessonListNew({
                babyId: babyInfo.babyId,
                classScheduleIdList: cacheCourseList.map(i => i.classScheduleId),
                contractId: currContract.contractId,
                crowdTypeList,
                currentCenterId: User.currentCenterId,
                leadsId,
                isHoliday: isHoliday,
                promoteType,
                lessonIdList: oldCourseInfo.map(item => item.lessonId)
            }).then(res => {
                this.setState({
                    courseList: this.getCourseList(res),
                    weeklist: this.getWeekList(res)
                })
            })
        } else {
            // 没有合同试听
            preselectionList({
                babyId: babyInfo.babyId,
                classScheduleIdList: cacheCourseList.map(i => i.classScheduleId),
                currentCenterId: User.currentCenterId,
                leadsId,
                promoteType,
            }).then(res => {
                this.setState({
                    courseList: this.getCourseList(res),
                    weeklist: this.getWeekList(res)
                })
            })
        }

    };

    /**
     * Desc 周次选择的 checkbox 事件
     * @param {any}
     * @returns {any}
     */
    onChangeCheckbox = ({weekidx, idx, force = false}) => {
        let list = this.state.weeklist;
        // 当前 checkbox 非 disabled 情况下
        const item = list[weekidx].list[idx];
        if (!item.disabled && item.date) {
            // 有force强制force，否则反选
            const status = force ? force : !item.checked;
            item.checked = status;
            this.setState({weeklist: list}, () => {
                // 处理当前 checkbox 同周的 checkbox
                this.handleCurrWeekCheckboxStatus({weekidx, idx, status})
            })
        }
    };

    /**
     * Desc 周次选择 radio
     * @param {any}
     * @returns {any}
     */
    onChangeRadio = ({weekidx, idx, e}) => {
        let list = this.state.weeklist;
        list.map((week, _weekidx) => {
            return week.list.map((date, _idx) => {
                if (weekidx === _weekidx && idx === _idx) {
                    date.checked = true;
                    return date;
                } else {
                    // 判断是否 disabled
                    if (date.disabled) {
                        return date;
                    } else {
                        date.checked = false;
                        return date;
                    }
                }
            })
        });
        this.setState({weeklist: list},()=>{
           this.calculateSubmitList(list);  // 计算已选课程
        });
    };

    /**
     * Desc 处理当前周 checkbox 逻辑
     * @param {any}
     * @returns {any}
     */
    handleCurrWeekCheckboxStatus = ({weekidx, idx, status}) => {
        let weeklist = this.state.weeklist;
        let currlist = this.state.weeklist[weekidx].list;
        let courseList = this.state.courseList;

        // 课程列的对应时间转换对象：
        let time = this.getCourseTimeStartEnd(currlist[idx].date, courseList[idx]);

        let newlist = [];

        if (status) {
            // 选中操作
            newlist = currlist.map((course, _idx) => {
                // 根本没有日期 => 没有 checkbox
                if (!course.date) {
                    return course;
                }
                // 当前选中项与遍历项为同一项时：
                if (_idx === idx) {
                    return course;
                } else {
                    let _time = this.getCourseTimeStartEnd(course.date, courseList[_idx]);
                    // 当前选中项与遍历项在同一时间段内：
                    if (this.withinSameTimeRange(time, _time)) {
                        course.disabled = true;
                        return course;
                    } else {
                        return course;
                    }
                }
            })

        } else {
            // 取消选中操作
            newlist = currlist.map((course, _idx) => {
                // 根本没有日期 => 没有 checkbox
                if (!course.date) {
                    return course;
                }
                // 当前选中项与遍历项为同一项时：
                if (_idx === idx) {
                    return course;
                }
                // 非 disabled 状态时，遍历项不变化状态
                if (!course.disabled) {
                    return course;
                }
                // 初始为 disabled 状态时，不变话状态
                if (course.initDisabled) {
                    return course;
                }

                let _time = this.getCourseTimeStartEnd(course.date, courseList[_idx]);
                // 当前选中项与遍历项在同一时间段内：
                if (this.withinSameTimeRange(time, _time)) {

                    // 当前项 enable 之前判断是否与同周次的其他已经选择项在同一时间段
                    let cachelist = currlist.filter((course, idx) => {
                        // 遍历项为 check 项或者自身
                        if (idx === _idx || idx === idx) {
                            return false;
                        }
                        // 非选中状态
                        if (!course.checked) {
                            return false;
                        }
                        let newTime = this.getCourseTimeStartEnd(course.date, courseList[idx]);
                        return this.withinSameTimeRange(newTime, _time)
                    });

                    // 与其他项没有冲突，可以 enable 当前项
                    if (cachelist.length <= 0) {
                        course.disabled = false
                    }
                    return course;
                } else {
                    return course;
                }
            })
        }

        // 重新设置 weeklist
        weeklist[weekidx].list = newlist;
        this.setState(
            {weeklist},
            ()=>{
                this.calculateSubmitList(this.state.weeklist);
            }
        );
    };

    /**
     * des 计算选定的课程和已选择的课时数
     * @param list 周课程
     */

    calculateSubmitList = (list) => {
        let submitlist = [];      // 储存选定的课程
        let totalClassHour = 0;   // 选定的课时数
        list.forEach((row, rowIdx) => {
            let _list = row.list;
            _list.forEach((course, idx) => {
                let classScheduleId = course.classScheduleId;

                // 判断是否要push
                if (!course.date || course.initDisabled || !course.checked) {
                    return;
                }

                // 判断 submitlist 中是否有当前遍历课程的 classScheduleId
                let filteredArr = submitlist.filter(col => col.classScheduleId === classScheduleId);

                // course 的时间戳
                let courseCopy = Object.assign({}, course);
                courseCopy.date = moment(courseCopy.date).valueOf();

                // 有则向list中push课程
                if (filteredArr.length > 0) {
                    let lessonDetailList = filteredArr[0].lessonDetailList;
                    lessonDetailList.push(courseCopy);
                    submitlist.map(col => {
                        if (col.classScheduleId === courseCopy.classScheduleId) {
                            col.lessonDetailList = lessonDetailList;
                            return col;
                        } else {
                            return col;
                        }
                    })
                    // 没有，新增对应的 id 和 list
                } else {
                    submitlist.push({classScheduleId, lessonDetailList: [courseCopy]})
                }
            })
        });
        submitlist.forEach(item => {
            const {lessonDetailList} = item;
            lessonDetailList.forEach(list => {
                totalClassHour += list.classHourNum;
            });
        });
        this.setState({
            submitlist,
            selectedCourseNum: totalClassHour,
        })
    };

    /**
     * desc 把传入的课程的时间转换成对象
     */
    getCourseTimeStartEnd = (date, course) => {
        return {
            startstamp: moment(`${date} ${course.start}:00`).valueOf(),
            endstamp: moment(`${date} ${course.end}:00`).valueOf(),
        }
    };

    /**
     * Desc 判断两个时间对象是否有交集
     * @param time _time 时间对象
     * @param _time 时间对象
     * @returns {any}
     */
    withinSameTimeRange = (time, _time) => {
        if (time.startstamp >= _time.endstamp) {
            return false
        }
        return time.endstamp > _time.startstamp;
    };

    getCourseList = (res) => {
        let {cacheCourseList} = this.state;
        return res.map(course => {
            let courseMsg = cacheCourseList.filter(_c => _c.classScheduleId === course.classScheduleId)[0];
            return {
                name: courseMsg.courseCode,
                date: `周${transWeekday(courseMsg.weekDay)}`,
                start: `${courseMsg.startTime}`,
                end: `${courseMsg.endTime}`,
                classroom: courseMsg.classroomName,
                teacher: courseMsg.primaryInsStaffName,
                classScheduleId: courseMsg.classScheduleId
            }
        })
    };

    /**
     * Desc 解析接口数据结构
     * @param list 课程数据
     * @returns {any}
     */
    getWeekList = (list) => {
        let maxWeek = undefined, minWeek = 1;
        list.forEach(course => {
            // lessonList 居然可能为null
            if (course.lessonList) {
                course.lessonList.forEach(lesson => {
                    const weekIndex = lesson.weekIndex;
                    if (lesson.weekIndex) {
                        // 最大 weekIndex
                        if (maxWeek) {
                            maxWeek = (weekIndex > maxWeek) ? weekIndex : maxWeek;
                        } else {
                            maxWeek = weekIndex;
                        }
                        // 最小 weekIndex
                        if (minWeek) {
                            minWeek = (weekIndex < minWeek) ? weekIndex : minWeek;
                        } else {
                            minWeek = weekIndex;
                        }
                    }
                })
            } else {
                maxWeek = undefined;
                minWeek = undefined;
            }
        });

        if (!maxWeek) {
            return []
        }

        // 取 weekindex 的最大、最小值
        let range = {minWeek, maxWeek}, _weeklist = [];

        for (let i = range.minWeek; i <= range.maxWeek; i++) {
            let weekItem = {weekIndex: '第' + this.toChineseNum(i) + '周', list: []};

            // 遍历课程 list
            list.forEach(course => {
                let classScheduleId = course.classScheduleId;

                // 匹配出课程周次list中weekIndex为当前周次的项
                let filtered = course.lessonList.filter(lesson => lesson.weekIndex === i)[0];

                if (filtered) {
                    // 设置各种情况下的 disabled
                    const {selected, isHoliday, idDeleted, maxQueueNum, crowdType, waitingNum} = filtered;
                    if (selected || isHoliday || idDeleted === 1 ||
                        // 无等位且已满 不能选择
                        (maxQueueNum === 0 && crowdType === 'full') ||
                        // 有等位且等位数+最大容量=选课人数
                        (maxQueueNum > 0 && (waitingNum >= maxQueueNum))
                    ) {
                        filtered.disabled = true;
                        filtered.initDisabled = true;
                    } else {
                        filtered.disabled = false;
                        filtered.initDisabled = false;
                    }

                    // 设置各种情况下的 checked
                    filtered.checked = !!filtered.selected;

                    // 时间戳转换
                    filtered.date = moment(filtered.date).format('YYYY-MM-DD');

                    // 处理完数组结构后放入 list
                    weekItem.list.push(Object.assign({classScheduleId}, filtered))
                } else {
                    weekItem.list.push({classScheduleId})
                }
            });
            _weeklist.push(weekItem)
        }
        return _weeklist;
    };

    /**
     * Desc 数字转中文数字
     * @param num 代表周几的数字
     * @returns {any}
     */
    toChineseNum = (num) => {
        const keys = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
        const count = ["", "十", "百", "千"];
        var str = "",
            nums = num.toString().split("").reverse();
        nums.map((value, index) => {
            str = keys[value] +
                (value === '0' ? "" : count[index > 3 ? index % 4 : index]) +
                (index === 4 ? "万" : "") +
                str;
        });
        let week = str.replace(/零(?=零)|零$|零(?=万)/g, "");
        return week.replace(/一十/g, "十");
    };

    /**
     * desc: 获取课程标签的背景色和文案
     * @params: course 课程
     */
    getTagType = (course) => {
        let color, text;
        if (course.isHoliday) {
            color = '#999999';
            text = '节假日'
        } else {
            const filtered = crowdType.filter(tp => tp.value === course.crowdType)[0];
            color = filtered ? filtered.color : undefined;
            text = filtered ? filtered.name : undefined;
        }
        return {color, text}
    };

    /*返回前一个路由*/
    backToSelection = () => {
        history.goBack()
    };

    /**
     * Desc 提交预定
     * @returns {any}
     */
    preSubmit = () => {
        const { selectedCourseNum, exchangeClassNum} = this.state;
        if ((exchangeClassNum !== 0) && (selectedCourseNum > exchangeClassNum) || (selectedCourseNum < exchangeClassNum)) {
            message.error(`请选择与换课课时相等的预约数`, 3);
            return;
        }

        // 可选课时为0时
        if (exchangeClassNum === 0) {
            this.setState({
                noNumVisible: true,
                noNumMessage: '可选课程数为0，不能提交预定'
            })
        } else{
            this.setState({ submitVisible: true })
        }
    };

    handleOk = () => {
        if (!this.couldSubmit) {
            // 如果处于不可提交状态，阻止提交
            return false;
        }
        this.couldSubmit = false;   // 把变量设置为不可点击状态，防止重复提交
        const { oldCourseInfo} = this.state;
        const attendenceIdList = oldCourseInfo.map((item: any) => item.attendanceId);

        if (this.state.currContract) {
            // 有合同，选课
            // 提交后返回选课
            submitChangeCourse({
                babyId: this.state.babyInfo.babyId,
                bookLessonList: this.state.submitlist,
                leadsId: this.state.leadsId,
                attendenceIdList: attendenceIdList,
                contractId: this.state.currContract.contractId,
                currentCenterId: User.currentCenterId
            }).then(res => {
                this.couldSubmit = true;   // 把变量重新设置为可点击状态
                let qingjiaLink = Routes.选课情况列表.link +
                    CommonUtils.stringify({leadsId: this.state.leadsId});
                message.success('换课成功！');
                history.push(qingjiaLink)
            }).catch(err => {
                this.couldSubmit = true;   // 把变量重新设置为可点击状态
            })
            // 没有合同，试听
        } else {

        }
    };
    handleCancel = () => {
        this.setState({submitVisible: false})
    };
    handleOkNoNum = () => {
        this.setState({noNumVisible: false})
    };

    /**
     * desc 渲染课程列表
     */
    courseListRender = () => {
        const {currContract, courseList} = this.state;
        if (currContract) {
            return (
                <div className="course col4flex">
                    {
                        courseList.map((course, idx) => {
                            const {name, date, start, end, classroom, teacher} = course;
                            const checkStatus = this.getAllCourseColCheckedStatus(idx);
                            return (
                                <div className="checkboxWrapper" key={idx}>
                                    <Checkbox
                                        indeterminate={checkStatus.indeterminate}
                                        onChange={(e) => {
                                            this.onCheckAllChangeCourse(idx, e)
                                        }}
                                        checked={checkStatus.checkedAll}
                                    >
                                        <p>{name}</p>
                                        <p>{date}&nbsp;{start}-{end}</p>
                                        <p>{classroom}&nbsp;{teacher}</p>
                                    </Checkbox>
                                </div>
                            )
                        })
                    }
                </div>
            )
        } else {
            return (
                <div className="course col4flex">
                    {
                        this.state.courseList.map((course, idx) => {
                            const {name, date, start, end, classroom, teacher} = course;
                            return (
                                <div className="checkboxWrapper " key={idx}>
                                    <div className="course-msg-wrapper">
                                        <p>{name}</p>
                                        <p>{date}&nbsp;{start}-{end}</p>
                                        <p>{classroom}&nbsp;{teacher}</p>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            )
        }
    };

    weeklistRender = ({week, weekidx}) => {
        if (this.state.currContract) {
            return (
                <div className="course col4flex">
                    {
                        week.list.map((course, idx) => {
                            const { date, checked, disabled, waitingNum, crowdType, monthValue} = course;
                            const showWaiting=(checked && crowdType==='full');
                            const tagType = this.getTagType(course);
                            return (
                                <div className="checkboxWrapper" key={idx}>
                                    {
                                        date ? (
                                            <Checkbox
                                                checked={checked}
                                                disabled={disabled}
                                                onChange={(e) => {
                                                    this.onChangeCheckbox({weekidx, idx})
                                                }}
                                            >
                                                <div className="checkboxContent">
                                                    <span>{course.date}</span>
                                                    <span
                                                        className="status"
                                                        style={{backgroundColor: tagType.color}}
                                                    >
                                                        {tagType.text}
                                                    </span>
                                                    {
                                                        (monthValue > 0 || monthValue < 0)&&
                                                        <span className='current_ange'>当前月龄：{monthValue}</span>
                                                    }
                                                    {
                                                        monthValue === 0&&
                                                        <span className='current_ange'>当前月龄：{monthValue}</span>
                                                    }
                                                </div>

                                                {showWaiting && <p>共有<span className='corange'>{waitingNum}</span>人排队</p>}
                                            </Checkbox>
                                        ) : null
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            )
        } else {
            return (
                <div className="course col4flex">
                    {
                        week.list.map((course, idx) => {
                            const {date, checked, disabled,waitingNum,crowdType} = course;
                            const tagType = this.getTagType(course);
                            const showWaiting=(checked && crowdType==='full');
                            return (
                                <div className="checkboxWrapper" key={idx}>
                                    {
                                        date ? (
                                            <Radio
                                                checked={checked}
                                                disabled={disabled}
                                                onChange={(e) => {
                                                    this.onChangeRadio({weekidx, idx, e})
                                                }}
                                            >
                                                <div className="checkboxContent">
                                                    <span>{date}</span>
                                                    <span
                                                        className="status"
                                                        style={{backgroundColor: tagType.color}}
                                                    >
                                                      {tagType.text}
                                                    </span>
                                                </div>
                                                {showWaiting && <p>共有<span className='corange'>{waitingNum}</span>人排队</p>}
                                            </Radio>
                                        ) : (null)
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            )
        }
    };

    render() {
        const {
            babyInfo, currContract, submitlist, courseList, submitVisible, noNumVisible, enablePreviewApproval,
            crumb, indeterminate, checkAll, options, checkedList, weeklist, noNumMessage, selectedCourseNum, oldCourseInfo, cacheCourseList
        } = this.state;
        const newSubmitlist = []
        submitlist.forEach(item => {
            newSubmitlist.push(...item.lessonDetailList)
        });
        const submitlistDetail = newSubmitlist && newSubmitlist.map((item,i) => Object.assign({},item,{
            oldLessonId: oldCourseInfo[i] ? oldCourseInfo[i].courseCode:null,
            oldDate: oldCourseInfo[i] ? oldCourseInfo[i].lessonDate:null,
        }));
        return (
            <Provider value={}>
                <Fragment>
                    <Modal
                        handleOk={this.handleOk}
                        handleCancel={this.handleCancel}
                        visible={submitVisible}
                        width={800}
                        data={{
                            submitlistDetail,
                            courseList,
                            babyInfo,
                            currContract,
                            enablePreviewApproval,
                            oldCourseInfo,
                        }}
                        okButtonProps={submitlist.length > 0 ? {disabled: false} : {disabled: true}}
                    />
                    <ModalNoNum
                        handleOk={this.handleOkNoNum}
                        visible={noNumVisible}
                        message={noNumMessage}
                        width={400}
                        cancelButtonProps={{style: {display: 'none'}}}
                        okButtonProps={{style: {marginLeft: 0}}}
                        icon="!"
                    />
                    <BreadCrumb routes={crumb}/>
                    <div className="course-reserve-wrapper shadow">
                        <div className="row-title">
                            <div className="name">宝宝姓名：{babyInfo.babyName}</div>
                            <div className="monthage">月龄：{babyInfo.monthValue}</div>
                        </div>
                        {
                            currContract &&
                            <ReserveRow
                                name="拥挤程度："
                                render={() => (
                                    <div>
                                        <Checkbox
                                            indeterminate={indeterminate}
                                            onChange={this.onCheckAllChange}
                                            checked={checkAll}
                                        >
                                            不限
                                        </Checkbox>
                                        <CheckboxGroup
                                            options={options}
                                            value={checkedList}
                                            onChange={this.onCrowdedChange}
                                        />
                                        <Button
                                            style={{marginLeft: 30}}
                                            type="primary"
                                            size="small"
                                            onClick={this.search}
                                            className="gym-button-blue-xs"
                                        >
                                            查询
                                        </Button>
                                    </div>
                                )}
                            />
                        }
                        {
                            currContract &&
                            <ReserveRow
                                name="课包："
                                render={() => (
                                    <div>
                                        <span style={{marginRight: 30}}>
                                            换课课时：{this.state.exchangeClassNum}
                                        </span>
                                        <span>本次已选：{selectedCourseNum}</span>
                                    </div>
                                )}
                            />
                        }
                        <ReserveRow
                            name="课程："
                            render={() => this.courseListRender()}
                        />
                        {
                            weeklist.map((week, weekidx) =>
                                <ReserveRow
                                    name={week.weekIndex + "："}
                                    key={weekidx}
                                    render={() => this.weeklistRender({week, weekidx})}
                                >
                                </ReserveRow>
                            )
                        }
                        <Row type="flex" justify="center">
                            <div className="btn-wrapper">
                                <Button
                                    type="primary"
                                    onClick={this.preSubmit}
                                    className="gym-button-default-sm"
                                >
                                    提交预定
                                </Button>
                                <Button
                                    style={{marginLeft: 20}}
                                    onClick={this.backToSelection}
                                    className="gym-button-white-sm"
                                >
                                    返回选课
                                </Button>
                            </div>
                        </Row>
                    </div>
                </Fragment>
            </Provider>
        )
    }
}

export {ReserveSubmitNew}
