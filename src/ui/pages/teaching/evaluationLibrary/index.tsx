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

class EvaluationLibaray extends React.Component<any, any> {
    render() {
        return (
            <Switch>
                <Redirect strict={true} exact={true} to={Routes.测评库列表.path} from={Routes.测评库.path}/>
                <AuthorizedRoute {...Routes.测评库列表}/>
                <AuthorizedRoute {...Routes.测评库新增}/>
                <AuthorizedRoute {...Routes.测评库编辑} />
                {/* <AuthorizedRoute {...Routes.测评报告}/> */}
            </Switch>
        )
    }
}

export {EvaluationLibaray};
