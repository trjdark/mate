import React, {Component, Fragment} from 'react';
import {Form, Modal} from 'antd';
import {Input, TextArea} from "@/ui/component/input";
import {form} from "@/common/decorator/form";

const {Item} = Form;

@form()
class ThemeUpdateButton extends Component<any, any>{
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
    updateTheme = () => {
        const {validateFields} = this.props.form;
        validateFields((err, values) => {
            if(!err){
                this.props.emitUpdateTheme(values, this.props.id);
                this.closeModal();
            }
        })
    }
    render(){
        const {visible} = this.state;
        const {form, themeName, themeDesc} = this.props;
        const {getFieldDecorator} = form;
        return (
            <Fragment>
                <span className='ml15 cDefault pointer' onClick={this.showModal}>编辑</>
                <Modal
                    visible={visible}
                    title='设置主题'
                    onOk={this.updateTheme}
                    onCancel={this.closeModal}
                    destroyOnClose={true}
                >
                    <Form >
                        <Item label='课程主题'>
                            {
                                getFieldDecorator('themeName',{
                                    rules: [{required: true, message: '请输入课程主题'}],
                                    initialValue: themeName,
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
                                    initialValue: themeDesc,
                                })(
                                    <TextArea
                                        placeholder='请输入主题介绍'
                                    />
                                )
                            }
                        </Item>
                    </Form>
                </Modal>
            </Fragment>
        )
    }
}

export {ThemeUpdateButton}
