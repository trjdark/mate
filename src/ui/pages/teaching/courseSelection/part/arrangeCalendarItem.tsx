import React from 'react';
import {Consumer} from '../context';
import {getCourseType} from '../../enum/selectCourse';

class ArrangeCalendarItem extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {}
    }

    leave =(course:object)=> {
        const { leaveBtn } = this.props;
        leaveBtn(course);
    };

    delete =(course:object)=> {
        const { deleteBtn } = this.props;
        deleteBtn(course);
    };

    render() {
        const {course} = this.props;
        return (
            <Consumer>
                {
                    () => (
                        <React.Fragment>
                            <div className="arrangeItem">
                                <div className="arrangeItem-type"
                                     style={{backgroundColor: getCourseType(course.courseCode)}}>
                                    {course.courseCode}
                                </div>
                                <div className="arrangeItem-content">
                                    <p>
                                        {`${course.startTime}-${course.endTime}`}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{`${course.classroomName}`}
                                    </p>
                                    <p className='arrangeItem-staff'>{course.primaryInsStaffName}</p>
                                    {
                                        course.attendanceStatus === '25001' &&
                                        <p className='arrangeItem-button'>
                                            <span>
                                                <button onClick={()=>this.leave(course)} className='gym-button-xxs gym-button-white'>请假</button>
                                            </span>
                                            <span>
                                                <button onClick={()=>this.delete(course)} className='gym-button-xxs gym-button-white ml15'>删除</button>
                                            </span>
                                        </p>
                                    }
                                </div>
                            </div>
                        </React.Fragment>
                    )
                }
            </Consumer>
        )
    }
}

export {ArrangeCalendarItem}
