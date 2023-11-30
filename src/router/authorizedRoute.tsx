/**
 * desc: 合法路由，加入权限控制
 * Date: 2018/8/2
 * Time: 下午6:55
 */
import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import {message} from "antd";

interface RouteProps {
    authority: () => boolean,       // 判断权限的函数
    component: any,                 // 路由组件
    redirectPath?: string,          // 重定向路径
    [propName: string]: any,
}

interface RouteState {
    authorized: boolean,        // 是否有权限进入本路由
    [propName: string]: any,
}

class AuthorizedRoute extends React.Component<RouteProps, RouteState> {
    static getDerivedStateFromProps(nextProps, prevState) {
        const {authority} = nextProps;
        if (typeof authority === 'function') {
            const {permission, message: text} = authority();

            if (!permission) {
                // 如果没有权限进入路由，弹出提示信息
                message.info(text, 3);
            }

            return {
                authorized: permission,
            }
        }
        return null;
    }

    constructor(props) {
        super(props);
        this.state = {
            authorized: true,
        }
    }

    render() {
        const {component: Component, ...rest} = this.props;
        const {authorized} = this.state;
        return (
            <Route
                {...rest}
                render={
                    (props: any) => !authorized ? (<Redirect to={rest.redirectPath || '/login'}/>) : (
                        <Component {...props} />)
                }
            />
        );
    }
}

export {AuthorizedRoute}
