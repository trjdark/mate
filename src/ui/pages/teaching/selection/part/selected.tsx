/**
 * Desc: 已缓存的选课列表
 * User: dave.zhang
 */
import React from 'react';
import {Button} from 'antd';
import {getCourseType} from '../../enum/selectCourse';
import {transWeekday} from "../common";

class SelectedCourse extends React.Component<any, any> {
    constructor(props) {
        super(props);
    }

    render() {
        const {list, submit, remove} = this.props;
        return (
            <div className={`selection-selected-wrapper ${list.length > 0 ? 'has-list' : ''}`}>
                <p className="title">已选课程</p>
                <div className="cache-wrapper">
                    {
                        list.map(course => {
                            const {classScheduleId, courseCode, weekDay, startTime, endTime, classroomName, primaryInsStaffName} = course;
                            return (
                                <div className="cache-item" key={classScheduleId}>
                                    <div
                                        className="type"
                                        style={{backgroundColor: getCourseType(courseCode)}}
                                    >
                                        {courseCode}
                                    </div>
                                    <div className="content">
                                        <p>
                                            周{transWeekday(weekDay)} {startTime}-{endTime}
                                        </p>
                                        <p>
                                            {classroomName} {primaryInsStaffName}
                                        </p>
                                    </div>
                                    <div
                                        className="close"
                                        onClick={() => remove(course)}
                                    >
                                        x
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className="btn-wrapper">
                    <Button
                        onClick={submit}
                        disabled={list.length === 0}
                        className="gym-button-default-sm"
                    >
                        提交选课
                    </Button>
                </div>
            </div>
        )
    }
}

export {SelectedCourse}
