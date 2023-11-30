/**
 * Desc: 课程表的单元格
 * User: dave.zhang
 */
import React from 'react';
import {Col, Row} from 'antd';
import {getCourseType} from '../../enum/selectCourse';
import {uniqBy} from 'lodash';

class TableUnit extends React.Component<any, any> {
    constructor(props) {
        super(props);
    }

    getUnitContent = () => {
        const {interval, dayCourseList} = this.props;
        if (interval) {
            // 非表头的情况
            const {dayCourseList} = this.props;
            const _list = uniqBy(dayCourseList, 'courseCode');  // 根据课程代码去重
            return (
                <Row className="courseWrapper" onClick={this.onUnitClick}>
                    {
                        _list.map((item, idx) => {
                            const {courseCode} = item;
                            return (
                                <Col span={22} key={idx} className="col">
                                    <div className="spot" style={{backgroundColor: getCourseType(courseCode)}}/>
                                    <div className="spot-name">{courseCode}</div>
                                </Col>
                            )
                        })
                    }
                </Row>
            )
        } else {
            // 表头
            return dayCourseList;
        }
    };

    /*点击该单元格时，把单元格里的排课内容设置到排课列表里*/
    onUnitClick = () => {
        const {dayCourseList, interval, weekday} = this.props;
        this.props.setArrangement({
            list: dayCourseList,
            interval: interval,
            weekday: weekday
        })
    };

    /*计算哪些单元格添加选中的类名*/
    selectedClassName = () => {
        const {interval, weekday, arrange} = this.props;
        if (interval === arrange.interval && weekday === arrange.weekday) {
            return 'selected'
        } else {
            return ''
        }
    };

    /*计算哪些单元格添加选中的背景*/
    selectedBackground = () => {
        const {interval, dayCourseList} = this.props;
        if (interval) {
            let isSelected = dayCourseList.some(course => course.selected);
            if (isSelected) {
                return 'selected-background'
            } else {
                return ''
            }
        }
    };

    render() {
        const {interval, weekday} = this.props;

        return (
            <div
                className={
                    `unit ${
                        this.selectedClassName()
                        } ${
                        this.selectedBackground()
                        } ${
                        interval ? '' : 'title'
                        } ${
                        (!interval && weekday === 1) ? 'topLeftRadius' : ''
                        } ${
                        (interval === '21:00' && weekday === 1) ? 'bottomLeftRadius' : ''
                        }`
                }
            >
                {this.getUnitContent()}
            </div>
        )
    }
}

export {TableUnit};
