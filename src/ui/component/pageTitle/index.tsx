/**
 * desc: 页面标题组件
 * Date: 2018/8/11
 * Time: 下午1:42
 */

import { Icon as ComponentIcon } from '@/ui/component/icon';
import { Tooltip } from "antd";
import React from 'react';
import {Icon} from "../icon";
import './index.scss';

declare interface PageTitleProps {
    title:string | React.ReactNode;
    className?:string;
    rightTitle?:string;
    remark?:string
}


class PageTitle extends React.Component<PageTitleProps,any>{
    render(){
        const {title,remark, rightTitle} = this.props;
        return(
            <div className={`gym-page-title ${this.props.className ? this.props.className: ''}`}>
                <div className='gym-page-title-wrap c333'>
                    <Icon className='gym-page-title-icon' type='biaoti'/>

                    {
                         remark ? (
                             <Tooltip
                                 title={remark}
                             >
                                 {title}
                                 <ComponentIcon className="remarkIcon" type="wenti"/>
                             </Tooltip>
                         ) : (title)
                     }
                    {
                        rightTitle && <span style={{
                            position:"absolute",
                            right:'.5rem',
                            padding:'.2rem .6rem',
                            borderRadius:'.3rem',
                            backgroundColor:'#009cbd',
                            color:'#f9f9f9',
                        }}>{rightTitle}</span>
                    }
                </div>
            </div>
        )
    }
}

export {PageTitle}
