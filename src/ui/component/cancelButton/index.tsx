/**
 * desc: 取消按钮
 * Date: 2018/8/30
 * Time: 下午1:26
 */
import React from 'react';
import {Button} from "antd";
import Immutable, {Map} from "immutable";
import {CommonUtils} from "@/common/utils/commonUtils";
import history from "../../../router/history";
import {Modal} from "@/ui/component/customerCreateModal";


declare interface CancelButtonProps {
    form: any,              // from对象
    goBackLink?: string,    // 跳转链接
    treeData?: any,         // 除表单以外，要参与比较的数据
    submitText?: string,    // 提交按钮的文字
    handleSubmit?: any,     // 提交表单的方法
    isSaveValid?:boolean,
}

class CancelButton extends React.Component<CancelButtonProps, any> {
    static getDerivedStateFromProps(props, state) {
        // 如果用户并没有操作过表单，把当前表单的值初始化成oldValues，用于与新值的比较
        const isChanged = props.form.isFieldsTouched();
        if (!isChanged) {
            return {
                oldValues: props.form.getFieldsValue()
            }
        }
        return null
    }

    constructor(props: any) {
        super(props);
        this.state = {
            oldValues: {},      // 表单的旧值
            visible: false,     // 控制提示弹框
            treeData: this.props.treeData
        }
    }

    save = () => {
        const {handleSubmit} = this.props;

        // 如果提交后并不跳转，那么还有可能继续更改数据，要把现有数据先保存起来，方便再次提交时对比
        this.setState({
            oldValues: this.props.form.getFieldsValue(),
            treeData: this.props.form.getFieldsValue().functions
        });

        // 如果有提交的方法，执行提交表单
        if (typeof handleSubmit === "function") {
            handleSubmit();
        }
    };

    cancel = () => {
        const {goBackLink,treeData} = this.props;
        const newTreeData=this.props.form.getFieldsValue().functions;
        const oldValues = Map(CommonUtils.TraversalObject(this.state.oldValues));
        const newValues = Map(CommonUtils.TraversalObject(this.props.form.getFieldsValue()));
        // 只修改过表单区域
        if (Immutable.is(oldValues, newValues)) {
            //修改过角色 treeData
            if(typeof treeData!=='undefined' && (!Immutable.is(treeData,newTreeData))){
                this.setState({visible: true});
                return;
            }
            // 如果没有修改过表单值 并且 也没有修改过treeData
            goBackLink ? history.push(this.props.goBackLink) : history.goBack()
        } else {
            // 修改过
            this.setState({visible: true})
        }
    };

    onCancel = () => {
        this.setState({visible: false})
    };

    onSure = () => {
        const {goBackLink} = this.props;
        this.setState({visible: false});
        goBackLink ? history.push(this.props.goBackLink) : history.goBack()
    };

    render() {
        const {visible} = this.state;
        const {isSaveValid=true}=this.props;
        return (
            <div className='text-c mt30 mb15'>
                <Modal
                    visible={visible}
                    handleOk={this.onSure}
                    handleCancel={this.onCancel}
                    contentText={`当前页面存在未保存的信息，是否确定放弃保存?`}
                    okText={`确定`}
                    cancelText={`返回`}
                />
                {isSaveValid ?
                    <Button
                        type="primary"
                        htmlType="submit"
                        className='gym-button-default gym-button-xs'
                        onClick={this.save}
                    >
                        {this.props.submitText ? this.props.submitText : '保存'}
                    </Button>
                    :
                    <Button className='gym-button-greyb gym-button-xs'>
                        {this.props.submitText ? this.props.submitText : '保存'}
                    </Button>
                }
                <Button
                    onClick={this.cancel}
                    htmlType="button"
                    className='gym-button-white gym-button-xs ml30'
                >
                    返回
                </Button>
            </div>
        )
    }
}

export {CancelButton}
