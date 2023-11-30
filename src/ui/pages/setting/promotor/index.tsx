/**
 * desc: PR产品管理
 * User: debby
 * Date:
 * Time:
 */
import React from 'react';
import {BreadCrumb} from "../../../component/breadcrumb";
import {Redirect, Switch} from "react-router-dom";
import {Routes} from "@/router/enum/routes";
import {AuthorizedRoute} from "../../../../router/authorizedRoute";
import './style/index.scss';

class Promotor extends React.Component<any, any>{
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
            name: 'Promotor设置',
            path: '',
            link: '#',
            id: 'promotorManage'
        }
    ];


    render(){
        return(
            <div>
                <BreadCrumb routes={this.routes} />
                <div id='gym-promotor' className='page-wrap gym-promotor-wrap'>
                    <Switch>
                        <Redirect strict={true} exact={true} to={Routes.promotor管理列表.path} from={Routes.promotor管理.path}/>
                        <AuthorizedRoute {...Routes.promotor管理列表}/>
                        <AuthorizedRoute {...Routes.promotor管理编辑}/>
                        <AuthorizedRoute {...Routes.promotor管理新建}/>
                    </Switch>
                </div>
            </div>

        )
    }
}

export {Promotor}
