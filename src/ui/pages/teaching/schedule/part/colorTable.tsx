/**
 * Desc: 排课表颜色模块
 * User: Debby.Deng
 * Date: 2018/11/29,
 * Time: 下午7:28
 */

import * as React from "react";
import {Table} from "antd";
import timeLine, {scheduleWeekDay, weekSquareWidth} from "../../enum/schedule";
import {SlideTitle} from "../../component/slideTitle";
import {connect} from "@/common/decorator/connect";
import {
    selectScheduleRoom, selectScheduleRoomOnlyId
} from "@/saga/selectors/teaching/scheduleSelector";
import {Icon} from "@/ui/component/icon";

interface Props {
    week: any,              // 周几
    courseData: Array<TableSquareSet>,
    isBlock?: boolean,      // 是否占全屏(临时排课为true, 固定排课为false)
    onEmptyClick: (time, room, week) => (void),
    onEditSquare: (squareInfo) => (void),
    isHoliday?: boolean,

    [propsName: string]: any,
}

interface TableSquareSet {
    classroomName: string,          // 教室名称
    courseCode: string,             // 课程
    startTime: string,              // 课程开始时间
    endTime: string,                // 课程结束时间
    primaryInsStaffName?: string,   // 主教名字
    style: any,// 样式
}

@connect(
    (state) => ({
        roomList: selectScheduleRoom(state),
        roomListOnlyId: selectScheduleRoomOnlyId(state),
    }),
    {}
)
class ColorTable extends React.Component<Props> {
    state = {
        emptyDataSource: []
    };
    /**
     * 过滤掉课程结束时间是否大于10点
     * @param list
     * @returns {any}
     */
    filterCourse = (list) => {
        return list.filter((item) => {
            const endArr = item.endTime.split(':');
            const endHH = Number(endArr && endArr[0]);
            const endmm = Number(endArr && endArr[1]);
            if (endHH >= 22) {
                return (endHH === 22 && endmm === 0)
            }
            return true;
        })
    };

    handleEdit = (squareInfo) => {
        const {isHoliday} = this.props;
        if (!isHoliday) {
            this.props.onEditSquare(squareInfo);
        }
    };

    getColorSquare() {
        const colorData = this.filterCourse(this.props.courseData);
        const {isBlock, isHoliday} = this.props;
        return colorData.map((square, index) => {
            if (!square.style) {
                return
            }
            return isBlock ? (// 临时排课
                    <div
                        key={index}
                        className={`gym-color-table-square-temporary plr20 ${isHoliday ? '' : 'pointer'}`}
                        style={square.style}
                        onClick={this.handleEdit.bind(this, square)}
                    >
                        <span className='size20 gym-color-table-square-temporary-left'>{square.courseCode}</span>
                        <div className='gym-color-table-square-temporary-right'>
                            <p className='c666'>{`${square.startTime}-${square.endTime}`}</p>
                            <p className='c999'>{`${square.primaryInsStaffName}`}</p>
                        </div>
                    </div>
                ) :
                (// 固定排课
                    <div
                        key={index}
                        className='gym-color-table-square-week'
                        style={square.style}
                        onClick={this.handleEdit.bind(this, square)}
                    >
                        <span className={ (square.courseCode && square.courseCode.length > 6) ?'gym-color-table-square-week-word-long':'gym-color-table-square-week-word'}>
                            {square.courseCode}
                        </span>
                    </div>
                )
        })
    }

    addNewSquare = (record, columns) => {
        const {week} = this.props;
        const {emptyDataSource} = this.state;
        return {
            onClick: () => {
                this.props.onEmptyClick(record.time.timeStr, columns, week)
            },
            onMouseEnter: (e) => {
                emptyDataSource[record.time.index][columns] = true;
                this.setState({
                    emptyDataSource: emptyDataSource
                })
            },
            onMouseLeave: (e) => {
                emptyDataSource[record.time.index][columns] = false;
                this.setState({
                    emptyDataSource: emptyDataSource
                })
            }
        }
    };

    componentDidMount() {
        const dataSource = this.state.emptyDataSource;
        for (let i = 0; i < 15; i++) {
            dataSource.push({
                time: {
                    index: i,
                    timeStr: timeLine[i]
                },
            })
        }
        this.setState({emptyDataSource: dataSource});
    }

    render() {
        const {week, roomList, isBlock, isHoliday = false} = this.props;
        const columns = roomList.map((room) => {
            return {
                title: <div className='gym-color-table-header'>{room.classroomName}</div>,
                dataIndex: room.id,
                key: room.id,
                width: isBlock ? '250px' : weekSquareWidth + 'px',
                onCell: (record) => {
                    return isHoliday ? null : this.addNewSquare(record, room.id)
                },
                align: "center",
                render: (text) => (text ? (<div className='gym-color-table-plus'><Icon type='tianjia'/></div>) : '')
            }
        });
        const isMonday = week === scheduleWeekDay[0].name;
        const isSunday = week === scheduleWeekDay[6].name;
        const {emptyDataSource} = this.state;
        return (
            <div
                className={`gym-color-table bgWhite ${isBlock ? 'gym-color-table-block' : ''} ${isMonday ? 'gym-color-table-monday' : ''}
                ${isSunday ? 'gym-color-table-sunday' : ''}
                `}
            >
                {
                    isBlock ?
                        <SlideTitle timeStamp={week}/> :
                        <p className='gym-color-table-title'>{week}</p>
                }
                <div className='pos_rel' style={{overflowX: 'auto',}}>
                    <Table
                        pagination={false}
                        rowKey={(record) => (record.time.timeStr)}
                        columns={columns}
                        dataSource={emptyDataSource}
                    />
                    {this.getColorSquare()}
                </div>
            </div>
        )
    }
}

export {ColorTable}
