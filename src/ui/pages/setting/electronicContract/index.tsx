/**
 * desc: 电子合同用印
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2021/9/2
 * Time: 上午10:50
 */
import React from 'react';
import {Redirect, Switch, Route} from "react-router";
import {Routes} from "@/router/enum/routes";
import {AuthorizedRoute} from "@/router/authorizedRoute";
import {Err404} from "@/ui/pages/404";
import './style/index.scss';

class ElectronicContract extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <div>
                <Switch>
                    <Redirect strict={true} exact={true} to={Routes.电子用印列表.path} from={Routes.电子合同管理.path}/>
                    <AuthorizedRoute {...Routes.电子用印列表}/>
                    <AuthorizedRoute {...Routes.电子用印添加}/>
                    <AuthorizedRoute {...Routes.电子用印编辑}/>
                    <Route path="*" component={Err404}/>
                </Switch>
            </div>
        )
    }
}

export {ElectronicContract}
