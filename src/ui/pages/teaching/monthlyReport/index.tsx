/**
 * desc:
 * User: Katarina.Yuan
 * Date: 2021/6/15
 * Time: 下午3:00
 */
import React from 'react';
import {Redirect, Switch} from 'react-router'
import {Routes} from "@/router/enum/routes";
import {AuthorizedRoute} from "@/router/authorizedRoute";
import './style/index.ts';

class MonthlyReport extends React.Component<any,any> {
    render() {
        return (
            <Switch>
                <Redirect strict={true} exact={true} to={Routes.月度回顾管理列表.path} from={Routes.月度回顾管理.path}/>
                <AuthorizedRoute {...Routes.月度回顾管理列表}/>
            </Switch>
        )
    }
}

export { MonthlyReport }
