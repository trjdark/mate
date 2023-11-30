/**
 * desc: 活动详情组件
 * User: Lyon.li@gymboglobal.com
 * Date: 2018/12/7
 * Time: 下午1:38
 */
import React, {Component, Fragment} from 'react';
import {Form, Row, Col} from "antd";
import {connect} from "react-redux";
import {cloneDeep} from 'lodash';
import {PageTitle} from "@/ui/component/pageTitle";
import {TextArea} from "@/ui/component/input";
import {UploadDownloadFiles} from "@/ui/component/uploadDownloadFiles";
import {getStaffListOnWork} from "@redux-actions/activity/activityDetail";
import {User} from "@/common/beans/user";
import {Select,Option} from "@/ui/component/select";

const STAFFS = 'STAFFS';    // 设置员工列表

/*解构出二级组件,方便调用*/
const {Item} = Form;

class DetailForm extends Component<any, any> {
    private currentCenterId = User.currentCenterId;

    constructor(props) {
        super(props);
        this.state = {
            maxLength: 400,     // 最大输入数
            length: 0,          // 已输入数
        };
        this.handleSetAttachment = this.handleSetAttachment.bind(this);
        this.handleDeleteAttachment = this.handleDeleteAttachment.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
    }

    render() {
        const {length, maxLength} = this.state;
        const {form, isView, describe, staffList, attachments, staffs, staffsName} = this.props;
        const {getFieldDecorator} = form;
        return (
            <Fragment>
                <PageTitle title="活动详情" className="mt25"/>
                <div className="gym-channel-form">
                    <Row>
                        <Col>
                            <Item label="活动详情描述:" className={isView ? 'no-require gym-input-wrap' : 'gym-input-wrap'}>
                                {
                                    getFieldDecorator('describe', {
                                        initialValue: describe,
                                        rules: [
                                            {
                                                required: !isView,
                                                message: '活动详情描述不能为空'
                                            },
                                        ]
                                    })(
                                        <TextArea
                                            className="remark"
                                            maxLength={maxLength}
                                            placeholder="请输入内容"
                                            disabled={isView}
                                            onChange={this.handleTextChange}
                                            // 多写个blur事情是因为测试输入400字后用中文输入法乱敲一堆乱字符
                                            // 然后用鼠标点击输入框外面，乱字符就被输入进去了,
                                            // 所以用一个blur事件再截一下
                                            onBlur={this.handleTextChange}
                                        />
                                    )
                                }
                                {
                                    !isView ? (
                                        <p className="rest-letter-num">
                                            还能输入{maxLength - length > 0 ? maxLength - length : 0}字
                                        </p>
                                    ) : null
                                }
                            </Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Item label="参与员工:" className={isView ? 'no-require gym-input-wrap' : 'gym-input-wrap'}>
                                {
                                    getFieldDecorator('staffs', {
                                        initialValue: isView ? staffsName : staffs, // 查看页面下，直接显示名字，编辑状态下使用Id
                                        rules: [
                                            {
                                                required: !isView,
                                                message: '参与员工不能为空'
                                            },
                                        ]
                                    })(
                                        <Select
                                            mode="multiple"
                                            disabled={isView}
                                            filterOption={(input, option) => {
                                                const text = option.props.children as string;
                                                return text.toLowerCase().includes(input.toLowerCase())
                                            }}
                                            onChange={value => this.handleStaffChange(value, STAFFS)}
                                        >
                                            {
                                                staffList.map(item => {
                                                    const {staffId, userName} = item;
                                                    return (
                                                        <Option value={staffId} key={staffId}>{userName}</Option>
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
                        <Col span={24}>
                            <Item label="上传附件" className="no-require gym-input-wrap">
                                <UploadDownloadFiles
                                    attachment={attachments}
                                    setAttachment={this.handleSetAttachment}
                                    deleteAttachment={this.handleDeleteAttachment}
                                    hideUploadBtn={isView}
                                />
                            </Item>
                        </Col>
                    </Row>
                </div>
            </Fragment>
        )
    }

    componentDidMount() {
        // 页面加载时请求本中心所有职员
        const {getCenterStuffList} = this.props;
        const params = {
            currentCenterId: this.currentCenterId
        };
        getCenterStuffList(params);
    }

    /*选择参与员工时，设置数据*/
    handleStaffChange(value, type) {
        const {setActivityData} = this.props;
        setActivityData(type, value);
        window.requestAnimationFrame(() => {
            this.props.checkStaffConflict();
        })
    }

    /*填写活动描述时，计算剩余字数*/
    handleTextChange(e) {
        const value = e.target.value;
        this.props.form.setFieldsValue({describe: value.substr(0, this.state.maxLength)});
        this.setState({
            length: value.length
        });
    }

    /**
     * 上传附件后向redux设置数据
     * @param id 附件id
     * @param name 附件name
     */
    handleSetAttachment(id, name) {
        const attachments = cloneDeep(this.props.attachments);
        attachments.push({
            attachmentId: id,
            attachmentName: name
        });
        this.props.setActivityData('ATTACHMENT', attachments);
    }

    /**
     * 删除附件
     * @param index 需要删除的附件的索引
     */
    handleDeleteAttachment(index) {
        const attachments = cloneDeep(this.props.attachments);
        attachments.splice(index, 1);
        this.props.setActivityData('ATTACHMENT', attachments);
    }
}

const mapStateToProps = state => {
    const {
        describe,       // 活动详情
        attachments,    // 附件列表
        staffs,         // 参与员工
        staffsName,     // 参与员工name
        startDateTime,  // 活动时间
        duration,       // 时长,
        staffList,      // 在岗员工
    } = state.activityDetail;

    return {
        describe,
        staffList,
        staffs,
        staffsName,
        attachments,
        startDateTime,
        duration,
    }
};

const mapDispatchProps = dispatch => ({
    getCenterStuffList(params) {
        dispatch(getStaffListOnWork(params));
    },
});

export default connect(mapStateToProps, mapDispatchProps)(DetailForm);
