/**
 * desc: 看板顶部数据显示和距离月底天数组件
 * User: Lyon.li@gymboglobal.com
 * Date: 2018/2/28
 * Time: 下午1:38
 */

 import React, {Component} from 'react';
 import moment from 'moment';
 
 export class MainPanel extends Component<any, any> {
     constructor(props) {
         super(props);
         this.state = {
             restDays: 0
         }
     }
 
     render() {
         const {children, lastSyncDatetime} = this.props;
         return (
             <div className="gym-dashboard-main-panel-wrap">
                 <div className="page-wrap gym-dashboard-main-panel">
                     <div className="gym-dashboard-main-panel">
                         <ul className="gym-dashboard-main-panel-data">
                             {children}
                         </ul>
                         {
                             lastSyncDatetime ? (
                                 <p className="gym-dashboard-main-panel-time">数据更新时间：{moment(lastSyncDatetime).format('YYYY-MM-DD HH:mm')}</p>
                             ) : null
                         }
                     </div>
                 </div>
                 <div className="page-wrap gym-dashboard-rest-days">
                     <div className="gym-dashboard-rest-days-title">
                         <p>距离</p>
                         <p>月底天数</p>
                     </div>
                     <div className="gym-dashboard-rest-days-text">{this.state.restDays}</div>
                 </div>
             </div>
         );
     }
 
     componentDidMount() {
         this.getRestDays();
     }
 
     /*计算剩余天数*/
     getRestDays = () => {
         const date = new Date();
         const today = date.getDate();
         const month = date.getMonth();
         const year = date.getFullYear();
         const monthEnd = new Date(year, month + 1, 0).getDate();
         this.setState({
             restDays: monthEnd - today
         })
     }
 }
 