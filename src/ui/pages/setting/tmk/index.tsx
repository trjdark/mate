
/**
 * desc: TMK呼叫中心设置
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2019/12/4
 * Time: 下午6:45
 */
import React from 'react';
import {Redirect, Switch} from "react-router";
import {Routes} from "@/router/enum/routes";
import {AuthorizedRoute} from "@/router/authorizedRoute";
import {User} from "@/common/beans/user";
import {connect} from "@/common/decorator/connect";
import {getGIList} from "@redux-actions/setting/tmk";

@connect(() => ({}), {getGIList})
class TmkTelephoneCenter extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {}
    }
    componentDidMount(){
        this.props.getGIList({currentCenterId:User.currentCenterId});
    }
    render() {
        return (
            <div>
                <Switch>
                    <Redirect strict={true} exact={true} to={Routes.TMK中心列表.path} from={Routes.TMK呼叫中心设置.path}/>
                    <AuthorizedRoute {...Routes.TMK中心列表}/>
                    <AuthorizedRoute {...Routes.TMK新增}/>
                    <AuthorizedRoute {...Routes.TMK编辑}/>
                    <AuthorizedRoute {...Routes.TMK查看}/>

                </Switch>
            </div>
        )
    }
}

export {TmkTelephoneCenter}
