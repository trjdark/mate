import React, {Component} from 'react';
import moment from 'moment';

class ReservationContent extends Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {};
    }

    getClassroom = (id) => {
        const {courseList} = this.props.data;
        let course = courseList.filter(course => course.classScheduleId === id)[0];
        return `${course.name} ${course.classroom} ${course.date} ${course.start}-${course.end}`;
    };

    render() {
        const {
            submitlist,
            babyInfo,
            currContract,
            enablePreviewApproval
        } = this.props.data;

        return (
            <div className="reservation-content">
                <p>您要为<span>{babyInfo.babyName}</span>预定的课程信息如下：</p>
                {
                    submitlist.map((course, cidx) => {
                        const {classScheduleId, lessonDetailList} = course;
                        return (
                            <div className="course-wrapper" key={cidx}>
                                <div className="classroom">
                                    {this.getClassroom(classScheduleId)}
                                </div>
                                <div className="dates">
                                    {
                                        lessonDetailList.map((lesson, idx) => {
                                            const {date} = lesson;
                                            if (idx === 0) {
                                                return (
                                                    <span key={idx}>
                                                     {moment(date).format('YYYY-MM-DD')}
                                                    </span>
                                                )
                                            } else {
                                                return (
                                                    <span key={idx}>
                                                     ，{moment(date).format('YYYY-MM-DD')}
                                                   </span>
                                                )
                                            }
                                        })
                                    }
                                </div>
                            </div>
                        )
                    })
                }
                {
                    (enablePreviewApproval === 1 && !currContract) &&
                    <div className="shenpi">
                        <p>本中心试听申请需要审批，</p>
                        <p>确定提交吗？</p>
                    </div>
                }
            </div>
        )
    }
}

export {ReservationContent};
