import React from 'react';
import {Upload,Modal,Icon,message} from 'antd';
import {SetApi} from '@/api/settingApi';
import {Storage} from "@/common/utils/storage";
import './index.scss';
import {User} from "@/common/beans/user";

class AvatorUploadForm extends React.Component<any,any>{
  constructor(props){
    super(props);
    this.state={
      previewVisible:false,
      previewImage:'',
      fileList:[]
    }
  }

  beforeUpload = (file)=>{
      const isJPG = (
        file.type === 'image/jpeg'||
        file.type==='image/png'||
        file.type==='image/bmp'
      );
      if (!isJPG) {
          message.error('只能上传图片');
      }
      const isLt5M = file.size / 1024 / 1024 < 5;

      if (!isLt5M) {
          message.error('上传图片必须小于5MB!');
      }

      return new Promise(
          function(resolve, reject) {
              if (isJPG && isLt5M) {
                  resolve();
              } else { /* fail */
                  reject();
              }
          }
      );
  }

  handleCancel = () => this.setState({ previewVisible: false });

  uploadOnChange = (e) => {
      if (!e || !e.fileList) {
        return e;
      }

      let {fileList } = e;

      // 成功
      if (fileList[0] &&
          fileList[0].response &&
          fileList[0].response.code===1
      ) {
          fileList[0].fileId = fileList[0].response.data.id
          return fileList
      }

      return fileList;
  }

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  render(){
    const {getFieldDecorator}=this.props.form;
    const {field,form}=this.props;
    const {previewVisible,previewImage}=this.state;
    return(
      <React.Fragment>
        {getFieldDecorator(field, {
            rules: [],
            initialValue: [],
            valuePropName:'fileList',
            getValueFromEvent:this.uploadOnChange
        })(
            <Upload
              name="file"
              action={'/api'+SetApi.文件上传}
              data={{}}
              headers={{
                  'token':Storage.get('_token'),
                  centerCode: User.centerCode,
                  userId: User.userId,
                  userName: User.userName
              }}
              listType="picture-card"
              onPreview={this.handlePreview}
              beforeUpload={this.beforeUpload}
            >
              {form.getFieldValue(field).length > 0
              ? null
              : (
                <div>
                    <Icon type="plus" />
                    <div className="ant-upload-text">Upload</div>
                </div>
              )}
            </Upload>
        )}
        <Modal visible={previewVisible}
               footer={null}
               className="upload-avator"
               onCancel={this.handleCancel}>
            <img alt="preview" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </React.Fragment>
    )
  }
}

export {AvatorUploadForm};
