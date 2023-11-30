/**
 * desc: 给组件添加查询数据及下载方法的高阶组件
 * User: Lyon.li@gymboglobal.com
 * Date: 2019/2/16
 * Time: 上午10:38
 */

import React, {Component} from 'react';

export function GetDataAndDownload({getData, download, breadCrumbRoutes, ...rest}) {
    return (WrappedComponent) => {
        return class extends Component<any, any> {
            constructor(props) {
                super(props);
            }

            render() {
                return (
                    <WrappedComponent
                        {...this.props}
                        getData={getData}
                        download={download}
                        breadCrumbRoutes={breadCrumbRoutes}
                        {...rest}
                    />
                )
            }
        }
    }
}
