/**
 * desc: GB仪表盘小卡片
 * User: Katarina.yuan@gymboglobal.com
 * Date: 2021/8/13
 * Time: 下午4:00
 */

import React, {Component} from 'react';
import {navConfigEnum} from "@/ui/pages/dashboard/common";
import {CommonUtils} from "@/common/utils/commonUtils";
import {CustomerRoutes} from "@/router/enum/customerRoutes";
import history from "@/router/history";
import {Tooltip} from "antd";
import {Icon} from '@/ui/component/icon';

declare interface BigPanelProps {
    dataSource:Array<any>,
    second?:boolean
}

class SmallPanel extends Component<BigPanelProps, any> {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    // 跳转到客户中心
    toCustomerCenter = function (obj) {
        const params = CommonUtils.stringify(obj);
        history.push(`${CustomerRoutes.分配客户.link}/${params}`);
    };
    render() {
        const {dataSource, second} = this.props
        return (
            <div  className={`page-wrap gym-dashboard-gb-card-panel ${second?'second':''}`}>
                {
                    dataSource && dataSource.map((item, index) => (
                        <div className="gym-dashboard-gb-card-panel-item" key={index}>
                            {
                                item.remark ? (
                                    <Tooltip
                                        title={item.remark}
                                    >
                                        <div className={`gym-dashboard-gb-card-panel-item-title ${second?'second':''}`}>
                                            {item.title}
                                            <Icon className="gym-dashboard-gb-card-panel-item-title-icon" type="wenti"/>
                                        </div>

                                    </Tooltip>
                                ) : <div className={`gym-dashboard-gb-card-panel-item-title ${second?'second':''}`}>{item.title}</div>
                            }
                            {
                                item.nav &&
                                <div
                                    className='gym-dashboard-second-panel-emphasize'
                                    onClick={() => this.toCustomerCenter({ phaseId: navConfigEnum[item.nav] })}
                                >
                                    {item.data}
                                </div>
                            }
                            {
                                !item.nav &&
                                <div className={item.data==="未设目标"?'gym-dashboard-gb-card-panel-item-title-red':''}>
                                {item.data}
                                </div>
                            }

                        </div>
                    ))
                }
            </div>
        )
    }
}

export default SmallPanel;
