/**
 * desc: react-redux 的 connect 装饰器
 * Date: 2018/8/1
 * Time: 下午2:58
 */

import { connect as connectComponent } from 'react-redux';

export const connect = (mapStateToProps?: any, mapDispatchToProps?: any, mergeProps?:any, options?:any) => {
    return (target: any) => (
        connectComponent(mapStateToProps, mapDispatchToProps, mergeProps, options)(target) as any
    );
};
