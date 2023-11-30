import React, {Component, Fragment} from 'react';
import {Button, Icon, message, Spin, Upload} from "antd";
import {SetApi} from "@/api/settingApi";
import {fileDownload} from "@redux-actions/customer/batchImport";
import {User} from "@/common/beans/user";
import {Storage} from "@/common/utils/storage";
import {throttle} from 'lodash';
import './style.scss';

interface AttachmentAttr {
    attachmentId,       // 附件id
    attachmentName,     // 附件名称
    [propName: string]: any
}

interface UploadProps {
    hideUploadBtn: boolean,         // 隐藏上传按钮
    attachment: AttachmentAttr[],   // 已上传的文件列表
    deleteAttachment?: any,          // 删除文件的方法
    [propName: string]: any
}

interface UploadStates {
    uploading: boolean,     // 按钮的上传状态
    [propName: string]: any
}

const getToken = function () {
    // 用户token 保存在localstorage
    const _key = '_token';
    return Storage.exist(_key) ? {token: Storage.get(_key)} : null;
};

export class UploadDownloadFiles extends Component<UploadProps, UploadStates> {
    constructor(props) {
        super(props);
        this.state = {
            uploading: false
        };
        this.handleUploadChange = this.handleUploadChange.bind(this);
        this.beforeUpload = this.beforeUpload.bind(this);
        this.handleDownLoad = throttle(this.handleDownLoad, 2000, {'trailing': false});
    }

    render() {
        const {uploading} = this.state;
        const {hideUploadBtn, attachment, deleteAttachment} = this.props;
        const token = getToken();
        return (
            <Fragment>
                {
                    /*当处于新建状态时，显示提示文字，处于查看状态时，不显示*/
                    hideUploadBtn
                        ? null
                        : (
                            <Fragment>
                                <p className="gym-format-des">文件格式支持：xlsx、docx、jpg、png、bmp、txt、pdf、zip、rar、ppt、pptx 文件</p>
                                <p className="gym-format-des">总的不超过50M，单个不超过10M,最多允许上传5个文件</p>
                            </Fragment>
                        )
                }
                {
                    /*当处于查看状态时，显示下载连接，处于新建状态时，显示删除按钮*/
                    hideUploadBtn
                        ?
                        (
                            attachment.map(item => {
                                const {attachmentId, attachmentName} = item;
                                return (
                                    <span
                                        key={attachmentId}
                                        className="gym-adjunct"
                                        onClick={() => this.handleDownLoad(item)}
                                    >
                                        {attachmentName}
                                    </span>
                                )
                            })
                        )
                        : (
                            attachment.map((item, index) => {
                                const {attachmentId, attachmentName} = item;
                                return (
                                    <div
                                        key={attachmentId}
                                        className="gym-adjunct-box"
                                    >
                                        <span className="gym-adjunct-text">{attachmentName}</span>
                                        <Icon type="close" onClick={() => deleteAttachment(index)}/>
                                    </div>
                                )
                            })
                        )
                }
                {
                    /*当处于新建状态时，显示按钮，处于查看状态或者已经上传5张时，不显示*/
                    (hideUploadBtn || attachment.length >= 5)
                        ? null
                        : (
                            <div className="gym-upload-wrap">
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
                                    accept='png'
                                    onChange={this.handleUploadChange}
                                >
                                    <Button
                                        htmlType="button"
                                        type="primary"
                                        disabled={uploading}
                                        className="gym-radius-btn"
                                    >
                                        选择文件
                                    </Button>
                                </Upload>
                            </div>
                        )
                }
            </Fragment>
        )
    }

    /**
     * 文件上传之前进行处理，限制格式和大小
     * @param file 上传的文件对象
     * @return boolean  返回true可以上传，返回false阻止上传
     */
    beforeUpload(file: any) {
        const {size, name} = file;
        const nameArr = name.split('.');
        const ext = name.split('.')[nameArr.length - 1];
        const acceptExt = ['xlsx', 'docx', 'jpg', 'png', 'bmp', 'txt', 'pdf', 'zip', 'rar', 'ppt', 'pptx'];
        const isLt10M = size / 1024 / 1024 < 10;
        if (acceptExt.indexOf(ext) === -1) {
            message.error('文件格式错误，只支持xlsx、docx、jpg、png、bmp、txt、pdf、zip、rar、ppt、pptx 的文件！');
            return false;
        }

        if (!isLt10M) {
            // 大于限定值的时候阻止上传
            message.error('文件总的不超过50M，单个不超过10M,最多允许上传5个文件!');
            return false;
        }

        this.setState({
            uploading: true
        });

        return true;
    };

    /**
     * 处理文件上传时的状态变化
     * @param info 文件上传时不同阶段返回的不同信息
     */
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

    /**
     * 下载文件
     * @param item, 下载的目标文件
     */
    handleDownLoad(item) {
        const {attachmentId, attachmentName} = item;
        if (attachmentId) {
            message.info('正在下载，请稍后...');
            const data = {
                fileId: attachmentId,
                currentCenterId: User.currentCenterId
            };
            fileDownload(data, SetApi.多类型文件下载, attachmentName);
        }
    }
}
