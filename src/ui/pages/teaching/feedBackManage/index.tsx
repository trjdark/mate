/**
 * desc: 随堂反馈管理
 * User: Vicky
 * Date: 2020/9/29
 * Time: 上午11:30
 */
import React from 'react';
import {Redirect, Switch} from "react-router";
import {Routes} from "@/router/enum/routes";
import {AuthorizedRoute} from "@/router/authorizedRoute";
import './style/index.ts';

class FeedBackManage extends React.Component<any, any> {
    render() {
        return (
            <Switch>
                <Redirect strict={true} exact={true} to={Routes.随堂反馈管理列表.path} from={Routes.随堂反馈管理.path}/>
                <AuthorizedRoute {...Routes.随堂反馈管理列表}/>
                <AuthorizedRoute {...Routes.随堂反馈管理查看}/>
            </Switch>
        )
    }
}

export { FeedBackManage};
