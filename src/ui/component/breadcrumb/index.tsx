/**
 * desc: 面包屑组件
 * Date: 2018/8/3
 * Time: 上午10:34
 */
import React from 'react';
import {Breadcrumb as AntdBreadCrumb} from 'antd';
import './index.scss';

declare interface RouteProps {
  name: string,
  path?: string,
  id?: string,
  link?: string
}

declare interface RoutesProps {
    routes: Array<RouteProps>,
}

class BreadCrumb extends React.Component<RoutesProps, any> {
  render() {
    const len = this.props.routes && this.props.routes.length - 1;
    return (
      <AntdBreadCrumb separator="/" className='gym-bread-wrap'>
        {
          (this.props.routes || []).map((route: RouteProps, index: number) =>
            <AntdBreadCrumb.Item key={route.name}>
              {/*todo 面包屑不需要跳转*/}
              <span className={`${len === index ? 'c333' : '' }`}>{route.name}</span>
            </AntdBreadCrumb.Item>)
        }
      </AntdBreadCrumb>
    )
  }
}

export {BreadCrumb}
