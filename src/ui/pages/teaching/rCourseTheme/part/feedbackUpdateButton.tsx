import React, {Component, Fragment} from 'react';
import {Modal, Card, Popover,Divider} from "antd";
import {nanoid} from "nanoid";
import {RenderFunction} from "@/ui/pages/teaching/rCourseTheme/part/renderFunction";
import {feedbackTemplate} from "@/ui/pages/teaching/rCourseTheme/tmp/feedback";
import {getOssToken} from "@redux-actions/teaching/rCourse";
import {User} from "@/common/beans/user";
import OSS from "ali-oss";
import QRCode from 'qrcode.react';
export interface ComponentValue {
    id: string; // id 唯一
    url?: string; // 跳转地址
    component?: any; // 组件
    content?: string; // 文本内容
    previewUrl?: string; // 预览地址
    type: any; // 组件类型
    file?: File | { [key: string]: any }; // 图片文件
    [key: string]: any;
}

class FeedbackUpdateButton extends Component<any, any>{
    constructor(props) {
        super(props);
        const {theme} = props;
        this.state = {
            visible:false,
            componentList:theme.feedbackRaw ? JSON.parse(theme.feedbackRaw) :[],
        }
    }
    showModal = () => {
        this.setState({visible:true})
    }
    closeModal = () => {
        this.setState({visible:false})
    }
    handleAddPlan = async ()=> {
        const {theme} = this.props;
        const {componentList} = this.state;
        const htmlStr = feedbackTemplate({
            title: '详情',
            fullData: componentList
        })
        const token =  await getOssToken({currentCenterId:User.currentCenterId}, 'image');
        const {stsToken, accessKeyId, accessKeySecret, path, bucket, visitHost} = token;
        const ossClient = new OSS({
            bucket: bucket,
            region: 'oss-cn-shanghai',
            stsToken, accessKeyId, accessKeySecret
        });
        try{
            const result = await ossClient.put(`${path}/${nanoid()}.html`, new (OSS as any).Buffer(htmlStr));
            const {name} = result;
            const param = {
                feedbackUrl: `${visitHost}${name}`,
                feedbackRaw: JSON.stringify(componentList)
            };
            this.props.emitAddFeedback(param);
            this.closeModal();
        }catch (e){

        }

    }
    /**
     * 添加组建
     */
    addPart = (type: 'planMenu' | 'image' | 'video' | 'music'| 'theme' | 'courseReceiveDesc' | 'courseReceive' | 'carefullyReview') => {
        let param = {};
        switch (type){
            case 'planMenu':
            case 'theme':
                param = {
                    id: nanoid(),
                    file:{},
                    type: type,
                    text: '',
                    content: ''
                };

                break;
            case "image":
                param = {
                    id:nanoid(),
                    type: type,
                    file:{},
                    previewUrl: '',
                }
                break;
            case 'music':
                param = {
                    id:nanoid(),
                    type: type,
                    file:{},
                    previewUrl: '',
                    musicName:''
                }
                break;
            case 'video':
                param = {
                    id:nanoid(),
                    type: type,
                    file:{},
                    video: '',
                    cover:''
                }
                break;
            case 'courseReceiveDesc':
            case 'carefullyReview':
                param = {
                    id: nanoid(),
                    file:{},
                    type: type,
                    text: '',
                };
                break;
            case 'courseReceive':
                param = {
                    id: nanoid(),
                    file:{},
                    type: type,
                    content: [],
                };
                break;
        }
        this.setState(pre => {
            return {
                componentList: [...pre.componentList, param]
            }
        })
    }
    /**
     * 更新组建值
     */
    handleChange = (arg, type, id) => {
        let newMap = arg;
        this.setState(pre => {
            const idx = pre.componentList.map(item => item.id).indexOf(id);
            return {
                componentList: [
                    ...pre.componentList.slice(0, idx),
                    Object.assign({}, pre.componentList[idx], newMap)
                    ,...pre.componentList.slice(idx+1)]
            }
        })
    };
    /**
     * 操作组建顺序
     */
    operateComponent = (idx:number, type:'delete' | 'reset' | 'up' | 'down') => {
        switch (type){
            case 'delete':
                this.setState(pre => {
                    return {
                        componentList: [
                            ...pre.componentList.slice(0, idx),
                            ...pre.componentList.slice(idx + 1)]
                    }
                })
                break;
            case 'reset':
                const arr = ['id', 'type'];
                const newComponent = {};
                for(let key in this.state.componentList[idx]){
                    if(arr.includes(key)){
                        newComponent[key] = this.state.componentList[idx][key];
                    }else{
                        newComponent[key] = ''
                    }
                }
                this.setState(pre => {
                    return {
                        componentList: [
                            ...pre.componentList.slice(0, idx),
                            newComponent,
                            ...pre.componentList.slice(idx + 1)]
                    }
                })
                break;
            case 'up':
                this.setState(pre => {
                    return {
                        componentList: [
                            ...pre.componentList.slice(0, idx - 1),
                            pre.componentList[idx],
                            pre.componentList[idx - 1],
                            ...pre.componentList.slice(idx + 1)]
                    }
                })
                break;
            case 'down':
                this.setState(pre => {
                    return {
                        componentList: [
                            ...pre.componentList.slice(0, idx),
                            pre.componentList[idx + 1],
                            pre.componentList[idx],
                            ...pre.componentList.slice(idx + 2)]
                    }
                })
                break;
        }
    };
    render(){
        const {visible, componentList} = this.state;
        const {theme} = this.props
        return (
            <Fragment>
                <span className='cDefault mr15 pointer' onClick={this.showModal}>编辑</span>
                {
                    theme.feedbackUrl
                    ?<Popover
                            overlayClassName='gym-r-course-popover'
                            content={
                                <div className='p10'>
                                    <QRCode value={theme.feedbackUrl} trigger='click'/>
                                </div>
                            }
                        >
                            <span className='cDefault pointer'>预览</span>
                        </Popover>
                    : <span className='cDefault pointer'>预览</span>
                }
                <Modal
                    visible={visible}
                    title='随堂反馈'
                    destroyOnClose={true}
                    onOk={this.handleAddPlan}
                    onCancel={this.closeModal}
                    width={900}
                >
                    <div className='size20'>
                        课程主题:<span>{theme.themeName}</span>
                    </div>
                    <Divider/>
                    <div className='gym-r-course-modal'>
                        <div className='gym-r-course-modal-part'>
                            <p>组建区</p>
                            <div className='gym-r-course-modal-item'>
                                <Card className='gym-r-course-modal-item-part' onClick={() => this.addPart('theme')}>主题简介</Card>
                                <Card className='gym-r-course-modal-item-part' onClick={() => this.addPart('courseReceiveDesc')}>课程收获-描述</Card>
                                <Card className='gym-r-course-modal-item-part' onClick={() => this.addPart('courseReceive')}>课程收获-详情</Card>
                                <Card className='gym-r-course-modal-item-part' onClick={() => this.addPart('carefullyReview')}>认真复习</Card>
                                <Card className='gym-r-course-modal-item-part' onClick={() => this.addPart('image')}>教案图片</Card>
                                <Card className='gym-r-course-modal-item-part' onClick={() => this.addPart('music')}>教案音频</Card>
                                <Card className='gym-r-course-modal-item-part' onClick={() => this.addPart('video')}>教案视频</Card>
                            </div>
                        </div>
                        <div className='gym-r-course-modal-part'>
                            <p>功能区</p>
                            <Card className='gym-r-course-modal-item-view'>
                                <RenderFunction
                                    componentList={componentList}
                                    emitChangeValue={this.handleChange}
                                    emitActionComponent={this.operateComponent}
                                />
                            </Card>
                        </div>
                    </div>
                </Modal>
            </Fragment>
        )
    }
}
export {FeedbackUpdateButton}
