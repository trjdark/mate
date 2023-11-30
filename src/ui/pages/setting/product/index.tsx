/**
 * desc: PR产品管理
 * User: debby
 * Date:
 * Time:
 */
import './style/index';
import React from 'react';
import {BreadCrumb} from "../../../component/breadcrumb";

import {Redirect, Switch} from "react-router-dom";
import {Routes} from "@/router/enum/routes";
import {AuthorizedRoute} from "../../../../router/authorizedRoute";

class Product extends React.Component<any, any>{
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
            name: 'PR产品管理',
            path: '',
            link: '#',
            id: 'productManage'
        }
    ];
    render(){
        return(
            <div>
                <BreadCrumb routes={this.routes} />
                <div id='gym-product' className='page-wrap gym-product-wrap'>
                    <Switch>
                        <Redirect strict={true} exact={true} to={Routes.产品管理列表.path} from={Routes.产品管理.path}/>
                        <AuthorizedRoute {...Routes.产品管理列表}/>
                        <AuthorizedRoute {...Routes.产品管理编辑}/>
                        <AuthorizedRoute {...Routes.产品管理新建}/>
                    </Switch>
                </div>
            </div>

        )
    }
}

export {Product}
