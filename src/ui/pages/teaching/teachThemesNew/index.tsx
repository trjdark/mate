/**
 * desc: 课程主题设置(Art)新
 * User: Vicky.yu
 * Date: 2021/3/9
 * Time: 19“05
 */
import React from 'react';
import {Redirect, Switch} from "react-router";
import {Routes} from "@/router/enum/routes";
import {AuthorizedRoute} from "@/router/authorizedRoute";
import './style/index';

class TeachThemesNew extends React.Component<any, any> {
    render() {
        return (
            <Switch>
                <Redirect strict={true} exact={true} to={Routes.中心主题配置新.path} from={Routes.中心主题新.path}/>
                <AuthorizedRoute {...Routes.中心主题配置新}/>
            </Switch>
        )
    }
}

export {TeachThemesNew};
