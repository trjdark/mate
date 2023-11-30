/**
 * Desc: 选课提交明细
 * User: Vicky.yu
 */
import React, {Component} from 'react';
import moment from 'moment';
import { PageTitle } from '@/ui/component/pageTitle';

class ReservationContent extends Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {};
    }

    getClassroom = (id) => {
        const {courseList} = this.props.data;
        let course = courseList.filter(course => course.classScheduleId === id)[0];
        return `${course.name}`;
    };

    render() {
        const {
            submitlistDetail,
            currContract,
            enablePreviewApproval,
        } = this.props.data;
        return (
            <div className="reservation-content">
                <PageTitle title={`换课课程明细`}/>

                            <div className="course-wrapper-table">
                                <div className="course-wrapper-table-head">
                                    <div className="course-wrapper-table-head-item">原课程</div>
                                    <div className="course-wrapper-table-head-item">原课程时间</div>
                                    <div className="course-wrapper-table-head-item">换课后课程</div>
                                    <div className="course-wrapper-table-head-item">换课后课程时间</div>
                                </div>
                                {
                                    submitlistDetail.map((lesson,index) => {
                                        const { classScheduleId } = lesson;
                                        return (
                                            <div className="course-wrapper-table-content" key={index}>
                                                <div key={1} className={"course-wrapper-table-content-all"}>
                                                    <div className="course-wrapper-table-content-all-item about-course">{lesson.oldLessonId}</div>
                                                    <div className="course-wrapper-table-content-all-item about-time">{moment(lesson.oldDate).format('YYYY-MM-DD HH:mm')}</div>
                                                    <div className="course-wrapper-table-content-all-item about-course">
                                                        {this.getClassroom(classScheduleId)}
                                                    </div>
                                                    <div className="course-wrapper-table-content-all-item about-time">
                                                        {moment(lesson.date).format('YYYY-MM-DD')} {lesson.lessonStartTime}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
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
