/**
 * desc: 路由控制
 * Date: 2018/7/30
 * Time: 下午5:40
 */
import React from 'react';
import {
  Router, Route, Switch, Redirect
} from 'react-router-dom';
import {Layout} from "@/ui/containers/layout/layout";
import {Routes} from "@/router/enum/routes";
import {Err404} from "@/ui/pages/404";
import "../style/index";
import history from "./history";
import {AuthorizedRoute} from './authorizedRoute';

/**
 * todo 一期添加的入口
 * 登录
 */
class LoginRouter extends React.Component {
  render() {
    return (
      <Router history={history}>
        <Switch>
          <AuthorizedRoute exact={true} {...Routes.登录}/>
          <AuthorizedRoute {...Routes.重置密码}/>
          <AuthorizedRoute {...Routes.登录跳转}/>
          <AuthorizedRoute {...Routes.选择登录的系统}/>
          <AuthorizedRoute exact={true} {...Routes.登录测试}/>
            <Redirect from="/" to="/login"/>
        </Switch>
      </Router>
    )
  }
}

/**
 * 主页路由
 */

class HomeRouter extends React.Component{
    render(){
        return(
            <Router history={history}>
                <Layout>
                    <Switch>
                        <AuthorizedRoute exact={true} {...Routes.首页}/>
                        <AuthorizedRoute {...Routes.设置}/>
                        <AuthorizedRoute {...Routes.合同}/>
                        <AuthorizedRoute {...Routes.客户中心}/>
                        <AuthorizedRoute {...Routes.工作台}/>
                        <AuthorizedRoute {...Routes.市场渠道}/>
                        <AuthorizedRoute {...Routes.教学管理}/>
                        <AuthorizedRoute {...Routes.活动}/>
                        <AuthorizedRoute {...Routes.报表}/>
                        <AuthorizedRoute {...Routes.Dashboard}/>
                        <AuthorizedRoute {...Routes.云语音}/>
                        <AuthorizedRoute {...Routes.合同调整}/>

                        <Route pat="*" component={Err404}/>
                    </Switch>
                </Layout>
            </Router>
        )
    }
}

/**
 * 主路由
 */
class Routers extends React.Component<any, any> {
  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route path={Routes.登录.path} component={LoginRouter}/>
          <Route path={Routes.首页.path} component={HomeRouter}/>
        </Switch>
      </Router>
    )
  }
}

export {Routers}
