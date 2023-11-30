/**
*Desc: 图片上传组件
*User: Debby.Deng
*Date: 2018/8/17,
*Time: 下午12:13
*/
import React from 'react';
import { Upload as AntdUpload,Icon,message,Modal as AntdModal } from 'antd';
import {Storage} from "@/common/utils/storage";
import {SetApi} from '@/api/settingApi';
import './index.scss';
import {User} from "@/common/beans/user";

declare interface option {
    name?: string,
    showUploadList?: boolean,
    listType?:string,
    fileList?:Array<fileListSet>,
    onChange:(response:any, list:Array<any>)=>(void),//上传图片回调
    maxFileLength?:number
}

interface fileListSet {
    url:string,
    status:string,
    uid:string,
    name:string
}

function beforeUpload(file) {
    const isJPG = (file.type === 'image/jpeg'||file.type ==='image/png'||file.type==='image/bmp');
    if (!isJPG) {
        message.error('只能上传图片');
    }
    const isLt10M = file.size / 1024 / 1024 < 9.5;
    if (!isLt10M) {
        message.error('上传图片必须小于 10MB!');
    }
    return new Promise(
        function(resolve, reject) {
            if (isJPG && isLt10M) {
                resolve();
            } else { /* fail */
                reject();
            }
        }
    );
}
class UploadImg extends React.Component <option, any>{
    state = {
        previewVisible: false,
        previewImage: '',
        fileList:null,
    };
    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    };
    handleRemove=(file)=>{
        const fileList=this.state.fileList  ? this.state.fileList:  this.props.fileList;
        const finalFileList=fileList.filter((item)=> item.uid !== file.uid );
        this.setState({fileList:finalFileList});
        this.props.onChange(null, finalFileList);
    };
    handleChange = ({ fileList,file }) => {
        this.setState({ fileList });
        // 请求失败
        if (file.error) {
            this.setState({fileList:[]});
            message.error(file.error.message);
        // 请求成功，code失败
        } else if (file.response&&file.response.code===0) {
            this.setState({fileList:[]})
            message.error(file.response.msg);
        // 成功
        } else if (file.response&&file.response.code===1) {
            this.props.onChange(file.response, fileList)
        }
    };

    render() {
        const {
          previewVisible,
          previewImage,
        } = this.state;
        const {maxFileLength = 1} = this.props;
        const fileList =  this.state.fileList  ? this.state.fileList:  this.props.fileList;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );

        return (
            <div className="clearfix">
                <AntdUpload
                    name={this.props.name}
                    action={'/api'+SetApi.文件上传}
                    headers={{
                        'token':Storage.get('_token'),
                        centerCode: User.centerCode,
                        userId: User.userId,
                        userName: User.userName
                    }}
                    data={{}}
                    listType={'picture-card'}
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                    onRemove={this.handleRemove}
                    beforeUpload={beforeUpload}
                >
                    {(fileList && fileList.length) >= maxFileLength ? null : uploadButton}
                </AntdUpload>
                <AntdModal
                    visible={previewVisible}
                    footer={null}
                    onCancel={this.handleCancel}
                    width={800}
                >
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </AntdModal>
            </div>
        );
    }
}

export {UploadImg}
