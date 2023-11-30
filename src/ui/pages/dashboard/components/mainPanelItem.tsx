/**
 * desc: 看板顶部数据条目
 * User: Lyon.li@gymboglobal.com
 * Date: 2018/3/4
 * Time: 下午1:38
 */
 import React, {Component} from 'react';
 import {Tooltip} from "@/ui/component/toolTip";
 import {Icon} from 'antd';
 import {thousandNum} from "../common";

 export class MainPanelItem extends Component<any, any> {
     constructor(props) {
         super(props);
     }

     render() {
         const {title, remark, value} = this.props;
         const valueArr = String(value).split('.');
         return (
             <li className="gym-dashboard-main-panel-data-item">
                 <div className="gym-dashboard-main-panel-data-item-title">
                     {
                         remark ? (
                             <Tooltip
                                 title={remark}
                                 trigger="click"
                             >
                                 <span>{title}</span>
                                 <Icon className="gym-dashboard-main-panel-data-item-title-icon" type="info-circle"/>
                             </Tooltip>
                         ) : <span>{title}</span>
                     }
                 </div>
                 <p>
                     <span>{thousandNum(valueArr[0])}</span>
                     {valueArr[1] ? <span>.{valueArr[1]}</span> : null}
                 </p>
             </li>
         )
     }
 }
