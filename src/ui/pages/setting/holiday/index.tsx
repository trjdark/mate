/**
 * desc: 节假日管理
 * Date: 2018/8/15
 * Time: 下午4:10
 */
import './style/index';
import React from 'react';
import {Switch, Redirect} from "react-router";
import {AuthorizedRoute} from "../../../../router/authorizedRoute";
import {BreadCrumb} from "../../../component/breadcrumb";
import {Routes} from "@/router/enum/routes";


class Holiday extends React.Component<any, any>{
    private routes:Array<any> = [
        {
            name: '设置',
            path: '',
            link: '#',
            id: 'setting'
        },{
            name: '运营管理',
            path: '',
            link: '#',
            id: 'operation'
        },{
            name: '节假日设置',
            path: '',
            link: '#',
            id: 'holiday'
        }
    ];
    render(){
        return(
            <div>
                <BreadCrumb routes={this.routes}/>
                <div className='page-wrap gym-holiday'>
                    <Switch>
                        <Redirect strict={true} exact={true} to={Routes.节假日列表.path} from={Routes.节假日.path}/>
                        <AuthorizedRoute {...Routes.节假日列表}/>
                        <AuthorizedRoute {...Routes.节假日添加}/>
                        <AuthorizedRoute {...Routes.节假日修改}/>
                    </Switch>
                </div>
            </div>

        )
    }
}

export {Holiday}
