/**
 * desc:
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2020/7/23
 * Time: 下午3:33
 */
import React from 'react';
import {Modal} from 'antd';
import {Select} from "@/ui/component/select";

class AddLessonButton extends React.Component<any, any> {
    state = {
        visible: false
    }
    handleShow = () => {
        this.setState({visible: true});
    }
    handleSave = () => {
        this.setState({visible: false});
    }
    render() {
        const {visible} = this.state;
        return (
            <div className="gym-review-list-create ml30">
                <button
                    className="gym-button-xs gym-button-default mb20"
                    onClick={this.handleShow}
                >+ 新建</button>
                <Modal
                    visible={visible}
                    onCancel={() => {this.setState({visible:false})}}
                    onOk={this.handleSave}
                >
                    <div className="mb25">
                        <span>课程类型：</span>
                        <Select/>
                    </div>
                    <div>
                        <span>教具代数：</span>
                        <Select/>
                    </div>
                </Modal>
            </div>
        )
    }
}

export {AddLessonButton};
