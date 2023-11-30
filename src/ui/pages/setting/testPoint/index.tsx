/**
 * desc: 试点中心设置
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2021/5/11
 * Time: 下午4:25
 */
import React from 'react';
import {Redirect, Switch, Route} from "react-router";
import {Routes} from "@/router/enum/routes";
import {AuthorizedRoute} from "@/router/authorizedRoute";
import {Err404} from "@/ui/pages/404";
import './style/index.scss';

class TestPoint extends React.Component<any, any> {

    render() {
        return (
            <div>
                <Switch>
                    <Redirect strict={true} exact={true} to={Routes.试点中心设置列表.path} from={Routes.试点中心设置.path}/>
                    <AuthorizedRoute {...Routes.试点中心设置列表}/>
                    <Route path="*" component={Err404}/>
                </Switch>
            </div>
        )
    }
}

export {TestPoint}
