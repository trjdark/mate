/*
 * @desc: 
 * @Author: luck
 * @User: luck.yuan@gymboglobal.com
 * @Date: 2021-09-18 16:45:20
 * @LastEditTime: 2021-10-20 16:23:10
 */
import React, { Component } from "react";
import { Icon } from '@/ui/component/icon';
import {Icon as AntdIcon} from 'antd';
import { Tooltip } from "antd";

export class GaPanelItem extends Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            updateBtn:false
        }
    }

    /*数字被点击*/
    numClick = () => {
        const { handleNumClick } = this.props;
        if (typeof handleNumClick === "function") {
            handleNumClick();
        }
    };

    /*更新按钮被点击*/
    updateClick = () => {
        const { handleUpdateClick } = this.props;
        this.setState({
            updateBtn: !this.state.updateBtn
        });
        if (typeof handleUpdateClick === "function") {
            handleUpdateClick();
        }
    };
    
    render() {
        const { title, value, remark, icon, data, isLink, second} = this.props;
        const {updateBtn} = this.state;
        return (
            <div className="gym-dashboard-ga-panel-card-data-item">
                <div className={`gym-dashboard-ga-panel-card-data-item-title ${second?'second':''}`}>
                    {remark 
                    ? <Tooltip title={remark}>
                            <span className={title === '本月过期未完成任务'?'red':''}>{title}</span>
                            <Icon className="gym-dashboard-ga-panel-card-data-item-title-icon" type="wenti"/>
                            {icon && <AntdIcon className="gym-dashboard-ga-panel-card-data-item-title-update" type="sync"/>}
                    </Tooltip>
                    :<p>
                        <span className={title === '本月过期未完成任务'?'red':''}>{title}</span>
                        {icon && <AntdIcon
                            className={`gym-dashboard-ga-panel-card-data-item-title-update ${
                                updateBtn ? "start" : "end"
                            }`}
                            type={icon}
                            onClick={this.updateClick}
                        />}
                    </p>
                    }
                </div>
                <p className="gym-dashboard-ga-panel-card-data-item-data">
                    <span className={isLink ? 'themeColor' : ''} onClick={this.numClick}>{value}</span>
                    {data ? (
                        <span>&nbsp;(&nbsp;<span className={`${data === '未设目标' ? "red":''}`}>{data}</span>&nbsp;)</span>
                    ) : (
                        ''
                    )}
                </p>
            </div>  
        );
    }
}
