/**
 * Desc: 报名会员活动详情
 * User: gym.li@gymboglobal.com
 * Date: 2018/12/19,
 * Time: 下午20:10
 */
import React, {Component} from 'react';
import {connect} from "react-redux";
import moment from "moment";

class EnrollDetail extends Component <any, any> {
    constructor(props) {
        super(props);
    }

    render() {
        let {payMode, selectedBaby, selectedCourse=[], activityPayModeObj,} = this.props;
        let {effectiveTime = 0, endTime = 0, packageName} = selectedCourse;
        selectedBaby = Array.isArray(selectedBaby) ? (selectedBaby[0] || {}) : selectedBaby;
        let {babyName = ''} = selectedBaby;
        return (
            <div className="gym-activity-plan-table gym-radius" style={{width: '100%'}}>
                <table className="joined-member-table">
                    <tbody>
                    <tr>
                        <td>宝宝姓名</td>
                        <td>{babyName}</td>
                    </tr>
                        <tr>
                            <td>课程包</td>
                            <td>
                                {packageName && `${packageName}（${moment(effectiveTime).format('YYYY/MM/DD')}~${moment(endTime).format('YYYY/MM/DD')}）`}
                            </td>
                        </tr>
                        <tr>
                            <td>可选课时</td>
                            <td>
                                <span className="enroll-emphasize-text">
                                    {selectedCourse.usableCourseNum}
                                </span>
                            </td>
                        </tr>
                    <tr>
                        <td>付费方式</td>
                        <td>
                            <span className="enroll-emphasize-text">
                                {
                                    activityPayModeObj[payMode]
                                }
                            </span>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>

        )

    }
}

const mapStateToProps = state => {
    const {
        types,
        payMode,        // 付费方式
        selectedCourse, // 选中的课程
    } = state.activityDetail;
    const {
        activityPayModeObj,    // 活动付费方式枚举
    } = types;

    return {
        payMode,
        selectedCourse,
        activityPayModeObj,
    }
};

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(EnrollDetail);
