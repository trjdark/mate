/**
 * desc: 分装ant design
 * User: lyon.li@gymboglobal.com
 * Date: 2019/1/23
 * Time: 上午9:53
 */
import React, {Component} from 'react';
import {Tooltip as AntTooltip} from "antd";
import {TooltipProps} from "antd/es/tooltip";
import './style.scss';

class Tooltip extends Component <TooltipProps, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <AntTooltip
                getPopupContainer={() => document.querySelector('.gym-content')}
                {...this.props}
            >
                {this.props.children}
            </AntTooltip>
        )
    }
}

export {Tooltip}
