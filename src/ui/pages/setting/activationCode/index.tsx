/**
 * desc: 激活码管理
 * User: Vicky.Yu
 * Date: 2020/6/30
 * Time: 15:30
 */
import './style/index';
import React from 'react';
import {Switch, Redirect} from "react-router";
import {AuthorizedRoute} from "../../../../router/authorizedRoute";
import {Routes} from "@/router/enum/routes";

class AcCode extends React.Component<any, any>{

    render(){
        return(
            <Switch>
                <Redirect strict={true} exact={true} to={Routes.激活码管理列表.path} from={Routes.激活码管理.path}/>
                <AuthorizedRoute {...Routes.激活码管理列表}/>
                <AuthorizedRoute {...Routes.导入激活码}/>
                <AuthorizedRoute {...Routes.激活码详情}/>
            </Switch>
        )
    }
}

export {AcCode}
