
/**
 * desc:
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2023/8/11
 * Time: 15:33
 */

import React from 'react';
import {Redirect, Switch} from "react-router";
import {Routes} from "@/router/enum/routes";
import {AuthorizedRoute} from "@/router/authorizedRoute";
import {connect} from "@/common/decorator/connect";
import './style/index';
import {getSourceFromCRM} from "@redux-actions/teaching/rCourse";
import {User} from "@/common/beans/user";

@connect(() => ({}), {getSourceFromCRM})
class RCourse extends React.Component<any, any> {
    componentDidMount() {
        this.props.getSourceFromCRM({
            currentCenterId: User.currentCenterId
        })
    }
    render() {
        return (
            <Switch>
                <Redirect strict={true} exact={true} to={Routes.R店主题资源库.path} from={Routes.R店主题.path}/>
                <AuthorizedRoute {...Routes.R店主题资源库}/>
                <AuthorizedRoute {...Routes.R店主题资源库详情}/>
                <AuthorizedRoute {...Routes.R店主题设置}/>
                {/*<AuthorizedRoute {...Routes.R店主题资源库列表}/>*/}
            </Switch>
        )
    }
}

export {RCourse};
