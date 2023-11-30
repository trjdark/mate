/**
 * desc:跟进预约到访，任务中心页面
 * User: lyon.li@gymboglobal.com
 * Date: 2018/11/1
 * Time: 上午11:44
 */

import React from 'react';
import {Switch, Route} from 'react-router';
import {Routes} from "@/router/enum/routes";
import {AuthorizedRoute} from "@/router/authorizedRoute";
import {Err404} from "@/ui/pages/404";

import './style/taskCenter.scss';


class Task extends React.Component<any, any>{
    render(){
        return(
            <Switch>
                <AuthorizedRoute {...Routes.任务中心}/>
                <AuthorizedRoute {...Routes.消息中心}/>
                <Route path="*" component={Err404}/>
            </Switch>
        )
    }
}

export {Task}
