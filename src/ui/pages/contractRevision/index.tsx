/**
 * desc: 合同调整
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2021/5/21
 * Time: 上午10:58
 */

import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom';
import {Routes} from "@/router/enum/routes";
import {AuthorizedRoute} from "@/router/authorizedRoute";
import {Err404} from "@/ui/pages/404";
import {connect} from "@/common/decorator/connect";
import {contractInit} from "@redux-actions/contract";

@connect(() => ({}), {contractInit})
class ContractRevision extends Component<any, any> {
    componentDidMount(){
        this.props.contractInit();
    }
    render() {
        return (
            <Switch>
                {/*<AuthorizedRoute {...Routes.合同调整}/>*/}
                <AuthorizedRoute {...Routes.合同调整POP列表}/>
                <AuthorizedRoute {...Routes.合同调整研发列表}/>
                <AuthorizedRoute {...Routes.总部审批页面}/>
                <AuthorizedRoute {...Routes.合同调整详情}/>
                <AuthorizedRoute {...Routes.部分退费列表}/>
                <AuthorizedRoute {...Routes.部分退费详情}/>
                <Route path="*" component={Err404}/>
            </Switch>
        )
    }
}

export {ContractRevision};
