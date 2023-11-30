/**
 * desc: 教室管理
 * User: debby
 * Date: 2018/8/14
 *
 */
import './style/index';
import React from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";

import {Redirect, Switch} from "react-router-dom";
import {Routes} from "@/router/enum/routes";
import {AuthorizedRoute} from "@/router/authorizedRoute";

class Classroom extends React.Component<any, any>{
    state = {
        // manage(管理状态), edit(编辑)
        status: 'manage'
    };

    private routes:Array<any> = [
        {
            name: '设置',
            path: '',
            link: '#',
            id: 'setting'
        },{
            name: '运营管理',
            path: '',
            link: '#',
            id: 'operation'
        },{
            name: '教室设置',
            path: '',
            link: '#',
            id: 'classroomManage'
        }
    ];

    render(){
        return(
            <div>
                <BreadCrumb routes={this.routes} />
                <div id='gym-general-course' className='page-wrap gym-general-course'>
                    <Switch>
                        <Redirect strict={true} exact={true} to={Routes.教室管理列表.path} from={Routes.教室管理.path}/>
                        <AuthorizedRoute {...Routes.教室管理列表}/>
                        <AuthorizedRoute {...Routes.编辑教室管理}/>
                        <AuthorizedRoute {...Routes.添加教室管理}/>
                    </Switch>
                </div>
            </div>
        )
    }
}

export {Classroom}
