/**
 * desc:
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2020/7/13
 * Time: 上午10:02
 */
import React from 'react';
import {Redirect, Switch} from "react-router";
import {Routes} from "@/router/enum/routes";
import {AuthorizedRoute} from "@/router/authorizedRoute";
import './style/index';

class SystemMessage extends React.Component<any, any> {
    render() {
        return (
            <Switch>
                <Redirect strict={true} exact={true} to={Routes.系统消息设置.path} from={Routes.系统消息推送.path}/>
                <AuthorizedRoute {...Routes.系统消息设置}/>
                <AuthorizedRoute {...Routes.系统消息模版}/>
            </Switch>
        )
    }
}

export {SystemMessage};
