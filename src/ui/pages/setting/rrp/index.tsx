/**
 * desc: 基础设置RRP
 * User: colin.lu
 * Date: 2019/05/29
 * Time: 上午10:00
 */

import React from 'react';
import {Redirect, Switch} from "react-router";
import {Routes} from "@/router/enum/routes";
import {AuthorizedRoute} from "@/router/authorizedRoute";
import {connect} from "@/common/decorator/connect";

import '../rrp/style/index'
import {getLessonMatType} from "@redux-actions/setting/lessonMaterialActions";
import {User} from "@/common/beans/user";


@connect(()=>({}),{
    getLessonMatType
})
class RRP extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {}
    }
    componentDidMount(){
        const {getLessonMatType} = this.props;
        getLessonMatType({currentCenterId: User.currentCenterId});
    }
    render() {
        return (
            <div>
                <Switch>
                    <Redirect strict={true} exact={true} to={Routes.RRP课程类型列表.path} from={Routes.RRP课程类型.path}/>
                    <AuthorizedRoute {...Routes.RRP课程类型列表}/>
                    <AuthorizedRoute {...Routes.RRP课程类型编辑}/>
                    <AuthorizedRoute {...Routes.RRP课程类型新增}/>
                </Switch>
            </div>
        )
    }
}

export {RRP}
