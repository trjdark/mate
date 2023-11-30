/**
 * desc: 客户中心
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/11/14
 * Time: 下午1:38
 */
import React from 'react';
import {Switch, Route} from 'react-router';
import {Routes} from "@/router/enum/routes";
import {AuthorizedRoute} from "@/router/authorizedRoute";
import {Err404} from "@/ui/pages/404";

class Teaching extends React.Component<any, any>{
    render(){
        return(
            <Switch>
                <AuthorizedRoute {...Routes.课程表}/>
                <AuthorizedRoute {...Routes.签到打印}/>
                <AuthorizedRoute {...Routes.签到}/>
                {/*<AuthorizedRoute {...Routes.随堂反馈}/>*/}
                <AuthorizedRoute {...Routes.随堂反馈管理} />
                <AuthorizedRoute {...Routes.随堂反馈数据统计} />
                <AuthorizedRoute {...Routes.随堂反馈新} />
                <AuthorizedRoute {...Routes.随堂反馈管理新} />
                <AuthorizedRoute {...Routes.随堂反馈数据统计新} />
                <AuthorizedRoute {...Routes.请假申请}/>
                <AuthorizedRoute {...Routes.试听申请}/>
                <AuthorizedRoute {...Routes.试听申请查看}/>
                <AuthorizedRoute {...Routes.试听申请审批}/>
                <AuthorizedRoute {...Routes.gymguard}/>
                <AuthorizedRoute {...Routes.点评库管理}/>
                <AuthorizedRoute {...Routes.点评库管理新版} />
                {/*<AuthorizedRoute {...Routes.点评库管理R} />*/}
                <AuthorizedRoute {...Routes.系统消息推送} />
                <AuthorizedRoute {...Routes.中心主题} />
                <AuthorizedRoute {...Routes.中心主题新} />
                {/* Todo */}
                <AuthorizedRoute {...Routes.R店主题} />

                <AuthorizedRoute {...Routes.测评库} />
                <AuthorizedRoute {...Routes.测评报告} />
                <AuthorizedRoute {...Routes.中心开放约课等位} />
                <AuthorizedRoute {...Routes.月度回顾管理} />
                <AuthorizedRoute {...Routes.月度回顾管理列表} />
                <AuthorizedRoute {...Routes.升班报告管理} />
                <AuthorizedRoute {...Routes.升班报告管理列表} />
                <AuthorizedRoute {...Routes.八大领域管理设置}/>
                <AuthorizedRoute {...Routes.App课程展示}/>

                <Route path="*" component={Err404}/>
            </Switch>
        )
    }
}

export {Teaching}
