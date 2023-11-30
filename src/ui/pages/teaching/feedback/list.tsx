/**
 * Desc: 随堂反馈课程列表
 * User: Vicky.Yu
 * Date: 2020/9/27
 * Time: 下午2:15
 */
import './style/index.scss';
import * as React from "react";
import {BreadCrumb} from "@/ui/component/breadcrumb";
import { FeedBackCourse} from "./part/feedBackCourse";
import {User} from "@/common/beans/user";
import {connect} from "@/common/decorator/connect";
import {
    selectInsHi,
    selectScheduleCourse,
    selectScheduleRoom
} from "@/saga/selectors/teaching/scheduleSelector";
import {clearTeachingInit, teachingInit} from "@redux-actions/teaching/scheduleAction";
import {CommonUtils} from "@/common/utils/commonUtils";
import EventProxy from "../../../../common/utils/EventProxy";

@connect(
    (state) => {
        return {
            insList: selectInsHi(state),
            courseList: selectScheduleCourse(state),
            roomList: selectScheduleRoom(state),
        }
    },
    {teachingInit, clearTeachingInit}
)
class FeedBackList extends React.Component<any> {
    breadRoutes = [
        {
            name: '教学',
            path: '',
            link: '#',
            id: ''
        }, {
            name: '随堂反馈(Art)',
            path: '',
            link: '#',
            id: ''
        }
    ];

    keyList = [];// 课程表tab key list
    pid = "";// url上传入的ID

    componentDidMount() {
        const {teachingInit} = this.props;
        const params = {
            currentCenterId: User.currentCenterId
        };
        teachingInit(params);
    }

    componentWillUnmount() {
        EventProxy.remove();
        this.props.clearTeachingInit();
    }

    render() {
        const routeParams = !!CommonUtils.hasParams(this.props) ? CommonUtils.parse(this.props) : {};
        this.pid = routeParams.id ? routeParams.id : this.keyList[0];
        return (
            <div className='pos_rel gym-teaching-schedule'>
                <BreadCrumb routes={this.breadRoutes}/>
                <FeedBackCourse/>
            </div>
        )
    }
}

export { FeedBackList}
