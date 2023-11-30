/**
 * desc: 审批管理
 * User: Vicky.yu
 * Date: 2020/12/4
 * Time: 17:15
 */

import React from 'react';
import {BreadCrumb} from "../../../component/breadcrumb";
import {Redirect, Switch} from "react-router-dom";
import {Routes} from "@/router/enum/routes";
import { getEmployeePostList } from "@redux-actions/setting/employee";
import {AuthorizedRoute} from "../../../../router/authorizedRoute";
import { connect } from '@/common/decorator/connect';

@connect((state: any) => ({}), {
    getEmployeePostList,
})
class ApproveManage extends React.Component<any, any>{
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
            id: 'member'
        },{
            name: '账号变更审批',
            path: '',
            link: '#',
            id: 'approveManage'
        }
    ];
    componentDidMount() {
        const { getEmployeePostList } = this.props;
        getEmployeePostList();
    }
    render(){
        return(
            <div>
                <BreadCrumb routes={this.routes} />
                <div id='gym-role-list' className='page-wrap gym-role-list'>
                    <Switch>
                        <Redirect strict={true} exact={true} to={Routes.员工审批管理列表.path} from={Routes.员工审批管理.path}/>
                        <AuthorizedRoute {...Routes.员工审批管理列表}/>
                        <AuthorizedRoute {...Routes.审批管理解锁审批}/>
                        <AuthorizedRoute {...Routes.审批管理单详情}/>
                    </Switch>

                </div>
            </div>

        )
    }
}

export { ApproveManage}
