/**
 * desc: RRP配置
 * User: colin.lu
 * Date: 2019/05/29
 * Time: 上午10:00
 */

import React from 'react';
import {Redirect, Switch} from "react-router";
import {Routes} from "@/router/enum/routes";
import {AuthorizedRoute} from "@/router/authorizedRoute";
import '../rrp/style/index'

class RRPConfig extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div>
                <Switch>
                    <Redirect strict={true} exact={true} to={Routes.RRP课程类型配置详情.path} from={Routes.RRP课程类型配置.path}/>
                    <AuthorizedRoute {...Routes.RRP课程类型配置详情}/>
                </Switch>
            </div>
        )
    }
}

export {RRPConfig}
