/**
 * Desc: 课程表
 * User: Debby.Deng
 * Date: 2018/11/29,
 * Time: 下午1:53
 */
import './style/index.scss';
import * as React from "react";
import {WeekSchedule} from "./part/weekSchedule";
import {Tabs} from "@/ui/component/tabs";
import {TemporarySchedule} from "./part/temporarySchedule";
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {SignInTable} from "./part/signInTable";
import {User} from "@/common/beans/user";
import {connect} from "@/common/decorator/connect";
import {clearTeachingInit, teachingInit} from "@redux-actions/teaching/scheduleAction";
import {Routes} from "@/router/enum/routes";
import {CommonUtils} from "@/common/utils/commonUtils";
import history from "@/router/history";
import EventProxy from "../../../../common/utils/EventProxy";
import {FUNC} from "@/ui/pages/setting/enum/functions";


@connect(
    (state) => ({}),
    {teachingInit, clearTeachingInit}
)
class Schedule extends React.Component<any> {
    breadRoutes = [
        {
            name: '教学',
            path: '',
            link: '#',
            id: ''
        }, {
            name: '课程表',
            path: '',
            link: '#',
            id: ''
        }
    ];

    tabEnum = {
        'week': '固定排课',
        'temporary': '临时排课',
        'signIn': '上课签到'
    };

    keyList = [];// 课程表tab key list
    pid = "";// url上传入的ID

    getTabpanes = () => {
        this.keyList = [];
        const panes = [];
        if (User.permissionList.includes(FUNC[`固定排课`])) {
            panes.push({tabTitle: '固定排课', tabPane: <WeekSchedule/>, key: 'week'});
            this.keyList.push('week');
        }
        if (User.permissionList.includes(FUNC[`临时排课`])) {
            panes.push({tabTitle: '临时排课', tabPane: <TemporarySchedule {...this.props}/>, key: 'temporary'});
            this.keyList.push('temporary');
        }
        if (User.permissionList.includes(FUNC[`上课签到`])) {
            panes.push({tabTitle: '上课签到', tabPane: <SignInTable/>, key: 'signIn'});
            this.keyList.push('signIn');
        }
        return panes;
    };

    handleTabChange = (key) => {// tab切换
        if (key === 'signIn') {// 签到
            EventProxy.trigger('signInRequest');
        } else if (key === 'week') {// 固定排课
            EventProxy.trigger('weekScheduleRequest');
        } else if (key === 'temporary') {// 临时排课
            EventProxy.trigger('temporaryRequest');
        }
        history.push(`${Routes.课程表.link}${CommonUtils.stringify({id: key})}`);
    };

    hasPermission = () => {
        if (this.pid) {
            // 判断是否有权限,没有权限跳转登录页面
            if (!User.permissionList.includes(FUNC[`${this.tabEnum[this.pid]}`])) {
                history.replace('/login');
                return false;
            }
        }
        return true;
    };

    componentDidMount() {
        const permissionFlag = this.hasPermission();
        if (permissionFlag) {
            const {teachingInit} = this.props;
            const params = {
                currentCenterId: User.currentCenterId
            };
            teachingInit(params);
        }
    }

    componentWillUnmount() {
        EventProxy.remove();
        this.props.clearTeachingInit();
    }

    render() {
        const panes = this.getTabpanes();
        const routeParams = !!CommonUtils.hasParams(this.props) ? CommonUtils.parse(this.props) : {};
        this.pid = routeParams.id ? routeParams.id : this.keyList[0];
        return (
            <div className='pos_rel gym-teaching-schedule'>
                <BreadCrumb routes={this.breadRoutes}/>
                <Tabs
                    tabPanes={panes}
                    activeKey={`${this.pid}`}
                    onChange={this.handleTabChange}
                />
            </div>
        )
    }
}

export {Schedule}
