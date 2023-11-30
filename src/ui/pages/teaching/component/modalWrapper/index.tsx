/**
 * Desc:
 * User: dave.zhang
 */
import React, {Component} from 'react'
import {Modal as AntModal} from 'antd';
import './index.scss'

declare interface ModalProps {
    handleOk: (res: any) => void,
    handleCancel?: () => void,
    visible: boolean,
    [propName: string]: any,
}

function modalWrapper(Content) {
    return class Modal extends Component<ModalProps, any> {
        constructor(props) {
            super(props);
        }

        render() {
            // 组件 props
            const {
                handleOk,
                handleCancel,
                visible,
                width,
                data,
                cancelButtonProps,
                okButtonProps,
                icon,
                message,
            } = this.props;

            return (
                <AntModal
                    visible={visible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    wrapClassName={`teaching-model-wrapper`}
                    width={width ? width : 352}
                    centered={true}
                    closable={false}
                    maskClosable={false}
                    cancelButtonProps={cancelButtonProps}
                    okButtonProps={okButtonProps}
                >
                    <div className="iconWrapper">
                        <div className="topIcon">{icon ? icon : "?"}</div>
                    </div>
                    <Content data={data} message={message}/>
                </AntModal>
            )
        }
    }
}

export {modalWrapper}
