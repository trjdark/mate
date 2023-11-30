/**
 * desc: 政策调整
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2023/5/5
 * Time: 上午9:50
 */
import React, {Component,Fragment} from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {PDFlist, deletePDF, savePDF} from "@redux-actions/report/pos";
import {User} from "@/common/beans/user";
import {Upload, message} from 'antd';
import {SetApi} from "@/api/settingApi";
import {Storage} from "@/common/utils/storage";
import {ConfirmCheck} from "@/ui/component/confirmCheck";
import './index.scss';
import {FUNC} from "@/ui/pages/setting/enum/functions";

function beforeUpload(file) {
    const isJPG = (file.type === 'application/pdf' || file.type === 'pdf');
    if (!isJPG) {
        message.error('只能上传PDF');
    }
    const isLt10M = file.size / 1024 / 1024 < 99.5;
    if (!isLt10M) {
        message.error('上传文件必须小于 10MB!');
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

class  Policy extends Component<any, any> {
    private breadCrumbRoutes = [
        {name:'报表'},{name:'中心订货额度'},{name:'政策管理'}
    ];
    constructor(props){
        super(props)
        this.state = {
            data: []
        }
    }
    componentDidMount(){
        this.getData();
    }
    getData = () => {
        const param = {currentCenterId: User.currentCenterId}
        PDFlist(param).then((res) => {
            this.setState({data:res})
        })
    }
    handleUpload = ({ fileList,file }) => {
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
            const { id, fileName } = file.response.data;
            const param = {
                fileId: id,
                fileName: fileName,
                currentCenterId: User.currentCenterId
            }
            savePDF(param).then(res => {
                this.getData();
            })
        }
    };
    handleCancel = (node) => {
        const {id} = node;
        const param = {
            id: id,
            currentCenterId:User.currentCenterId
        }
        deletePDF(param).then(() => {
            message.success('删除成功！')
            this.getData();
        })
    }
    render(){
        const {data} = this.state;
        return (
            <Fragment>
                <BreadCrumb routes={this.breadCrumbRoutes}/>
                <div className='page-wrap'>
                    <div className='gym-policy-list'>
                        <p>权益金政策查看</p>
                    </div>
                    {
                        data.map((item, index) =>
                                <div key={`policy_${index}`} className='gym-policy-list'>
                                    <a
                                        target="_blank"
                                        href={`${location.protocol}//${location.host}/api/mate-basic/basic/file/fileView?fileId=${item.fileId}&token=${User.getToken}`}
                                    >
                                        {item.fileName}</a>
                                    {
                                        User.permissionList.includes(FUNC['政策管理(编辑)']) &&
                                        <ConfirmCheck
                                            button='删除'
                                            item={item}
                                            ensure={this.handleCancel}
                                            contentText='是否删除此次记录？'
                                        />
                                    }

                                </div>)
                    }
                    <br/>
                    {
                        User.permissionList.includes(FUNC['政策管理(编辑)']) &&
                        <Upload
                            name='file'
                            action={'/api'+SetApi.文件上传}
                            onChange={this.handleUpload}
                            headers={{
                                'token':Storage.get('_token'),
                                centerCode: User.centerCode,
                                userId: User.userId,
                                userName: User.userName
                            }}
                            beforeUpload={beforeUpload}
                            showUploadList={false}
                        >
                            <button className='gym-button-default gym-button-xs'>上传</button>
                        </Upload>
                    }

                </div>
            </Fragment>
        )
    }
}

export {Policy}
