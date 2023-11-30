/**
 * desc: 活动基本信息
 * User: Lyon.li@gymboglobal.com
 * Date: 2018/12/7
 * Time: 下午1:38
 */
import React, {Component, Fragment} from 'react';
import {Form, Row, Col, DatePicker} from "antd";
import {Select, Option} from "@/ui/component/select";
import {Input} from "@/ui/component/input";
import {PageTitle} from "@/ui/component/pageTitle";
import {connect} from "react-redux";
import moment from 'moment';
import {checkClassRoom} from "@redux-actions/activity/activityDetail";
import {setClassroomUsable} from "@/saga/actions/activity/activityDetail";
import {User} from "@/common/beans/user";

/*解构出二级组件,方便调用*/
const {Item} = Form;

const DURATION = 'DURATION';    // 设置活动时间
const FIELDTYPE = 'FIELDTYPE';  // 地点类型
const CLASSROOMID = 'CLASSROOMID';  // 设置教室id
const STARTTIME = 'STARTTIME';  // 设置开始时间

class BaseInfoForm extends Component<any, any> {
    constructor(props) {
        super(props);
        this.checkClassroomUsable = this.checkClassroomUsable.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleTimeChange = this.handleTimeChange.bind(this);
    }

    render() {
        // 结构出props和state里面的值，方便调用
        const {
            form, isView, teachingActivityPurpose, fieldType, teachingFieldType, purpose, fieldTypeEnum,
            teachingActivityType, startDateTime, theme, type, activityField, classRoomId, duration, classroomList,
            teachActivityCostDuration
        } = this.props;
        const {getFieldDecorator} = form;
        return (
            <Fragment>
                <PageTitle title="基本信息"/>
                <div className="gym-channel-form">
                    <Row>
                        <Col span={12}>
                            <Item label="活动类型:" className={isView ? 'no-require gym-input-wrap' : 'gym-input-wrap'}>
                                {
                                    getFieldDecorator('type', {
                                        initialValue: type,
                                        rules: [
                                            {
                                                required: !isView,
                                                message: '活动类型不能为空'
                                            },
                                        ]
                                    })(
                                        <Select
                                            placeholder="请选择"
                                            disabled={isView}
                                            style={{width: 250}}
                                        >
                                            {
                                                teachingActivityType.map(item => {
                                                    const {code, codeValue} = item;
                                                    return (
                                                        <Option value={code} key={code}>
                                                            {codeValue}
                                                        </Option>
                                                    )
                                                })
                                            }
                                        </Select>
                                    )
                                }
                            </Item>
                        </Col>
                        <Col span={12}>
                            <Item label="活动名称:" className={isView ? 'no-require gym-input-wrap' : 'gym-input-wrap'}>
                                {
                                    getFieldDecorator('theme', {
                                        initialValue: theme,
                                        rules: [
                                            {
                                                required: !isView,
                                                message: '活动名称不能为空'
                                            },
                                        ]
                                    })(
                                        <Input style={{width: 250}} disabled={isView} placeholder="请填写"/>
                                    )
                                }
                            </Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Item label="活动目的:" className={isView ? 'no-require gym-input-wrap' : 'gym-input-wrap'}>
                                {
                                    getFieldDecorator('purpose', {
                                        initialValue: purpose,
                                        rules: [
                                            {
                                                required: !isView,
                                                message: '活动目的不能为空'
                                            },
                                        ]
                                    })(
                                        <Select
                                            placeholder="请选择"
                                            disabled={isView}
                                            style={{width: 250}}
                                        >
                                            {
                                                teachingActivityPurpose.map(item => {
                                                    const {code, codeValue} = item;
                                                    return (
                                                        <Option value={code} key={code}>
                                                            {codeValue}
                                                        </Option>
                                                    )
                                                })
                                            }
                                        </Select>
                                    )
                                }
                            </Item>
                        </Col>
                        <Col span={12}>
                            <Item label="活动时间:" className={isView ? 'no-require gym-input-wrap' : 'gym-input-wrap'}>
                                {
                                    getFieldDecorator('startDateTime', {
                                        initialValue: moment(startDateTime),
                                        rules: [
                                            {
                                                required: !isView,
                                                message: '活动时间不能为空'
                                            },
                                        ]
                                    })(
                                        <DatePicker
                                            style={{width: 250}}
                                            showTime={true}
                                            format="YYYY-MM-DD HH:mm"
                                            disabled={isView}
                                            onChange={this.handleTimeChange}
                                        />
                                    )
                                }
                            </Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Item label="活动时长:" className={isView ? 'no-require gym-input-wrap' : 'gym-input-wrap'}>
                                {
                                    getFieldDecorator('duration', {
                                        initialValue: duration,
                                        rules: [
                                            {
                                                required: !isView,
                                                message: '活动时长不能为空'
                                            },
                                        ]
                                    })(
                                        <Select
                                            placeholder="请选择"
                                            disabled={isView}
                                            style={{width: 250}}
                                            onChange={(value) => this.handleChange(value, DURATION)}
                                        >
                                            {
                                                teachActivityCostDuration.map(item => {
                                                    const {code, codeValue} = item;
                                                    return (
                                                        <Option value={code} key={code}>{codeValue}</Option>
                                                    )
                                                })
                                            }
                                        </Select>
                                    )
                                }
                            </Item>
                        </Col>
                        <Col span={12}>
                            <Item label="地点类型:" className={isView ? 'no-require gym-input-wrap' : 'gym-input-wrap'}>
                                {
                                    getFieldDecorator('fieldType', {
                                        initialValue: fieldType,
                                        rules: [
                                            {
                                                required: !isView,
                                                message: '地点类型不能为空'
                                            },
                                        ]
                                    })(
                                        <Select
                                            placeholder="请选择"
                                            disabled={isView}
                                            style={{width: 250}}
                                            onChange={(value) => this.handleChange(value, FIELDTYPE)}
                                        >
                                            {
                                                teachingFieldType.map(item => {
                                                    const {code, codeValue} = item;
                                                    return (
                                                        <Option
                                                            value={code}
                                                            key={code}
                                                        >
                                                            {codeValue}
                                                        </Option>
                                                    )
                                                })
                                            }
                                        </Select>
                                    )
                                }
                            </Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            {
                                fieldType === fieldTypeEnum.教室 ? (
                                    <Item
                                        label="活动教室"
                                        className={isView ? 'no-require gym-input-wrap' : 'gym-input-wrap'}
                                    >
                                        {
                                            getFieldDecorator('classRoomId', {
                                                initialValue: classRoomId,
                                                rules: [
                                                    {
                                                        required: !isView,
                                                        message: '活动地点不能为空'
                                                    },
                                                ]
                                            })(
                                                <Select
                                                    placeholder="请选择"
                                                    disabled={isView}
                                                    style={{width: 250}}
                                                    onChange={(value) => this.handleChange(value, CLASSROOMID)}
                                                >
                                                    {
                                                        classroomList.map(item => {
                                                            const {id, classroomName} = item;
                                                            return (
                                                                <Option value={id} key={id}>
                                                                    {classroomName}
                                                                </Option>
                                                            )
                                                        })
                                                    }
                                                </Select>
                                            )
                                        }
                                    </Item>
                                ) : (
                                    <Item
                                        label="活动地点"
                                        className={isView ? 'no-require gym-input-wrap' : 'gym-input-wrap'}
                                    >
                                        {
                                            getFieldDecorator('activityField', {
                                                initialValue: activityField,
                                                rules: [
                                                    {
                                                        required: !isView,
                                                        message: '活动地点不能为空'
                                                    },
                                                ]
                                            })(
                                                <Input style={{width: 250}} disabled={isView} placeholder="请填写"/>
                                            )
                                        }
                                    </Item>
                                )
                            }
                        </Col>
                    </Row>
                </div>
            </Fragment>
        )
    }

    /*处理change事件*/
    handleChange(value, type) {
        const {setActivityData} = this.props;
        setActivityData(type, value);
        window.requestAnimationFrame(() => {
            this.checkClassroomUsable();        // 检查教室是否可用
            this.props.checkStaffConflict();    // 检查员工行程是否冲突
        })
    }

    /*处理活动时间的change事件*/
    handleTimeChange(value) {
        const {setActivityData} = this.props;
        setActivityData(STARTTIME, value.valueOf());
        window.requestAnimationFrame(() => {
            this.checkClassroomUsable();        // 检查教室是否可用
            this.props.checkStaffConflict();    // 检查员工行程是否冲突
        })
    }

    /*检查教室是否可用*/
    checkClassroomUsable() {
        const {classRoomId, startDateTime, duration, fieldType, fieldTypeEnum} = this.props;
        // 当地点类型不是教室时，把教室变量设置为可用，否则将不能提交
        if (fieldType !== fieldTypeEnum.教室) {
            this.props.setClassroomUsable(true);
            return;
        }
        // 当教室，活动时间，活动时长全部有值时，校验教室是否可用
        if (classRoomId && startDateTime && duration && (fieldType === fieldTypeEnum.教室)) {
            const params = {
                currentCenterId: User.currentCenterId,
                classRoomId: classRoomId,
                startTime: startDateTime,
                endTime: startDateTime + (duration * 60 * 60 * 1000)
            };
            this.props.checkClassroom(params);
        }
    }
}

const mapStateToProps = state => {
    const {
        types,          // 各种类型值
        type,           // 活动类型
        theme,          // 活动名称
        purpose,        // 活动目的
        startDateTime,  // 活动时间
        fieldType,      // 地点类型
        activityField,  // 活动地点
        classRoomId,        // 教室Id
        duration,           // 时长,
        classroomList,      // 教室列表
    } = state.activityDetail;

    const {
        teachActivityCostDuration,   // 教学活动时长
        teachingActivityType,        // 教学活动类型
        teachingActivityPurpose,     // 教学活动目的选项
        fieldType: teachingFieldType,// 教学活动地点类型
        fieldTypeEnum,               // 教学活动地点类型的枚举值
    } = types;

    return {
        teachingActivityType,
        teachingActivityPurpose,
        teachingFieldType,
        purpose,
        startDateTime,
        fieldType,
        theme,
        type,
        activityField,
        classRoomId,
        duration,
        fieldTypeEnum,
        classroomList,
        teachActivityCostDuration
    }
};

const mapDispatchToProps = dispatch => ({
    checkClassroom(params) {
        dispatch(checkClassRoom(params));
    },
    setClassroomUsable(bool) {
        dispatch(setClassroomUsable(bool));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(BaseInfoForm);
