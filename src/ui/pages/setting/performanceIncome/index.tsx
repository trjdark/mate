/**
 * desc:
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2021/2/25
 * Time: 下午3:38
 */
import React from 'react';
import {Redirect, Switch} from "react-router";
import {Routes} from "@/router/enum/routes";
import {AuthorizedRoute} from "@/router/authorizedRoute";

class PerformanceIncome extends React.Component<any, any> {

    render() {
        return (
            <div>
                <Switch>
                    <Redirect strict={true} exact={true} to={Routes.业绩指标列表.path} from={Routes.业绩指标.path}/>
                    <AuthorizedRoute {...Routes.业绩指标列表}/>
                    <AuthorizedRoute {...Routes.业绩指标详情}/>
                </Switch>
            </div>
        )
    }
}

export {PerformanceIncome}

