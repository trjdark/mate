/**
 * desc: 默认角色管理
 * User: colin.lu
 * Date: 2018/8/16
 * Time: 上午10:00
 */

import React from 'react';
import {BreadCrumb} from "../../../component/breadcrumb";
import {Redirect, Switch} from "react-router-dom";
import {Routes} from "@/router/enum/routes";
import {AuthorizedRoute} from "../../../../router/authorizedRoute";

class DefaultRoleManagement extends React.Component<any, any>{
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
            name: '默认角色设置',
            path: '',
            link: '#',
            id: 'roleManagement'
        }
    ];
    render(){
        return(
            <div>
                <BreadCrumb routes={this.routes} />
                <div id='gym-role-list' className='page-wrap gym-role-list'>
                    <Switch>
                        <Redirect strict={true} exact={true} to={Routes.默认角色管理列表.path} from={Routes.默认角色管理.path}/>
                        <AuthorizedRoute {...Routes.默认角色管理列表}/>
                        <AuthorizedRoute {...Routes.默认角色管理新增}/>
                        <AuthorizedRoute {...Routes.默认角色管理编辑}/>
                    </Switch>
                </div>
            </div>

        )
    }
}

export {DefaultRoleManagement}
