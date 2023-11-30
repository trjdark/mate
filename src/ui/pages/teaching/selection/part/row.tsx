/**
 * Desc: 课程表的每一行
 * User: dave.zhang
 */
import React from 'react'
import {TableUnit} from './tableUnit'
import {Consumer} from '../context';

class IntervalRow extends React.Component<any, any> {
    constructor(props) {
        super(props);
    }

    render() {
        const {interval, datarr} = this.props;

        return (
            <Consumer>
                {
                    ({setArrangement, arrange}) => (
                        <div className="row-wrapper">
                            <div className="interval">{interval}</div>
                            <div className="weekday-wrapper">
                                {
                                    datarr.map((dayCourseList, idx) =>
                                        <TableUnit
                                            key={idx}
                                            dayCourseList={dayCourseList}
                                            interval={interval}
                                            setArrangement={setArrangement}
                                            weekday={idx + 1}
                                            arrange={arrange}
                                        />
                                    )
                                }
                            </div>
                        </div>
                    )
                }
            </Consumer>
        )
    }
}

export {IntervalRow};
