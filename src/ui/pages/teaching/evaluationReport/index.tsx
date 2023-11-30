/**
 * desc: 测评报告
 * User: Vicky
 * Date: 2020/8/03
 * Time: 上午11:30
 */
import React from 'react';
import {Redirect, Switch} from "react-router";
import {Routes} from "@/router/enum/routes";
import {AuthorizedRoute} from "@/router/authorizedRoute";
import './style/index.ts';

class EvaluationReport extends React.Component<any, any> {
    render() {
        return (
            <Switch>
                <Redirect strict={true} exact={true} to={Routes.测评报告列表.path} from={Routes.测评报告.path}/>
                <AuthorizedRoute {...Routes.测评报告列表}/>
                <AuthorizedRoute {...Routes.测评报告编辑}/>
                <AuthorizedRoute {...Routes.测评报告详情}/>
                <AuthorizedRoute {...Routes.测评报告新建}/>

            </Switch>
        )
    }
}

export {EvaluationReport};
