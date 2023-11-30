/**
 * desc: NetInLeads
 * User: colin.lu
 * Date: 2018/9/01
 * Time: 上午10:00
 */

import React from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {Redirect, Switch} from "react-router-dom";
import {Routes} from "@/router/enum/routes";
import {AuthorizedRoute} from "@/router/authorizedRoute";
import './style/index';

class NetInLeads extends React.Component<any, any> {
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
            name: 'Net-in Leads 提醒设置',
            path: '',
            link: '#',
            id: 'lessonMatMng'
        }
    ];

    render(){
        return(
            <div>
                <BreadCrumb routes={this.routes} />
                <div id='gym-lesson-category' className='page-wrap'>
                    <Switch>
                        <Redirect strict={true} exact={true} to={Routes.NetInLeads设置管理.path} from={Routes.NetInLeads.path}/>
                        <AuthorizedRoute {...Routes.NetInLeads设置管理}/>
                    </Switch>
                </div>
            </div>

        )
    }
}

export {NetInLeads}
