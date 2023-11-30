/**
 * desc: 中心课程包
 * Date: 2018/8/13
 * Time: 下午8:40
 */
import React from 'react';
import {Switch, Redirect} from 'react-router-dom/index';
import {AuthorizedRoute} from "../../../../router/authorizedRoute";
import {BreadCrumb} from "../../../component/breadcrumb";
import {Routes} from "@/router/enum/routes";

class CourseCenter extends React.Component<any> {
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
            id: 'member'
        },{
            name: '中心课程包设置',
            path: '',
            link: '#',
            id: 'course-center'
        }
    ];
    state = {
        status: 'manage'
    };
    render(){

        return(
            <div>
                <BreadCrumb routes={this.routes}/>
                <div className='page-wrap gym-center-course'>
                    <Switch>
                        <Redirect exact={true} to={Routes.中心课程包列表.path} from={Routes.中心课程包管理.path}/>
                        <AuthorizedRoute {...Routes.中心课程包列表}/>
                        <AuthorizedRoute {...Routes.中心课程包定价}/>
                        <AuthorizedRoute {...Routes.中心课程包促销}/>
                    </Switch>
                </div>
            </div>
        )
    }
}

export {CourseCenter}
