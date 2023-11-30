import React, {Component, Fragment} from 'react';
import {Input, TextArea} from "@/ui/component/input";
import {Option, Select} from "@/ui/component/select";
import {connect} from "@/common/decorator/connect";
import { selectRCourseVideo} from "@/saga/selectors/teaching/rCourseSelector";
import {UploadStaticSourceToOss} from "@/ui/pages/teaching/rCourseTheme/part/uploadStaticSourceToOss";
import {CourseHarvest} from "@/ui/pages/teaching/rCourseTheme/part/courseHarvest";
import {Icon} from "antd";

@connect((state) => ({
    videoList: selectRCourseVideo(state),
}), {})
class RenderFunction extends Component<any, any>{
    /**
     * 改变目录
     */
    handleChange = (value, type, id) => {
        const values = {text: value, content: value};
        this.props.emitChangeValue(values, type, id)
    }
    /**
     * 选择视频
     * @param e
     * @param type
     * @param id
     */
    selectVideo = (e, type, id) => {
        const {videoList} = this.props;
        const selectedVideo = videoList.filter( video => video._id === e)[0];
        const {cover} = selectedVideo;
        this.props.emitChangeValue({video: e, cover}, type, id);
    }
    /**
     * 改变主题，简介，目录，复习
     * @param value
     * @param type
     * @param id
     * @param key
     */
    handleChangeContent = (value, type, id, key) => {
        const values = {[key]: value};
        this.props.emitChangeValue(values, type, id)
    }
    /**
     * 渲染
     * @param node
     */
    view = (node) => {
        const {videoList} = this.props;
        switch(node.type){
            case 'planMenu':
                return <Input
                    className='gym-r-course-modal-plan-menu'
                    placeholder="请输入教案目录"
                    onChange={(e) => this.handleChange(e.target.value, node.type, node.id)}
                    value={node.text}
                />;
            case 'image':
                return <Fragment>
                    <UploadStaticSourceToOss
                        node={node}
                        type={node.type}
                        emitUpload={this.props.emitChangeValue}
                    />
                </Fragment>;
            case 'music':
                return <Fragment>
                    <UploadStaticSourceToOss
                        node={node}
                        type={node.type}
                        emitUpload={this.props.emitChangeValue}
                    />
                </Fragment>
            case 'video':
                return <Fragment>
                    {
                        node.video
                        ? <div className='gym-r-course-modal-video'>
                            {
                                node.cover
                                ? <img src={node.cover} alt="" style={{width: '100%'}}/>
                                : <img src='http://dev-oss-public.gymbo-online.com/mgf/img/BDkbBJS3dBHp7P2GgQL8t.png' alt="" style={{width: '100%'}}/>
                            }
                                <Icon type="play-circle" className='gym-r-course-modal-video-icon'/>
                            </div>
                        : <Fragment>
                                <p>选择视频</p>
                                <Select
                                    style={{width: '100%'}}
                                    showSearch
                                    onChange={(e) => this.selectVideo(e, node.type, node.id)}
                                    filterOption={(input:string, option:any) =>
                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {
                                        videoList.map(item =>
                                            <Option key={`video_${item._id}`} value={item._id}>
                                                {item.name}
                                            </Option>)
                                    }
                                </Select>
                        </Fragment>
                    }
                </Fragment>
            case 'theme':
                return <Fragment>
                    <p className='mb5'>主题简介</p>
                    <p><span className='c-error'>*</span>模块标题文案</p>
                    <TextArea
                        placeholder="请输入模块标题文案"
                        onChange={(e) => this.handleChangeContent(e.target.value, node.type, node.id, 'text')}
                        value={node.text}
                    />
                    <p><span className='c-error'>*</span>简介文案</p>
                    <TextArea
                        placeholder="请输入简介文案"
                        onChange={(e) => this.handleChangeContent(e.target.value, node.type, node.id, 'content')}
                        value={node.content}
                    />
                </Fragment>
            case 'courseReceiveDesc':
                return <Fragment>
                    <p><span className='c-error'>*</span>课程收获-描述</p>
                    <TextArea
                        placeholder="请输入描述内容"
                        onChange={(e) => this.handleChangeContent(e.target.value, node.type, node.id, 'text')}
                        value={node.text}
                    />
                </Fragment>
            case 'courseReceive':
                return <CourseHarvest emitChange={(e) => this.handleChangeContent(e, node.type, node.id, 'content')}
                                      values={node.content}/>
            case 'carefullyReview':
                return <Fragment>
                    <p><span className='c-error'>*</span>认真复习</p>
                    <TextArea
                        placeholder="请输入复习内容"
                        onChange={(e) => this.handleChangeContent(e.target.value, node.type, node.id, 'text')}
                        value={node.text}
                    />
                </Fragment>
        }
    }
    render(){
        const {componentList} = this.props
        return <Fragment>
            {
                componentList.map((item, idx) => (
                    <div key={item.id} className='mb10'>
                        {this.view(item)}
                        <div className='gym-r-course-modal-action'>
                            <span  className='gym-r-course-modal-action-span' onClick={() => this.props.emitActionComponent(idx, 'delete')}>删除</span>
                            <span className='gym-r-course-modal-action-span' onClick={() => this.props.emitActionComponent(idx, 'reset')}>重置</span>
                            {idx !== 0 && <span className='gym-r-course-modal-action-span' onClick={() => this.props.emitActionComponent(idx, 'up')}>上移</span>}
                            {idx < (componentList.length - 1) && <span className='gym-r-course-modal-action-span' onClick={() => this.props.emitActionComponent(idx, 'down')}>下移</span>}
                        </div>
                    </div>
                ))
            }
        </Fragment>
    }
}

export {RenderFunction}
