/**
 * desc: 员工数据
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2021/1/6
 * Time: 下午3:33
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
class EmployeeData extends React.Component<any, any> {
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
            name: '员工账号列表',
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
                        <Redirect exact={true} to={Routes.员工数据列表.path} from={Routes.员工数据管理.path}/>
                        <AuthorizedRoute exact={true} {...Routes.员工数据列表}/>
                        <AuthorizedRoute exact={true} {...Routes.员工数据详情}/>
                    </Switch>
                </div>
            </div>

        )
    }
}

export {EmployeeData}
