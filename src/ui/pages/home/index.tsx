/**
 * desc: 首页
 * Date: 2018/7/30
 * Time: 下午6:22
 */
import React from 'react'
import { Routes } from "@/router/enum/routes";
import history from "@/router/history";
import { User } from "@/common/beans/user";
import { PermissionMap } from "@/router/enum/routeFuncIdMap";


class Home extends React.Component<any, any> {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="gym-home">
                <img
                    className="gym-home-img"
                    src={require('../../../images/mate_home.png')}
                    alt=""
                />
                <p className="gym-home-text">欢迎登录Mate后台管理系统</p>
            </div>
        )
    }

    componentDidMount() {
        // 页面加载后，根据不同的权限分发至不同的页面
        this.goHomeByRole();
    }

    // 根据员工角色信息并跳转到不同页面
    goHomeByRole = () => {
        const role = User.role;
        if ((role.includes('CD') || role.includes('HGB') || role.includes('GI')) &&
            User.permissionList.includes(PermissionMap.CD工作台[0])) {
            return history.push(Routes.CD仪表盘.path);
        }

        if (role.includes('HGA') && User.permissionList.includes(PermissionMap.HGA工作台[0])) {
            return history.push(Routes.中心履约服务看板.path);
        }

        if (role.includes('GB') && User.permissionList.includes(PermissionMap.GB工作台[0])) {
            return history.push(Routes.GB仪表盘.path);
        }

        if (role.includes('GA') && User.permissionList.includes(PermissionMap.GA工作台[0])) {
            return history.push(Routes.GA仪表盘.path);
        }

    };
}

export { Home }
