import React, {Component, Fragment} from 'react';
import {connect} from "@/common/decorator/connect";
import {selectRCourseAudio, selectRCourseImage, selectRCourseVideo} from "@/saga/selectors/teaching/rCourseSelector";
import {Form, Modal} from "antd";
import {Input, TextArea} from "@/ui/component/input";
import {form} from "@/common/decorator/form";
import {Select, Option} from "@/ui/component/select";

const {Item} = Form;
@form()
@connect((state) => ({
    musicList: selectRCourseAudio(state),
    imgList: selectRCourseImage(state)
}), {})
class MusicUpdateButton extends Component<any, any>{
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        }
    }
    showModal = () => {
        this.setState({visible:true})
    }
    closeModal = () => {
        this.setState({visible:false})
    }
    handleMusic = () => {
        const {record, form} = this.props;
        const {validateFields} = form;
        validateFields((err, values) => {
            if(!err){
                this.props.emitUpdateMusic(values, record.id);
                this.closeModal();
            }
        })
    }
    render() {
        const{musicList, imgList, form, record} = this.props;
        const {visible} = this.state;
        const {getFieldDecorator} = form;

        return <Fragment>
            <span className="cDefault pointer"  onClick={this.showModal}>编辑</span>
            <Modal
                visible={visible}
                title='上传音乐'
                onOk={this.handleMusic}
                onCancel={this.closeModal}
                destroyOnClose={true}
                maskClosable={false}
            >
                <Form >
                    <Item label='专辑封面图'>
                        {
                            getFieldDecorator('musicAlbumCover',{
                                rules: [{required: true, message: '请选择专辑封面'}],
                                initialValue: record.musicAlbumCover,
                            })(
                                <Select
                                    style={{width: '100%'}}
                                    placeholder='请选择专辑封面'
                                    showSearch
                                    filterOption={(input:string, option:any) =>
                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {
                                        imgList.map(item =>
                                            <Option key={`video_${item._id}`} value={item._id}>
                                                {item.name}
                                            </Option>)
                                    }
                                </Select>
                            )
                        }
                    </Item>
                    <Item label='音乐列表'>
                        {
                            getFieldDecorator('musicList',{
                                rules: [{required: true, message: '请选择音乐'}],
                                initialValue: record.musicList  ? (record.musicList ).split(',') : [] ,
                            })(
                                <Select
                                    mode="multiple"
                                    placeholder='请选择音乐'
                                    style={{width: '100%'}}
                                    showSearch
                                    filterOption={(input:string, option:any) =>
                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {
                                        musicList.map(item =>
                                            <Option key={`video_${item._id}`} value={item._id}>
                                                {item.name}
                                            </Option>)
                                    }
                                </Select>
                            )
                        }
                    </Item>
                </Form>
            </Modal>
        </Fragment>;
    }
}

export {MusicUpdateButton}
