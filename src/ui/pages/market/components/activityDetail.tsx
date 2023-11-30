/**
 * desc: 市场渠道
 * User: Lyon.li@gymboglobal.com
 * Date: 2018/11/22
 * Time: 下午1:38
 */
import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import {Form, Row, Col, Button, Upload, message, Spin} from "antd";
import {PageTitle} from "@/ui/component/pageTitle";
import {TextArea} from "@/ui/component/input";
import {SetApi} from "@/api/settingApi";
import {setAttachment} from "@/saga/actions/market/marketDetail";
import {Storage} from "@/common/utils/storage";
import {User} from "@/common/beans/user";
import {fileDownload} from "@redux-actions/customer/batchImport";

/*解构出二级组件,方便调用*/
const {Item} = Form;

/*定义ActivityDetailState的数据结构*/
interface ActivityDetailState {
    [propName: string]: any
}

class ActivityDetail extends Component<any, ActivityDetailState> {
    private currentCenterId = User.user.currentCenterId;

    static getToken() {
        // 用户token 保存在localstorage
        const _key = '_token';
        return Storage.exist(_key) ? {token: Storage.get(_key)} : null;
    };

    constructor(props) {
        super(props);
        this.state = {
            uploading: false,   // 是否正在上传中
        };
        this.handleUploadChange = this.handleUploadChange.bind(this);
        this.handleDownLoad = this.handleDownLoad.bind(this);
    }

    render() {
        const {form, isView, describe} = this.props;
        const {getFieldDecorator} = form;
        return (
            <Fragment>
                <PageTitle title={`活动详情`} className="mt25"/>
                <div className="gym-channel-form">
                    <Row>
                        <Col span={24}>
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
                                        <TextArea className="remark" placeholder="请输入内容" disabled={isView}/>
                                    )
                                }
                            </Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Item label="添加活动附件" className="no-require gym-input-wrap">
                                <p className="format-des">文件格式支持：xls、xlsx、doc、docx、jpg、png、bmp、txt、pdf、zip、rar、7z、ppt、pptx文件
                                    小于10M</p>
                                <p className="format-des">仅支持上传单个附件，若重复上传则进行替换操作</p>
                                <div className="gym-adjunct-wrap">
                                    {this.createAttachmentList()}
                                    {this.createUploadBtn()}
                                </div>
                            </Item>
                        </Col>
                    </Row>
                </div>
            </Fragment>
        )
    }

    /*上传文件前，检查格式和大小，不符合规定不允许上传*/
    beforeUpload = (file: any) => {
        const {size, name} = file;
        const nameArr = name.split('.');
        const ext = name.split('.')[nameArr.length - 1];
        const acceptExt = ['xls', 'xlsx', 'doc', 'docx', 'jpg', 'png', 'bmp', 'txt', 'pdf', 'zip', 'rar', '7z', 'ppt', 'pptx'];
        const isLt20M = size / 1024 / 1024 < 10;
        if (acceptExt.indexOf(ext) === -1) {
            message.error('不允许上传此格式的文件！');
            return false;
        }

        if (!isLt20M) {
            // 大于限定值的时候阻止上传
            message.error('上传文件必须小于10MB!');
            return false;
        }

        this.setState({
            uploading: true
        });

        return true;
    };

    /*上传成功后，处理返回的数据*/
    handleUploadChange(info) {
        if (info.file.status === 'error') {
            message.error('网络问题，请稍后再试!');
            this.setState({
                uploading: false
            })
        }

        if (info.file.status === 'done') {
            const {response, name} = info.file;
            const uid = response.data.id;
            this.props.setAttachment(uid, name);
            this.setState({
                uploading: false
            })
        }
    }

    /*处理文件下载*/
    handleDownLoad(attachmentId, attachmentName) {
        if (attachmentId) {
            const data = {
                fileId: attachmentId,
                currentCenterId: this.currentCenterId
            };
            fileDownload(data, SetApi.多类型文件下载, attachmentName);
        }
    }

    /*生成附件列表*/
    createAttachmentList = () => {
        const {attachmentList, attachmentName, attachmentId} = this.props;
        return (
            attachmentList ? (
                // 这里是为了兼容老数据，当存在老数据时，展示成一个列表，否则展示成单个文件
                attachmentList.map(item => {
                    const {title, id, attachmentPath} = item;
                    return (
                        <span
                            key={id}
                            className="gym-adjunct"
                            onClick={() => this.handleDownLoad(attachmentPath, title)}
                        >
                            {title}
                        </span>
                    )
                })
            ) : (
                <span
                    className="gym-adjunct"
                    onClick={() => this.handleDownLoad(attachmentId, attachmentName)}
                >
                    {attachmentName}
                </span>
            )
        );
    };

    /*生成上传按钮*/
    createUploadBtn = () => {
        const {isView, attachmentName} = this.props;
        const {uploading} = this.state;
        const token = ActivityDetail.getToken();
        return (
            isView
                ? null
                : (
                    <span className="gym-upload-wrap">
                        {
                            uploading ? (
                                <div className="gym-spin-box">
                                    <Spin/>
                                </div>
                            ) : null
                        }
                        <Upload
                            action={'/api' + SetApi.文件上传}
                            beforeUpload={this.beforeUpload}
                            showUploadList={false}
                            headers={
                                Object.assign({}, token, {
                                    centerCode: User.centerCode,
                                    userId: User.userId,
                                    userName: User.userName
                                })
                            }
                            onChange={this.handleUploadChange}
                        >
                            <Button
                                htmlType="button"
                                type="primary"
                                disabled={uploading}
                                className="gym-radius-btn"
                            >
                                {attachmentName ? '重新选择' : '选择文件'}
                            </Button>
                        </Upload>
                    </span>
                )
        )
    }
}

const mapStateToProps = state => {
    const {describe, attachmentName, attachmentId, attachmentList} = state.marketDetail;
    return {
        describe,
        attachmentName,
        attachmentId,
        attachmentList: attachmentList,  // 这个字段是为了兼容老数据，没有老数据时这个值不存在
    }
};

const mapDispatchToProps = dispatch => ({
    setAttachment(fileId, attachmentName) {
        dispatch(setAttachment(fileId, attachmentName))
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(ActivityDetail);
