import React, {Component, Fragment} from 'react';
import {Form, Modal} from 'antd';
import {Input, TextArea} from "@/ui/component/input";
import {form} from "@/common/decorator/form";

const {Item} = Form;

@form()
class ThemeAddButton extends Component<any, any>{
    constructor(props) {
        super(props);
        this.state = {
            visible:false,
            value: props.sort
        }
    }
    showModal = () => {
        this.setState({visible:true})
    }
    closeModal = () => {
        this.setState({visible:false})
    }
    handleChange = (e) => {
        this.setState({value: e})
    }
    /**
     * 添加主题
     */
    handleAdd = () => {
        const {validateFields} = this.props.form;
        validateFields((err, values) => {
            if(!err){
                this.props.emitAddTheme(values);
                this.closeModal();
            }
        })
    }
    render(){
        const {visible} = this.state;
        const {form,} = this.props;
        const {getFieldDecorator} = form;
        return (
            <div className='mb15'>
                <button className='gym-button-default gym-button-lg' onClick={this.showModal}>+新建主题</button>
                <Modal
                    visible={visible}
                    title='设置主题'
                    onOk={this.handleAdd}
                    onCancel={this.closeModal}
                    destroyOnClose={true}
                >
                    <Form >
                        <Item label='课程主题'>
                            {
                                getFieldDecorator('themeName',{
                                    rules: [{required: true, message: '请输入课程主题'}],
                                })(
                                    <Input
                                        className=''
                                        placeholder='请输入课程主题'
                                    />
                                )
                            }
                        </Item>
                        <Item label='主题介绍'>
                            {
                                getFieldDecorator('themeDesc',{
                                    rules: [{required: true, message: '请输入主题介绍'}],
                                })(
                                    <TextArea
                                        placeholder='请输入主题介绍'
                                    />
                                )
                            }
                        </Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}

export {ThemeAddButton}
