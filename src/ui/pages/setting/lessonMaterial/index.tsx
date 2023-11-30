/**
 * Desc:课程设置
 * User: Debby.Deng
 * Date: 2018/8/16,
 * Time: 下午5:06
 */
import React from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {Redirect, Switch} from "react-router-dom";
import {Routes} from "@/router/enum/routes";
import {AuthorizedRoute} from "@/router/authorizedRoute";
import './style/index.scss';
import {User} from "@/common/beans/user";
import {getLessonMatType} from "@redux-actions/setting/lessonMaterialActions";
import {connect} from "@/common/decorator/connect";
@connect((state)=>({}),{
    getLessonMatType
})
class LessonMaterial extends React.Component<any, any>{
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
            name: '课程资料设置',
            path: '',
            link: '#',
            id: 'lessonMatMng'
        }
    ];
    componentDidMount(){
        const {getLessonMatType} = this.props;
        getLessonMatType({currentCenterId: User.currentCenterId});
    }
    render(){
        return(
            <div>
                <BreadCrumb routes={this.routes} />
                <div id='gym-lesson-category' className='page-wrap'>
                    <Switch>
                        <Redirect strict={true} exact={true} to={Routes.课程资料管理.path} from={Routes.课程资料.path}/>
                        <AuthorizedRoute {...Routes.课程资料管理}/>
                        <AuthorizedRoute {...Routes.课程资料编辑}/>
                        <AuthorizedRoute {...Routes.课程资料新建}/>
                    </Switch>
                </div>
            </div>

        )
    }
}

export {LessonMaterial}
