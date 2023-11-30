/**
 * desc: 耗课统计报表
 * User: Lyon.li@gymboglobal.com
 * Date: 2019/1/30
 * Time: 上午20：00
 */

import React, {Component, Fragment} from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {TabSquare} from "@/ui/component/tabSquare";
import {Switch, Redirect} from "react-router-dom";
import {AuthorizedRoute} from "@/router/authorizedRoute";
import {Routes} from "@/router/enum/routes";
import {User} from "@/common/beans/user";
import {PermissionMap} from "@/router/enum/routeFuncIdMap";

class ConsumerCourseStatistics extends Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            breadCrumbRoutes: [
                {
                    name: '报表'
                },
                {
                    name: '服务类报表'
                },
                {
                    name: '耗课统计'
                }
            ],
            tabList: [],      // 标签列表
            activeIndex: 0,  // 默认选中的标签页
        };
    }

    render() {
        const {breadCrumbRoutes, activeIndex, tabList} = this.state;
        return (
            <Fragment>
                <BreadCrumb routes={breadCrumbRoutes}/>
                <TabSquare tabList={tabList} activeIndex={activeIndex} onLiClick={this.handleClick}/>
                <Switch>
                    {
                        Routes.耗课统计.routes.map((route, i) => {
                            return (
                                <AuthorizedRoute
                                    key={i}
                                    {...route}
                                />
                            )
                        })
                    }
                    {/*默认加载到第一个路由*/}
                    {
                        tabList.length > 0 ? <Redirect to={`${Routes.耗课统计.path}/${tabList[0].id}`}/> : null
                    }
                </Switch>
            </Fragment>
        );
    }

    componentDidMount() {
        this.showTags();
    }

    /*根据权限,添加不同的标签页*/
    showTags = () => {
        const permissionList = User.permissionList;
        const gb = PermissionMap['耗课统计-GB'];
        const ga = PermissionMap['耗课统计-GA'];
        const ins = PermissionMap['耗课统计-INS'];
        const tabList = [];
        if (permissionList.includes(gb.join())) {
            tabList.push({
                title: 'GB',
                id: 'gb'
            });
        }

        if (permissionList.includes(ga.join())) {
            tabList.push({
                title: 'GA',
                id: 'ga'
            });
        }

        if (permissionList.includes(ins.join())) {
            tabList.push({
                title: 'INS',
                id: 'ins'
            })
        }

        this.setState(
            {
                tabList
            },
            this.setCheckedTab,
        )
    };

    /*根据Url，设置被选中的标签*/
    setCheckedTab = () => {
        const {tabList} = this.state;
        const urlArr = window.location.href.split('/');
        const current = urlArr[urlArr.length - 1];
        for (let i = 0; i < tabList.length; i++) {
            if (tabList[i].id === current) {
                this.setState({
                    activeIndex: i,
                });
                break;
            }
        }
    };

    /*切换标签页*/
    handleClick = (i, id) => {
        this.setState({
            activeIndex: i
        });
        this.props.history.replace(`${Routes.耗课统计.path}/${id}`);
    }
}

export default ConsumerCourseStatistics;
