/**
 * desc: 合同模块入口
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/11/14
 * Time: 上午10:52
 */
import React from 'react';
import {Switch, Redirect, Route} from 'react-router';
import {Routes} from "@/router/enum/routes";
import {AuthorizedRoute} from "@/router/authorizedRoute";
import {contractInit} from "@redux-actions/contract";
import {connect} from "@/common/decorator/connect";
import {Err404} from "@/ui/pages/404";

@connect(() => ({}), {contractInit})
class Contract extends React.Component<any, any> {
    componentDidMount() {
        this.props.contractInit();
    }

    render() {
        return (
            <Switch>
                <Redirect strict={true} exact={true} to={Routes.合同管理列表.path} from={Routes.合同.path}/>
                <AuthorizedRoute {...Routes.合同管理列表}/>
                <AuthorizedRoute {...Routes.合同详情}/>
                <AuthorizedRoute {...Routes.新建合同}/>
                <AuthorizedRoute {...Routes.申请请假}/>
                <AuthorizedRoute {...Routes.申请改课程包}/>
                <AuthorizedRoute {...Routes.申请赠课}/>
                <AuthorizedRoute {...Routes.申请延期}/>
                <AuthorizedRoute {...Routes.申请转中心}/>
                <AuthorizedRoute {...Routes.申请退课}/>
                <AuthorizedRoute {...Routes.申请合同调整}/>
                <AuthorizedRoute {...Routes.申请部分退费}/>
                <AuthorizedRoute {...Routes.修改合同}/>
                <AuthorizedRoute {...Routes.审批合同}/>
                <AuthorizedRoute {...Routes.合同操作}/>

                {/*<AuthorizedRoute {...Routes.合同收款管理合同}/>*/}
                {/*<AuthorizedRoute {...Routes.合同收款管理其他}/>*/}
                {/*<AuthorizedRoute {...Routes.合同收款管理转中心}/>*/}
                {/*<AuthorizedRoute {...Routes.合同收款管理改包}/>*/}

                <AuthorizedRoute {...Routes.合同收款管理}/>
                <AuthorizedRoute {...Routes.合同付款管理}/>

                {/*<AuthorizedRoute {...Routes.合同付款管理合同}/>*/}
                {/*<AuthorizedRoute {...Routes.合同付款管理其他}/>*/}
                {/*<AuthorizedRoute {...Routes.合同付款管理转中心}/>*/}
                {/*<AuthorizedRoute {...Routes.合同付款管理改包}/>*/}
                {/*<AuthorizedRoute {...Routes.合同付款管理部分退费}/>*/}

                <AuthorizedRoute {...Routes.新建收款申请}/>
                <AuthorizedRoute {...Routes.新建付款申请}/>
                <AuthorizedRoute {...Routes.确认合同收款}/>
                <AuthorizedRoute {...Routes.确认合同付款}/>
                <AuthorizedRoute {...Routes.确认其他收款}/>
                <AuthorizedRoute {...Routes.确认其他付款}/>
                <AuthorizedRoute {...Routes.确认改包收款}/>
                <AuthorizedRoute {...Routes.确认改包付款}/>
                <AuthorizedRoute {...Routes.确认改中心收款}/>
                <AuthorizedRoute {...Routes.确认改中心付款}/>
                <AuthorizedRoute {...Routes.线上订单交易明细}/>
                <AuthorizedRoute {...Routes.确认部分退费付款}/>

                <Route path="*" component={Err404}/>

            </Switch>
        )
    }
}

export {Contract}
