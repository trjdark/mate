/**
 * desc:
 * User: Katarina.Yuan
 * Date: 2021/7/22
 * Time: 上午10:00
 */
import React from 'react';
import {Redirect, Switch} from 'react-router'
import {Routes} from "@/router/enum/routes";
import {AuthorizedRoute} from "@/router/authorizedRoute";
import './style/index.ts';

class PromotionReport extends React.Component<any,any> {
    render() {
        return (
            <Switch>
                <Redirect strict={true} exact={true} to={Routes.升班报告管理列表.path} from={Routes.升班报告管理.path}/>
                <AuthorizedRoute {...Routes.升班报告管理列表}/>
            </Switch>
        )
    }
}

export { PromotionReport }
