/**
 * desc: 非活跃会员消息提醒
 * User: luck.yuan/luck.yuan@gymboglobal.com
 * Date: 2021/7/14
 * Time: 下午2:48
 */
 import React from 'react';
 import {Redirect, Switch, Route} from "react-router";
 import {Routes} from "@/router/enum/routes";
 import {AuthorizedRoute} from "@/router/authorizedRoute";
 import {Err404} from "@/ui/pages/404";
 import './style/index.scss';
 
 class InactiveMemberReminder extends React.Component<any, any> {
 
     render() {
         return (
             <div>
                  <Switch>
                    <Redirect 
                    strict={true} 
                    exact={true} 
                    to={Routes.非活跃会员提醒管理.path} 
                    from={Routes.非活跃会员提醒设置.path}/>
                    <AuthorizedRoute {...Routes.非活跃会员提醒管理}/>
                    <AuthorizedRoute {...Routes.非活跃会员提醒新增}/>
                    <Route path="*" component={Err404}/>
                </Switch>
             </div>
         )
     }
 }
 
 export {InactiveMemberReminder}