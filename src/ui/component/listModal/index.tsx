import React from 'react';
import './index.scss';
import {Modal as AntModal} from 'antd';

class ListModal extends React.Component <any>{
    constructor(props) {
        super(props);
    }

    render() {
        const {
            visible,
            handleOk,
            handleCancel,
            children,
            okText,
            cancelText,
            destroyOnClose,
            closable=false,
            maskClosable=false,
            width=1030,
            ...rest
        } = this.props;

        return(
            <AntModal
              visible={visible}
              onOk={handleOk}
              onCancel={handleCancel}
              wrapClassName='gym-customer-create-list-modal'
              centered
              width={width}
              closable={closable}
              okText={okText}
              cancelText={cancelText}
              maskClosable={maskClosable}
              destroyOnClose={destroyOnClose}
              cancelButtonProps={{className:'gym-button-white-xs'}}
              okButtonProps={{className:'gym-button-default-xs'}}
              {...rest}
            >
                {children}
            </AntModal>
        )
    }
}

export {ListModal};
