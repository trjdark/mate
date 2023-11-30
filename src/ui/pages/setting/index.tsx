/**
 * desc: 基础设置路由
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/11/14
 * Time: 上午11:10
 */
import React from 'react';
import {Switch, Route, Redirect} from 'react-router';
import {Routes} from "@/router/enum/routes";
import {AuthorizedRoute} from "@/router/authorizedRoute";
import {Err404} from "@/ui/pages/404";
import {User} from "@/common/beans/user";
import {connect} from "@/common/decorator/connect";
import {getAllCenterList} from "@redux-actions/setting/employee";
import { CommonUtils } from '@/common/utils/commonUtils'

@connect((state:any) => ({}), {getAllCenterList})

class BasicSetting extends React.Component<any, any>{
    componentDidMount(){
        const {getAllCenterList} = this.props;
        User.isHQ && getAllCenterList({
            currentCenterId:User.currentCenterId,
        });
    }
    render(){
        const FinanceAdministration = {...Routes}.设置财务管理.component
        return(
            <Switch>
                <AuthorizedRoute {...Routes.总部课程包管理}/>
                <AuthorizedRoute {...Routes.中心课程包管理}/>
                <AuthorizedRoute {...Routes.中心管理}/>
                <AuthorizedRoute {...Routes.教室管理}/>
                <AuthorizedRoute {...Routes.中心角色管理}/>
                <AuthorizedRoute {...Routes.默认角色管理}/>
                <AuthorizedRoute {...Routes.节假日}/>
                <AuthorizedRoute {...Routes.员工信息管理}/>
                <AuthorizedRoute {...Routes.产品管理}/>
                <AuthorizedRoute {...Routes.课程分类}/>
                <AuthorizedRoute {...Routes.课程资料}/>
                <AuthorizedRoute {...Routes.RRP课程类型}/>
                <AuthorizedRoute {...Routes.RRP课程类型列表}/>
                <AuthorizedRoute {...Routes.RRP课程类型新增}/>
                <AuthorizedRoute {...Routes.RRP课程类型编辑}/>
                <AuthorizedRoute {...Routes.promotor管理}/>
                <AuthorizedRoute {...Routes.中心业绩设置列表}/>
                <AuthorizedRoute {...Routes.中心业绩设置表单}/>
                <AuthorizedRoute {...Routes.NetInLeads}/>
                <AuthorizedRoute {...Routes.TMK呼叫中心设置}/>
                <AuthorizedRoute {...Routes.激活码管理} />
                <AuthorizedRoute {...Routes.员工审批管理} />
                <AuthorizedRoute {...Routes.自定义角色管理} />
                <AuthorizedRoute {...Routes.审批管理单详情} />
                <AuthorizedRoute {...Routes.员工数据管理} />
                <AuthorizedRoute {...Routes.业绩指标} />
                <AuthorizedRoute {...Routes.试点中心设置} />
                <AuthorizedRoute {...Routes.非活跃会员提醒设置}/>
                <AuthorizedRoute {...Routes.电子合同管理}/>
                <AuthorizedRoute {...Routes.账号绑定}/>
                <AuthorizedRoute {...Routes.中心费率设置}/>
                <AuthorizedRoute {...Routes.合同批量导入}/>

                {/*  财务管理 BMS角色可以访问  */}
                <Route render={()=>CommonUtils.isInclude(User.role, 'BMS')  ?  <FinanceAdministration /> : (<Redirect to={'/login'}/>)}/>
                <Route path="*" component={Err404}/>
            </Switch>
        )
    }
}

export {BasicSetting}
