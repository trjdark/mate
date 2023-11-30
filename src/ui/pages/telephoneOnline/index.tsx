/**
 * desc: 云语音
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2019/12/4
 * Time: 下午2:19
 */
import React from 'react';
import {Switch, Route} from 'react-router';
import {Routes} from "@/router/enum/routes";
import {AuthorizedRoute} from "@/router/authorizedRoute";
import {Err404} from "@/ui/pages/404";
import {connect} from "@/common/decorator/connect";
import {getStuffList} from "@redux-actions/customer/taskCenter";
import {getGidList} from "@redux-actions/telephone/callRecords";
import {User} from "@/common/beans/user";
import './style/index';

@connect(() => ({}),{getStuffList, getGidList})
class TelephoneOnline extends React.Component<any, any>{
    componentDidMount(){
        this.props.getStuffList({currentCenterId: User.currentCenterId});
        this.props.getGidList({currentCenterId: User.currentCenterId, fromType: "1"})
    }
    render(){
        return(
            <Switch>
                <AuthorizedRoute {...Routes.语音拨打}/>
                <AuthorizedRoute {...Routes.坐席分配}/>
                <AuthorizedRoute {...Routes.添加坐席}/>
                <AuthorizedRoute {...Routes.编辑坐席}/>
                <AuthorizedRoute {...Routes.云语音通话数据统计}/>
                <AuthorizedRoute {...Routes.账户余额}/>
                <AuthorizedRoute {...Routes.坐席通话详情统计}/>
                <AuthorizedRoute {...Routes.技能组详情统计}/>
                <AuthorizedRoute {...Routes.客户回拨统计}/>
                <AuthorizedRoute {...Routes.TMK转Leads}/>
                <AuthorizedRoute {...Routes.云语音市场类报表} />
                <AuthorizedRoute {...Routes.云语音服务类报表} />
                <Route path="*" component={Err404}/>
            </Switch>

        )
    }
}

export {TelephoneOnline}
