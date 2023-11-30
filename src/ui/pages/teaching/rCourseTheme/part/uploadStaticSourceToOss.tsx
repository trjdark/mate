import React, {Component, Fragment} from 'react';
import {findDOMNode} from "react-dom";
import {nanoid} from "nanoid";
import {getOssToken} from "@redux-actions/teaching/rCourse";
import {User} from "@/common/beans/user";
import OSS from "ali-oss";
import {Spin, Icon} from "antd";

declare interface UploadStaticSourceToOssProps{
    node:any,
    emitUpload:(arg, type, id) => void,
    type: 'music' | 'image'
}
class UploadStaticSourceToOss extends Component<any, any>{
    private input:any;
    state = {
        loading: false
    }
    handleSelectFile = (e) => {
        const input:any = findDOMNode(this.input)
        input.click();
    }
    upload = async (e, type, id) => {
        this.setState({loading:true})
        const file = this.input.files[0];
        const fileName = `${nanoid()}.${file.type.split('/')[1]}`;
        const token =  await getOssToken({currentCenterId:User.currentCenterId}, type);
        const {stsToken, accessKeyId, accessKeySecret, path, bucket, visitHost} = token;
        const ossClient = new OSS({
            bucket: bucket,
            region: 'oss-cn-shanghai',
            stsToken, accessKeyId, accessKeySecret
        });
        try{
            const uploadResult = await ossClient.multipartUpload(`${path}/${fileName}`, file, {});
            const value = type === 'image'
                ? {previewUrl :visitHost + uploadResult.name}
                : {previewUrl :visitHost + uploadResult.name, musicName:file.name};
            this.props.emitUpload(value, type, id);
            this.setState({loading:false})
        }catch (err){
            this.setState({loading:false})
        }
    }
    render(){
        const {node, type} = this.props;
        const {loading} = this.state;
        return(
            <div>
                <Spin spinning={loading}>
                    {
                        node.previewUrl
                            ? <div>
                                {
                                    type === 'image'
                                        ? <img src={node.previewUrl} alt="" style={{width: '100%'}}/>
                                        : <div className='gym-r-course-modal-music'>
                                            <Icon type="play-circle" className='gym-r-course-modal-music-icon'/>
                                            <p className='gym-r-course-modal-music-title'>{node.musicName}</p>
                                        </div>
                                }
                            </div>
                            : <Fragment>
                                <p>上传{type === 'image' ? '图片' : '音频'}</p>
                                <div className='gym-r-course-modal-upload' onClick={this.handleSelectFile}>
                                    上传文件
                                    <input type="file" ref={ref => this.input = ref}
                                           onChange={(e) => this.upload(e, node.type, node.id)}
                                           accept={type === 'image' ? "image/*" : "audio/mpeg, audio/ogg"}
                                           className='gym-r-course-modal-upload-file'
                                    />
                                </div>
                            </Fragment>
                    }
                </Spin>
            </div>
        )
    }
}
export {UploadStaticSourceToOss}
