/**
 * desc: 删除固定排课，有选课情况的弹层
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2019/7/23
 * Time: 下午3:14
 */
import React from 'react';
import {Modal} from 'antd';
import './index.scss';

class ScheduleModal extends React.Component <any, any>{
    render(){
        const {visible, handleOk, handleCancel, title, content, desc} = this.props;
        return(
            <Modal
                visible={visible}
                wrapClassName={`gym-customer-create-specified-modal`}
                onOk={handleOk}
                onCancel={handleCancel}
                closable={false}
                maskClosable={false}
            >
                <div className='schedule-wrap'>
                    <div className="schedule-topIcon">?</div>
                    <div className='schedule-title'>{title}</div>
                    <div className='schedule-content'>{content}</div>
                    <div className='schedule-desc'>{desc}</div>
                </div>

            </Modal>
        )
    }
}

export {ScheduleModal}
