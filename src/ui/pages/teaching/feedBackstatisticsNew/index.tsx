/**
 * desc: 测评报告
 * User: Vicky
 * Date: 2020/7/30
 * Time: 上午11:30
 */
import React from 'react';
import {Redirect, Switch} from "react-router";
import {Routes} from "@/router/enum/routes";
import {AuthorizedRoute} from "@/router/authorizedRoute";
import './style/index.ts';

class FeedBackStatisticsNew extends React.Component<any, any> {
    render() {
        return (
            <Switch>
                <Redirect strict={true} exact={true} to={Routes.随堂反馈数据统计列表新.path} from={Routes.随堂反馈数据统计新.path}/>
                <AuthorizedRoute {...Routes.随堂反馈数据统计列表新}/>
                <AuthorizedRoute {...Routes.随堂反馈数据统计查看新}/>
            </Switch>
        )
    }
}

export { FeedBackStatisticsNew};
