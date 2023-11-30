/**
 * desc: 市场渠道
 * User: Lyon.li@gymboglobal.com
 * Date: 2018/11/22
 * Time: 下午1:38
 */
import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom';
import {Routes} from "@/router/enum/routes";
import {AuthorizedRoute} from "@/router/authorizedRoute";
import {Err404} from "@/ui/pages/404";

class Market extends Component {
  render (){
      return (
          <Switch>
              <AuthorizedRoute {...Routes.编辑市场渠道}/>
              <AuthorizedRoute {...Routes.市场渠道列表}/>
              <AuthorizedRoute {...Routes.市场渠道明细}/>
              <Route path="*" component={Err404}/>

          </Switch>
      )
  }
}

export default Market;
