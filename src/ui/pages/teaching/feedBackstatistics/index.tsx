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

class FeedBackStatistics extends React.Component<any, any> {
    render() {
        return (
            <Switch>
                <Redirect strict={true} exact={true} to={Routes.随堂反馈数据统计列表.path} from={Routes.随堂反馈数据统计.path}/>
                <AuthorizedRoute {...Routes.随堂反馈数据统计列表}/>
                <AuthorizedRoute {...Routes.随堂反馈数据统计查看}/>
            </Switch>
        )
    }
}

export { FeedBackStatistics};
