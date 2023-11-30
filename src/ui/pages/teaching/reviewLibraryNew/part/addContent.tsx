/**
 * desc: 添加教具活动
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2020/11/17
 * Time: 下午3:02
 */

import React, {Fragment} from 'react';
import {Modal} from 'antd';
import {Input} from "@/ui/component/input";

class AddContent extends React.Component<any, any> {
    state = {
        visible: false,
        pieceContent: null
    };
    /**
     * 取消
     */
    handleShow = () => {
        this.setState({visible: true});
    };
    /**
     * 保存
     */
    handleSave = () => {
        this.props.emitInsertContent(this.state.pieceContent);
        this.setState({visible: false, pieceContent:null});
    };
    /**
     * 改变Input
     * @param {string} e
     */
    handleChange = (e:any) => {
        this.setState({pieceContent: e.target.value})
    };
    render() {
        const {visible, pieceContent} = this.state;
        return (
            <Fragment>
                <button
                    className="gym-button-xs gym-button-default ml45"
                    onClick={this.handleShow}
                >添加教具</button>
                <Modal
                    visible={visible}
                    onCancel={() => {this.setState({visible:false})}}
                    onOk={this.handleSave}
                >
                    <div className="mb25">
                        <span>新教具/活动：</span>
                        <Input
                            value={pieceContent}
                            onChange={this.handleChange}
                        />
                    </div>
                </Modal>
            </Fragment>
        )
    }
}

export {AddContent};
