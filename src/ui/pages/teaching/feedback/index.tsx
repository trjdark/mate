/**
 * Desc: 随堂反馈
 * User: Vicky.Yu
 */
import React from 'react';
import { Redirect, Switch } from "react-router";
import { Routes } from "@/router/enum/routes";
import { AuthorizedRoute } from "@/router/authorizedRoute";
import './style/index.ts';

class FeedBack extends React.Component<any, any> {
    render() {
        return (
            <Switch>
                <Redirect strict={true} exact={true} to={Routes.随堂反馈列表.path} from={Routes.随堂反馈.path} />
                <AuthorizedRoute {...Routes.随堂反馈列表} />
                <AuthorizedRoute {...Routes.随堂反馈测评} />
                <AuthorizedRoute {...Routes.随堂反馈编辑} />
                <AuthorizedRoute {...Routes.随堂反馈报告详情} />
            </Switch>
        )
    }
}

export { FeedBack };
