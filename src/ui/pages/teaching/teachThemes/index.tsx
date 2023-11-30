/**
 * desc: 课程主题设置(Art)
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2020/7/15
 * Time: 下午2:20
 */
import React from 'react';
import {Redirect, Switch} from "react-router";
import {Routes} from "@/router/enum/routes";
import {AuthorizedRoute} from "@/router/authorizedRoute";
import './style/index';

class TeachThemes extends React.Component<any, any> {
    render() {
        return (
            <Switch>
                <Redirect strict={true} exact={true} to={Routes.中心主题配置.path} from={Routes.中心主题.path}/>
                <AuthorizedRoute {...Routes.中心主题配置}/>
            </Switch>
        )
    }
}

export {TeachThemes};
