/**
 * desc: 中心管理
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/8/14
 * Time: 上午11:31
 */
import './style/index'
import React from 'react';
import {Switch, Redirect} from 'react-router-dom/index';
import {AuthorizedRoute} from "../../../../router/authorizedRoute";
import {BreadCrumb} from "../../../component/breadcrumb";
import {Routes} from "@/router/enum/routes";
import {connect} from "../../../../common/decorator/connect";
import {getCenterBaseSettingInfo} from "@redux-actions/setting/center";

@connect(() => ({}), {getCenterBaseSettingInfo})

class Center extends React.Component<any, any>{
    render(){
        return(
                <div id='gym-center' className={`${this.props.location.pathname.indexOf('/setting/operation/center/set') === -1 ? 'gym-center page-wrap' : ''}`}>
                    <Switch>
                        <Redirect strict={true} exact={true} to={Routes.中心管理列表.path} from={Routes.中心管理.path}/>
                        <AuthorizedRoute {...Routes.中心管理列表}/>
                        <AuthorizedRoute {...Routes.添加中心管理}/>
                        <AuthorizedRoute {...Routes.修改中心管理}/>
                        <AuthorizedRoute {...Routes.设置中心管理}/>
                    </Switch>
                </div>
        )
    }
}

export {Center}
