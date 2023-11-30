/**
 * Desc: 随堂反馈新版
 * User: Vicky.Yu
 * date: 2021/3/2 10:50
 */
import React from 'react';
import { Redirect, Switch } from "react-router";
import { Routes } from "@/router/enum/routes";
import { AuthorizedRoute } from "@/router/authorizedRoute";
import './style/index.ts';

class FeedBackNew extends React.Component<any, any> {
    render() {
        return (
            <Switch>
                <Redirect strict={true} exact={true} to={Routes.随堂反馈列表新.path} from={Routes.随堂反馈新.path} />
                <AuthorizedRoute {...Routes.随堂反馈列表新} />
                <AuthorizedRoute {...Routes.随堂反馈测评新} />
                <AuthorizedRoute {...Routes.随堂反馈编辑新} />
                <AuthorizedRoute {...Routes.随堂反馈报告详情新} />
            </Switch>
        )
    }
}

export { FeedBackNew };
