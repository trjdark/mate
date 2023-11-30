/**
 * desc: 员工管理
 * Date: 2018/8/16
 * Time: 上午10:08
 */
import React from 'react';
import {BreadCrumb} from "../../../component/breadcrumb";
import {Routes} from "@/router/enum/routes";
import {Switch, Redirect} from "react-router";
import {AuthorizedRoute} from "../../../../router/authorizedRoute";
import {getEmployeePostList} from "@redux-actions/setting/employee";
import {connect} from "../../../../common/decorator/connect";
import {getCenterRoleList} from "@redux-actions/authActions";
import {User} from "../../../../common/beans/user";

@connect((state:any) => ({}), {
    getEmployeePostList, getCenterRoleList
})
class Employee extends React.Component<any, any> {
    private routes:Array<any> = [
        {
            name: '设置',
            path: '',
            link: '#',
            id: 'setting'
        },{
            name: '用户管理',
            path: '',
            link: '#',
            id: 'operation'
        },{
            name: '账号设置',
            path: '',
            link: '#',
            id: 'employee'
        }
    ];
    state = {
        isFetchedPostList: false
    };

    componentDidMount(){
        const {getEmployeePostList,getCenterRoleList} = this.props;
        getEmployeePostList();
        getCenterRoleList({
            centerId: User.currentCenterId,
            currentCenterId: User.currentCenterId
        });
    }
    render(){
        return (
            <div>
                <BreadCrumb routes={this.routes}/>
                <div id='gym-employee' className='page-wrap'>
                    <Switch>
                        <Redirect exact={true} to={Routes.员工信息列表.path} from={Routes.员工信息管理.path}/>
                        <AuthorizedRoute exact={true} {...Routes.员工信息列表}/>
                        <AuthorizedRoute exact={true} {...Routes.添加员工信息}/>
                        <AuthorizedRoute exact={true} {...Routes.修改员工信息}/>
                        <AuthorizedRoute exact={true} {...Routes.解锁审批员工信息} />
                    </Switch>
                </div>
            </div>

        )
    }
}

export {Employee}
