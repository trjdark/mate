/**
*Desc:课程分类设置
*User: Debby.Deng
*Date: 2018/8/16,
*Time: 下午5:06
*/
import React from 'react';
import {BreadCrumb} from "../../../component/breadcrumb";
import {Redirect, Switch} from "react-router-dom";
import {Routes} from "@/router/enum/routes";
import {AuthorizedRoute} from "../../../../router/authorizedRoute";

class LessonCategory extends React.Component<any, any>{
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
            name: '课程分类设置',
            path: '',
            link: '#',
            id: 'lessonMng'
        }
    ];
    state = {
        status: 'manage'
    };


    render(){
        return(
            <div>
                <BreadCrumb routes={this.routes} />
                <div id='gym-lesson-category' className='page-wrap'>
                    <Switch>
                        <Redirect strict={true} exact={true} to={Routes.课程分类管理.path} from={Routes.课程分类.path}/>
                        <AuthorizedRoute {...Routes.课程分类管理}/>
                        <AuthorizedRoute {...Routes.课程分类编辑}/>
                        <AuthorizedRoute {...Routes.课程分类新建}/>
                    </Switch>
                </div>
            </div>
        )
    }
}

export {LessonCategory}
