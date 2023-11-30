/**
 * desc: 活动
 * User: Lyon.li@gymboglobal.com
 * Date: 2018/12/7
 * Time: 下午1:38
 */
import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom';
import {Routes} from "@/router/enum/routes";
import {AuthorizedRoute} from "@/router/authorizedRoute";
import {Err404} from "@/ui/pages/404";

class Market extends Component {
    render() {
        return (
            <Switch>
                <AuthorizedRoute {...Routes.活动列表}/>
                <AuthorizedRoute {...Routes.编辑活动}/>
                <AuthorizedRoute {...Routes.审批活动}/>
                <AuthorizedRoute {...Routes.活动签到}/>
                <AuthorizedRoute {...Routes.打印}/>
                <Route path="*" component={Err404}/>

            </Switch>
        )
    }
}

export default Market;
