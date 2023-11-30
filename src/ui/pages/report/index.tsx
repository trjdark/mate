/**
 * desc: 报表类
 * User: Lyon.li@gymboglobal.com
 * Date: 2019/1/10
 * Time: 上午10:38
 */
import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom';
import {Routes} from "@/router/enum/routes";
import {AuthorizedRoute} from "@/router/authorizedRoute";
import './style/index.scss';
import {Err404} from "@/ui/pages/404";

class Report extends Component {
    render() {
        return (
            <Switch>
                <AuthorizedRoute {...Routes.市场渠道业绩}/>
                <AuthorizedRoute {...Routes.市场渠道业绩销售向}/>
                <AuthorizedRoute {...Routes.市场名单明细}/>
                <AuthorizedRoute {...Routes.市场名单明细销售向}/>
                <AuthorizedRoute {...Routes.合同到期提醒}/>
                <AuthorizedRoute {...Routes.任务跟进记录}/>
                <AuthorizedRoute {...Routes.会员连续未到提醒}/>
                <AuthorizedRoute {...Routes.会员排课耗课统计}/>
                <AuthorizedRoute {...Routes.会员升班提醒}/>
                <AuthorizedRoute {...Routes.日常业绩统计}/>
                <AuthorizedRoute {...Routes.中心收入统计}/>
                <AuthorizedRoute {...Routes.耗课统计}/>
                <AuthorizedRoute {...Routes.渠道出现方式业绩}/>
                <AuthorizedRoute {...Routes.渠道出现方式业绩销售向}/>
                <AuthorizedRoute {...Routes.出席报告}/>
                <AuthorizedRoute {...Routes.出席报告详情}/>
                <AuthorizedRoute {...Routes.订货额度}/>
                <AuthorizedRoute {...Routes.预付款余额}/>
                <AuthorizedRoute {...Routes.未发货订单}/>
                <AuthorizedRoute {...Routes.未到期权益金}/>
                <AuthorizedRoute {...Routes.对账单}/>
                <AuthorizedRoute {...Routes.星级查询}/>
                {/*<AuthorizedRoute {...Routes.未消耗负债}/>*/}
                <AuthorizedRoute {...Routes.期初数据修正表}/>
                <AuthorizedRoute {...Routes.排课耗课统计}/>
                <AuthorizedRoute {...Routes.请假会员名单} />
                <AuthorizedRoute {...Routes.出席会员上课明细} />
                <AuthorizedRoute {...Routes.活动耗课表}/>
                <AuthorizedRoute {...Routes.活动耗课明细表}/>
                <AuthorizedRoute {...Routes.换课删课明细记录}/>
                <AuthorizedRoute {...Routes.特殊操作日志记录}/>
                <AuthorizedRoute {...Routes.多中心导出下载}/>
                <AuthorizedRoute {...Routes.多中心导出查看}/>
                <AuthorizedRoute {...Routes.中心业绩}/>
                <AuthorizedRoute {...Routes.消耗负债}/>
                <AuthorizedRoute {...Routes.收付款明细}/>
                <AuthorizedRoute {...Routes.到访表}/>
                <AuthorizedRoute {...Routes.审批报表导出申请}/>
                <AuthorizedRoute {...Routes.查看报表导出审批进度}/>
                <AuthorizedRoute {...Routes.月度AR账单}/>
                <AuthorizedRoute {...Routes.月度AR账单明细}/>
                <AuthorizedRoute {...Routes.政策管理}/>

                <Route path="*" component={Err404}/>

            </Switch>
        )
    }
}

export default Report;
