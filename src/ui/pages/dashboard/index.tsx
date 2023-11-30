/**
 * desc: dashboard
 * User: Lyon.li@gymboglobal.com
 * Date: 2018/1/10
 * Time: 上午10:38
 */
import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom';
import {Routes} from "@/router/enum/routes";
import {AuthorizedRoute} from "@/router/authorizedRoute";
import './style/index.scss';
import {Err404} from "@/ui/pages/404";

class Dashboard extends Component {
    render() {
        return (
            <Switch>
                <AuthorizedRoute {...Routes.GA个人工作台}/>
                <AuthorizedRoute {...Routes.GB个人工作台}/>
                <AuthorizedRoute {...Routes.CD仪表盘}/>
                <AuthorizedRoute {...Routes.中心业绩看板详情}/>
                <AuthorizedRoute {...Routes.中心履约服务看板}/>
                <AuthorizedRoute {...Routes.预警日志}/>
                <AuthorizedRoute {...Routes.GB仪表盘}/>
                <AuthorizedRoute {...Routes.GA仪表盘}/>
                <Route path="*" component={Err404}/>

            </Switch>
        )
    }
}

export default Dashboard;
