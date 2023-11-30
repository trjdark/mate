/**
 * desc: 客户中心
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/11/14
 * Time: 下午1:38
 */
import React from 'react';
import {
    Switch,Route
} from 'react-router';
import {Routes} from "@/router/enum/routes";
import {AuthorizedRoute} from "@/router/authorizedRoute";
import {Err404} from "@/ui/pages/404";

class Customer extends React.Component<any, any> {
    render() {
        return (
            <Switch>
                <AuthorizedRoute {...Routes.分配客户}/>
                <AuthorizedRoute {...Routes.新建客户}/>
                <AuthorizedRoute {...Routes.批量导入客户}/>
                <AuthorizedRoute {...Routes.分配记录}/>
                <AuthorizedRoute {...Routes.客户360}/>
                <AuthorizedRoute {...Routes.客户360基本信息}/>
                <AuthorizedRoute {...Routes.历史名单}/>
                <AuthorizedRoute {...Routes.客户获取}/>
                <AuthorizedRoute {...Routes.客户成长}/>
                {/*<AuthorizedRoute {...Routes.本中心查询}/>*/}
                <AuthorizedRoute {...Routes.跨中心查询}/>
                <AuthorizedRoute {...Routes.其他信息}/>
                <AuthorizedRoute {...Routes.选课}/>
                <AuthorizedRoute {...Routes.提交预定}/>
                <AuthorizedRoute {...Routes.提交试听}/>
                <AuthorizedRoute {...Routes.选课新} />
                <AuthorizedRoute {...Routes.提交预定新} />
                <AuthorizedRoute {...Routes.提交试听新} />
                <AuthorizedRoute {...Routes.选课情况列表}/>
                <AuthorizedRoute {...Routes.选课情况日历}/>
                <AuthorizedRoute {...Routes.渠道日志}/>
                <AuthorizedRoute {...Routes.rrp绑定查询}/>
                <AuthorizedRoute {...Routes.通话记录}/>
                <AuthorizedRoute {...Routes.云语音记录}/>
                <AuthorizedRoute {...Routes.月度回顾管理查询}/>
                <AuthorizedRoute {...Routes.升班报告管理查询}/>
                <AuthorizedRoute {...Routes.新客户中心}/>

                <Route path="*" component={Err404}/>

            </Switch>
        )
    }
}

export {Customer}
