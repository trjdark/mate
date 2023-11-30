import React from 'react';
import {Consumer} from '../context';
import {getCourseType, crowdType} from '../../enum/selectCourse';

class ArrangeItem extends React.Component<any, any> {
    constructor(props) {
        super(props);
    }

    render() {
        const {course} = this.props;
        const crowd = crowdType.filter(item=>item.value === course.crowdType)[0];
        return (
            <Consumer>
                {
                    ({addCacheCourse, currCacheCourse}) => (
                        <div
                            className={
                                `arrangeItem ${currCacheCourse.classScheduleId === course.classScheduleId ? 'selected' : ''}`
                            }
                            onClick={() => addCacheCourse(course)}
                        >
                            <div
                                className="type"
                                style={{
                                    backgroundColor: getCourseType(course.courseCode),
                                    overflow: 'hidden'
                                }}
                            >
                                {course.courseCode}
                            </div>
                            <div className="content">
                                <p>
                                    {course.startTime}-{course.endTime} {course.classroomName}
                                </p>
                                <p>{course.primaryInsStaffName}</p>
                                {
                                    course.assistantInsStaffName?<p>{course.assistantInsStaffName}</p>:null
                                }
                            </div>
                            <div className="crowd-degree" style={{backgroundColor: crowd.color}}>{crowd.name}</div>
                        </div>
                    )
                }
            </Consumer>
        )
    }
}

export {ArrangeItem}
