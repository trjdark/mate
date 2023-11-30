/**
 * desc: 确认按钮组
 * User: Lyon.li@gymboglobal.com
 * Date: 2018/11/22
 * Time: 下午1:38
 */
import React, {Component, Fragment} from 'react';
import {Modal, Button} from "antd";
import {CommonUtils} from "@/common/utils/commonUtils";

class ConfirmBtnGroup extends Component<any, any> {
    static getDerivedStateFromProps(props, state) {
        const isChanged = props.form.isFieldsTouched();
        if (!isChanged) {
            return {
                oldValues: props.form.getFieldsValue(),
            }
        }
        return null
    }

    constructor(props) {
        super(props);
        this.state = {
            oldValues: {},
            oldTreeData: '',
        }
    }

    render() {
        // 解构出state和props中的值，方便调用
        const {okText, cancelText, noCancel} = this.props;
        return (
            <Fragment>
                <div className="gym-btn-group mt30">
                    <Button
                        type="primary"
                        className="gym-button-xs gym-button-default"
                        onClick={this.handleConfirm}
                    >
                        {okText ? okText : '确认'}
                    </Button>
                    {
                        // 如果props中含有noCancel，不渲染取消按钮
                        noCancel ? null : (
                            <Button
                                className="gym-button-xs gym-button-white"
                                onClick={this.handleOpen}
                            >
                                {cancelText ? cancelText : '取消'}
                            </Button>
                        )
                    }
                </div>
            </Fragment>
        )
    }

    componentDidMount() {
        // 保存下初始化的treeData
        this.setState({
            oldTreeData: JSON.stringify(this.props.treeData)
        })
    }

    handleConfirm = () => {
        // 按确认按钮时执行
        const {handleConfirmClick, form, treeData} = this.props;
        this.setState({
            oldValues: form.getFieldsValue(),
            oldTreeData: JSON.stringify(treeData)
        });
        handleConfirmClick();
    };

    /*打开确认框*/
    handleOpen = () => {
        const oldValuesJson = JSON.stringify(CommonUtils.TraversalObject(this.state.oldValues));
        const newValuesJson = JSON.stringify(CommonUtils.TraversalObject(this.props.form.getFieldsValue()));
        const oldTreeData = this.state.oldTreeData;
        const newTreeData = JSON.stringify(this.props.treeData);
        if (oldValuesJson === newValuesJson && oldTreeData === newTreeData) {
            this.handleOk();
            return;
        }
        const {tipText, tipOkText, tipCancelText} = this.props;
        Modal.confirm({
            content: tipText,
            okText: tipOkText,
            cancelText: tipCancelText,
            onOk: this.handleOk
        })
    };

    handleOk = () => {
        // 点击弹框确认按钮时执行
        const {handleCancelClick} = this.props;
        handleCancelClick();
    };
}

export default ConfirmBtnGroup;
