/**
 * desc: 市场渠道
 * User: Lyon.li@gymboglobal.com
 * Date: 2018/11/22
 * Time: 下午1:38
 */
import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import {Form, Row, Col, DatePicker} from "antd";
import {Select, Option} from "@/ui/component/select";
import {PageTitle} from "@/ui/component/pageTitle";
import {Input} from "@/ui/component/input";
import {TextArea} from "@/ui/component/input";
import {appearanceTypeList, purposeList} from "../enum";
import {getHistoryData, getChannelType} from "@redux-actions/market/marketDetail";
import {User} from "@/common/beans/user";
import {approvalStatusEnumValue} from "../enum";
import moment from 'moment';

/*解构出二级组件,方便调用*/
const {Item} = Form;
const {RangePicker} = DatePicker;

/*定义BasicInfoFormState的数据结构*/
interface BasicInfoFormState {
    [propName: string]: any
}

class BasicInfoForm extends Component<any, BasicInfoFormState> {
    private currentCenterId = User.user.currentCenterId;

    constructor(props) {
        super(props);
        this.state = {};
        this.handleChannelTypeChange = this.handleChannelTypeChange.bind(this);
    }

    render() {
        // 结构出props和state里面的值，方便调用
        const {
            form,
            isView,
            theme,
            purpose,
            channelType,
            appearanceType,
            channelRemark,
            startDate,
            endDate,
            channelTypeList,
            approvalStatus,
        } = this.props;
        const {getFieldDecorator} = form;
        const approved = (approvalStatus === approvalStatusEnumValue.已通过);
        return (
            <Fragment>
                <PageTitle title={`市场渠道基本信息`}/>
                <div className="gym-channel-form">
                    <Row>
                        <Col span={12}>
                            <Item label="市场渠道名称:" className={isView ? 'no-require gym-input-wrap' : 'gym-input-wrap'}>
                                {
                                    getFieldDecorator('theme', {
                                        initialValue: theme,
                                        rules: [
                                            {
                                                required: !isView,
                                                message: '渠道名称不能为空'
                                            },
                                        ]
                                    })(
                                        <Input style={{width: 250}} disabled={isView || approved} placeholder="请输入"/>
                                    )
                                }
                            </Item>
                        </Col>
                        <Col span={12}>
                            <Item label="市场渠道目的:" className={isView ? 'no-require gym-input-wrap' : 'gym-input-wrap'}>
                                {
                                    getFieldDecorator('purpose', {
                                        initialValue: purpose,
                                        rules: [
                                            {
                                                required: !isView,
                                                message: '渠道目的不能为空'
                                            },
                                        ]
                                    })(
                                        <Select
                                            placeholder="请选择"
                                            disabled={isView || approved}
                                            style={{width: 250}}
                                        >
                                            {
                                                purposeList.map(item => (
                                                    <Option value={item.key} key={item.key}>{item.value}</Option>))
                                            }
                                        </Select>
                                    )
                                }
                            </Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Item
                                label="开始与结束日期:"
                                className={isView ? 'no-require gym-input-wrap' : 'gym-input-wrap'}
                            >
                                {
                                    getFieldDecorator('startAndEndTime', {
                                        initialValue: [moment(startDate), moment(endDate)],
                                        rules: [
                                            {
                                                required: !isView,
                                                message: '时间不能为空'
                                            },
                                        ]
                                    })(
                                        <RangePicker
                                            style={{width: 250}}
                                            showTime={false}
                                            format="YYYY-MM-DD"
                                            disabled={isView || approved}
                                        />
                                    )
                                }
                            </Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Item label="渠道来源:" className={isView ? 'no-require gym-input-wrap' : 'gym-input-wrap'}>
                                {
                                    getFieldDecorator('channelType', {
                                        initialValue: channelType,
                                        rules: [
                                            {
                                                required: !isView,
                                                message: '渠道来源不能为空'
                                            },
                                        ]
                                    })(
                                        <Select
                                            placeholder="请选择"
                                            disabled={isView || approved}
                                            style={{width: 250}}
                                            onChange={this.handleChannelTypeChange}
                                        >
                                            {
                                                channelTypeList.map(item => (
                                                    <Option
                                                        value={item.code}
                                                        key={item.code}
                                                    >
                                                        {item.codeValue}
                                                    </Option>))
                                            }
                                        </Select>
                                    )
                                }
                            </Item>
                        </Col>
                        <Col span={12}>
                            <Item label="渠道出现方式:" className={isView ? 'no-require gym-input-wrap' : 'gym-input-wrap'}>
                                {
                                    getFieldDecorator('appearanceType', {
                                        initialValue: appearanceType,
                                        rules: [
                                            {
                                                required: !isView,
                                                message: '渠道出现方式不能为空'
                                            },
                                        ]
                                    })(
                                        <Select
                                            placeholder="请选择"
                                            disabled={isView || approved}
                                            style={{width: 250}}
                                        >
                                            {
                                                appearanceTypeList.map(item => (
                                                    <Option value={item.key} key={item.key}>{item.value}</Option>))
                                            }
                                        </Select>
                                    )
                                }
                            </Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Item label="渠道备注:" className={isView ? 'no-require gym-input-wrap' : 'gym-input-wrap'}>
                                {
                                    getFieldDecorator('channelRemark', {
                                        initialValue: channelRemark,
                                        rules: [
                                            {
                                                required: !isView,
                                                message: '渠道备注不能为空'
                                            },
                                        ]
                                    })(
                                        <TextArea
                                            className="remark"
                                            disabled={isView || approved}
                                            placeholder="请输入内容"
                                        />
                                    )
                                }
                            </Item>
                        </Col>
                    </Row>
                </div>
            </Fragment>
        )
    }

    componentDidMount() {
        const {getChannelType: getChannel} = this.props;
        // 页面加载时申请市场渠道来源
        getChannel({
            currentCenterId: this.currentCenterId,
            type: 'ChannelType'
        });
    }

    handleChannelTypeChange(value) {
        this.props.getHistoryData({
            channelType: value,
            currentCenterId: this.currentCenterId
        });
    }
}

const mapStateToProps = state => {
    const {theme, purpose, channelType, appearanceType, channelRemark, startDate, endDate, channelTypeList} = state.marketDetail;
    return {
        theme,          // 市场渠道名称
        purpose,        // 市场渠道目的
        channelType,    // 市场渠道来源
        appearanceType, // 市场渠道出现方式
        channelRemark,  // 市场渠道备注
        startDate,      // 开始日期
        endDate,        // 结束日期
        channelTypeList,    // 市场渠道列表
    }
};

const mapDispatchToProps = dispatch => {
    return {
        getHistoryData(params) {
            dispatch(getHistoryData(params));
        },
        getChannelType(params) {
            dispatch(getChannelType(params));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(BasicInfoForm);
