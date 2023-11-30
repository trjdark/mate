/**
 * Desc: 课程表
 * User: dave.zhang
 */
import React,{Fragment} from 'react';
import {IntervalRow} from './row'
import {ArrangeItem} from './arrangeItem';
import {transWeekday} from "../common";

const rowTitle = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];     // 用来生成表头

class CourseTable extends React.Component<any, any> {
    constructor(props) {
        super(props);
    }

    /*把传入的序号转换成时间段*/
    transTime = (str: string) => {
        const time = str.charAt(0) === '0' ? str.charAt(1) : str;
        return `${time}:00`
    };

    render() {
        const {arrange, tableList} = this.props;
        const tableTimeList = Object.keys(tableList).sort((a: any, b: any) => (a - b));
        return (
            <div className="selection-table-wrapper shadow">
                <div className="table">
                    <IntervalRow interval={null} datarr={rowTitle}/>
                    {
                        tableTimeList.map(item => {
                            return (
                                <IntervalRow key={item} interval={this.transTime(item)} datarr={tableList[item]}/>
                            )
                        })
                    }
                </div>
                <div className="arrange">
                    {
                        arrange.interval &&
                        <Fragment>
                            <div className="arrange-title">
                                周
                                {
                                    transWeekday(arrange.weekday)
                                }
                                {
                                    arrange.interval
                                }
                                课程安排
                            </div>
                            <div className="arrange-body">
                                {
                                    arrange.list.map((item, idx) =>
                                        <ArrangeItem key={idx} course={item}/>
                                    )
                                }
                            </div>
                        </Fragment>
                    }
                </div>
            </div>
        )
    }
}

export {CourseTable};
