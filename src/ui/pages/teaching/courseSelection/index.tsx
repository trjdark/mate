/**
 * desc: 选课情况index
 * User: colin.lu
 * Date: 2018/12/29
 * Time: 上午10:00
 */

import React from 'react';
import {Redirect, Switch} from "react-router";
import {Routes} from "@/router/enum/routes";
import {AuthorizedRoute} from "@/router/authorizedRoute";
import '../courseSelection/style/index'

class CourseSelectionDetail extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
    }

    render() {
        return (
            <div>
                <Switch>
                    <Redirect strict={true} exact={true} to={Routes.选课情况列表.path} from={Routes.选课情况.path}/>
                    {/*列表页面*/}
                    <AuthorizedRoute {...Routes.选课情况列表}/>
                    <AuthorizedRoute {...Routes.选课情况日历}/>
                </Switch>
            </div>
        )
    }
}

export {CourseSelectionDetail}
