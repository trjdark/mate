/**
 * Desc: 上课签到带左右箭头切换日期选择
 * User: Debby.Deng
 * Date: 2018/12/5,
 * Time: 上午9:32
 */
import * as React from "react";
import moment from 'moment';
import './index.scss'
import {Icon} from "@/ui/component/icon";
import {Consumer} from "@/common/decorator/context";

interface PropSet {
    timeStamp?: number,
    onResetDate?: (time) => (void),
}

class SlideTitle extends React.Component<PropSet> {

    resetDate = (direct, providerParams) => {
        const {timeStamp, onResetDate} = this.props;
        let time = null;
        if (direct === 'pre') {
            time = moment(timeStamp).subtract(1, 'days').startOf('day').valueOf();
        } else if (direct === 'next') {
            time = moment(timeStamp).add(1, 'days').startOf('day').valueOf();
        }
        if (providerParams.switchDate) {
            providerParams.switchDate(time);
        } else if (onResetDate) {
            onResetDate(time);
        }
    };

    getDateAndWeek = (timestamp) => {
        const weekString = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日',];
        const date = moment(timestamp).format('MM/DD');
        const week = weekString[moment(timestamp).weekday()];
        return `${date} ${week}`
    };

    render() {
        const {timeStamp} = this.props;
        return (
            <Consumer>
                {
                    (providerParams) => {
                        return (
                            <div className="gym-teaching-slide-title text-c">
                                <span onClick={this.resetDate.bind(this, 'pre', providerParams)}>
                                    <Icon className='gym-teaching-slide-title-icon' type={`left`}/>
                                </span>
                                <span className='mlr20'>
                                    {this.getDateAndWeek(timeStamp)}
                                </span>
                                <span onClick={this.resetDate.bind(this, 'next', providerParams)}>
                                    <Icon className='gym-teaching-slide-title-icon' type={`right`}/>
                                </span>
                            </div>
                        )
                    }
                }
            </Consumer>
        )
    }
}

export {SlideTitle}
