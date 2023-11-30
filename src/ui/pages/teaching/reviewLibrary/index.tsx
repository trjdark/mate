/**
 * desc: 点评库
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2020/7/9
 * Time: 下午3:20
 */
import React from 'react';
import {Redirect, Switch} from "react-router";
import {Routes} from "@/router/enum/routes";
import {AuthorizedRoute} from "@/router/authorizedRoute";
import {getLessonMatType} from "@redux-actions/setting/lessonMaterialActions";
import {connect} from "@/common/decorator/connect";
import './style/index';
import {User} from "@/common/beans/user";

@connect(()=>({}),{
    getLessonMatType
})

class ReviewLibaray extends React.Component<any, any> {
    componentDidMount(){
        const {getLessonMatType} = this.props;
        getLessonMatType({currentCenterId: User.currentCenterId});
    }
    render() {
        return (
            <Switch>
                <Redirect strict={true} exact={true} to={Routes.点评库管理列表.path} from={Routes.点评库管理.path}/>
                <AuthorizedRoute {...Routes.点评库管理列表}/>
                <AuthorizedRoute {...Routes.教案修改}/>
                <AuthorizedRoute {...Routes.教案详情}/>
                <AuthorizedRoute {...Routes.添加教案}/>
            </Switch>
        )
    }
}

export {ReviewLibaray};
