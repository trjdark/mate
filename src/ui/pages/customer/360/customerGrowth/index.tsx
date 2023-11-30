/**
 *Desc: 客户成长
 *User: Debby.Deng
 *Date: 2018/11/5,
 *Time: 上午9:59
 */
import * as React from "react";
import {BreadCrumb} from "../../../../component/breadcrumb";
import {Tabs} from "../../../../component/tabs";
import {connect} from "../../../../../common/decorator/connect";
import {CommonUtils} from "../../../../../common/utils/commonUtils";
import {KeyEvent} from "./part/keyEventRecord";
import {GrowthTable} from "./part/growthTable";
import {Activity} from "./part/activityRecord";
import {Renew} from "./part/renewFollow";

@connect((state) => ({}), {})
class CustGrowth extends React.Component<any> {
    leadsId = CommonUtils.hasParams(this.props) ? CommonUtils.parse(this.props).leadsId : null;
    babyId = CommonUtils.hasParams(this.props) ? CommonUtils.parse(this.props).babyId : null;
    private routes: Array<any> = [
        {
            name: '客户',
            path: '',
            link: '#',
        },
        {
            name: '客户360',
            path: '',
            link: '#',
        }, {
            name: '客户成长',
            path: '',
            link: '#',
        }
    ];


    onTabChange = (index) => {
    };

    getPanes = () => {//返回panes
        const titleObj = {
            'transfer': '交接记录',
            'keyEvent': '特殊事件记录',
            'activity': '活动记录',
            /*'growth': '成长报告',
            'feedback': '随堂反馈',*/
            'renew': '续约跟进',
            'recommend': '热心推荐',
            'package': '课程包结束',
            'testRecord':'测评报告',
            'feedback': '随堂反馈',
            'feedbacknew': '随堂反馈2.0',
            'monthlyList': '月度回顾',
            'badgeList': '徽章记录',
            'promotionReport': '升班报告',
        };

        const panes = Object.keys(titleObj).map((type) => {
            if (type === 'keyEvent') {//关键事件有新增按钮
                return {
                    tabTitle: titleObj[type],
                    tabPane: <KeyEvent leadsId={this.leadsId} type={type}/>
                }
            } else if (type === 'renew') {
                return {
                    tabTitle: titleObj[type],
                    tabPane: <Renew leadsId={this.leadsId} type={type}/>
                }
            } else if (type === 'activity') { // 活动记录
                return {
                    tabTitle: titleObj[type],
                    tabPane: <Activity leadsId={this.leadsId} type={type}/>
                }
            }else {
                return {
                    tabTitle: titleObj[type],
                    tabPane: <GrowthTable leadsId={this.leadsId} type={type} babyId={this.babyId}/>
                }
            }

        });

        return panes;

    };

    componentDidMount() {
    }

    render() {
        return (
            <div className='gym-customer-growth'>
                <BreadCrumb routes={this.routes}/>
                <div>
                    <Tabs onChange={this.onTabChange} tabPanes={this.getPanes()}/>
                </div>
            </div>
        )
    }
}

export {CustGrowth}
