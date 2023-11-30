/**
 * desc: 总部课程包管理
 * Date: 2018/8/11
 * Time: 下午5:34
 */
import './style/index';
import React from 'react';
import {Switch, Redirect} from 'react-router-dom/index';
import {BreadCrumb} from "../../../component/breadcrumb";
import {AuthorizedRoute} from "../../../../router/authorizedRoute";
import {Routes} from "@/router/enum/routes";
import {connect} from "../../../../common/decorator/connect";
import {getCenterBaseSettingInfo} from "@redux-actions/setting/center";
import {
    selectCenterArea,
    selectCenterCity,
    selectCenterCityLevel,
    selectCenterProvince, selectCenterType
} from "../../../../saga/selectors/setting/center";

@connect(
    (state:any) => ({
    cityLevel: selectCenterCityLevel(state),
    centerArea: selectCenterArea(state),
    centerProvince: selectCenterProvince(state),
    centerCity: selectCenterCity(state),
    centerType: selectCenterType(state)
})
, {getCenterBaseSettingInfo})
class CourseGeneral extends React.Component<any, any>{
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
            name: '总部课程包设置',
            path: '',
            link: '#',
            id: 'course-general'
        }
    ];
    componentDidMount(){
        this.props.getCenterBaseSettingInfo()
    }
    render(){

        return(
            <div>
                <BreadCrumb routes={this.routes} />
                <div id='gym-general-course' className='page-wrap gym-general-course'>
                    <Switch>
                        <Redirect exact={true} to={Routes.总部课程包列表.path} from={Routes.总部课程包管理.path}/>
                        <AuthorizedRoute {...Routes.总部课程包列表}/>
                        <AuthorizedRoute {...Routes.总部课程包编辑}/>
                        <AuthorizedRoute {...Routes.总部课程包添加}/>
                    </Switch>
                </div>
            </div>

        )
    }
}

export {CourseGeneral}
