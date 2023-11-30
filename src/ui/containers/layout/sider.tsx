/**
 * desc:
 * User:
 * Date: 2018/8/3
 * Time: 下午2:00
 */
import React from "react";
import { Link } from "react-router-dom";
import { Menu, Badge } from "antd";
import { Icon } from "@/ui/component/icon";
import { User } from "@/common/beans/user";
import { CommonUtils } from "@/common/utils/commonUtils";
import history from "../../../router/history";
import { getLinkCode } from "@redux-actions/homeActions";
import { routerMap } from "@/router/enum/routes";
import {siderList} from "@/ui/containers/layout/enum/siderEnum";
import {FUNC} from "@/ui/pages/setting/enum/functions";
import {getApprovalList} from "@redux-actions/report/approve";

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class Sider extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            totalSize: 0
        }
    }

    componentDidMount(){
        if(User.permissionList.includes(FUNC['审批报表导出申请']) && !User.isHQ){
            const param = {
                pageNo:1,
                pageSize:10,
                approvalStatus: '0',
                currentCenterId:User.currentCenterId
            }
            getApprovalList(param).then(res => {
                this.setState({totalSize: res.totalSize})
            })
        }
    }
    // 判断权限
    isExist(funcId: string | boolean) {
        if(typeof funcId === 'boolean' && funcId){
            return true;
        }
        const { permissionList } = this.props;
        return permissionList.includes(funcId)
    }

    /**
     * 总部中心是否显示
     */
    isHQ = (type : string) => {
        if(typeof type === "undefined"){
            return true;
        }
        switch (type) {
            case '1' :
                return User.isHQ;
            case '0' :
                return  !User.isHQ;
            case '2' :
                return true;
            case '3' :
                return CommonUtils.isInclude(User.role, 'BMS')
        }
    };
    getSelectedKeys = () => {
        const { pathname } = history.location;
        // 基础设置中对主页路(上一层级)由进行匹配
        const masterPath = pathname.split('/').filter((item, index, arr) => {
            return index < arr.length - 1;
        }).join('/');
        if (routerMap[masterPath]) {
            return [routerMap[masterPath]]
        }
        return [pathname, masterPath];
    };
    /**
     * 跳转展业平台
     */
    link = (type: 'link') => {
        switch (type) {
            case 'link':
                const param = {
                    currentCenterId: User.currentCenterId,
                    staffId: User.userId
                };
                getLinkCode(param, (res) => {
                    CommonUtils.newWin(`${process.env.linkQiMengUrl}?code=${res}&centerCode=${User.centerCode}`, 'zhanYe');
                });
            break;
        }

    };
    /**
     *  跳转区域化看板系统
     */
    linkToDashBoard = (type:string) => {
        switch (type) {
            case 'consumeCourse':
                CommonUtils.newWin(`${process.env.areaDashboardUrl}?token=${User.getToken}&url=/consumeCourse/list`, 'dashboard');
                return;
            case 'workload':
                CommonUtils.newWin(`${process.env.areaDashboardUrl}?token=${User.getToken}&url=/workLoad/list`, 'dashboard');
                return;
            case 'backend':
                CommonUtils.newWin(`${process.env.areaDashboardUrl}?token=${User.getToken}&url=/backend/list`, 'dashboard');
                return;
            case 'marketSales':
                CommonUtils.newWin(`${process.env.areaDashboardUrl}?token=${User.getToken}&url=/marketSales/list`, 'dashboard');
                return;
            case 'marketingStatistics':
                CommonUtils.newWin(`${process.env.areaDashboardUrl}?token=${User.getToken}&url=/marketingStatistics/list`, 'dashboard');
                return;
            case 'brExport':
                CommonUtils.newWin(`${process.env.areaDashboardUrl}?token=${User.getToken}&url=/brExport/list`, 'dashboard');
                return;
        }
    };
    /**
     * 是否拥有子菜单
     */
    hasChildMenu = (arr:Array<any>):boolean => {
        if(!arr){
            return false
        }
        return arr.some(item => (this.isExist(item.authority) && this.isHQ(item.isShow)))
    };
    render() {
        const {totalSize} = this.state;
        return (
            <div className='gym-menu'>
                <Menu
                    mode="vertical"
                    selectedKeys={this.getSelectedKeys()}
                >
                    {
                        (siderList || []).map((item) =>
                            (this.isHQ(item.isShow) && this.isExist(item.authority))
                                ? (
                                    <SubMenu key={item.key}
                                             title={
                                                 <span className='gym-menu-item' onClick={() => this.link(item.eventType)}>
                                                    <Icon className='gym-menu-item-icon' type={item.iconType}/>
                                                    <span className='gym-menu-item-text'>{item.title}</span>
                                                </span>
                                             }
                                    >
                                        {
                                            (item.children || []).map((menuItem) =>
                                                (this.isHQ(menuItem.isShow) && this.hasChildMenu(menuItem.list))
                                                    ? (
                                                        <MenuItemGroup
                                                            key={menuItem.key}
                                                            title={menuItem.title}
                                                        >
                                                            {/*****如果三级菜单有path属性则站内跳转，如果有handleLink属性则绑定事件linkToDashBoard***/}
                                                            {
                                                                (menuItem.list || []).map((menu) => (
                                                                    (( typeof menu.isShow === 'undefined' ? true : this.isHQ(menu.isShow) ) && this.isExist(menu.authority))
                                                                    ? (
                                                                        menu.path
                                                                            ? (
                                                                                <Menu.Item key={menu.path}>
                                                                                    <Link to={menu.path}>{
                                                                                        (menu.title === '审批报表导出申请' && totalSize > 0 ) ? <Badge count={totalSize} offset={[15, 5]}>{menu.title}</Badge> : menu.title
                                                                                    }</Link>
                                                                                </Menu.Item>
                                                                            )
                                                                            : (
                                                                                <Menu.Item key={menu.handleLink} onClick={() => this.linkToDashBoard(menu.handleLink)}>
                                                                                    {menu.title}
                                                                                </Menu.Item>
                                                                            )
                                                                    )
                                                                    : null
                                                                ))
                                                            }
                                                        </MenuItemGroup>
                                                    )
                                                    : null
                                            )
                                        }
                                    </SubMenu>
                                )
                            : null
                        )
                    }
                </Menu>
            </div>

        )
    }
}

export { Sider }
