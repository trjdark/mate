/**
 * desc:
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2020/2/12
 * Time: 下午4:40
 */
import React, {Fragment} from "react";
import {Modal} from "antd";
import {PageTitle} from "@/ui/component/pageTitle";
import {TextArea} from "@/ui/component/input";

declare interface EditCallRecordRemarkProps {
    record:any
    emitSubmit:(res:any) => void
}

class EditCallRecordRemark extends React.Component<EditCallRecordRemarkProps, any>{
    state = {
        visible: false,
        value: this.props.record.taskDesc
    }
    /**
     * 更新通话记录备注
     */
    updateCallRecordRemark = () => {
        const {cid, taskMainId} = this.props.record;
        const param = {
            currentCenterId: cid,
            taskDesc: this.state.value,
            taskMainId: taskMainId
        }
        this.props.emitSubmit(param);
        this.closeModal();

    };
    /**
     * 修改
     * @param {string} value
     */
    handleChange = (value:string) => {
        this.setState({value: value})
    }
    /**
     * 关闭
     */
    closeModal = () => {
        this.setState({visible:false})
    };
    render(){
        const {visible, value} = this.state;
        return(
            <Fragment>
                <button className="gym-button-xxs gym-button-white" onClick={() => this.setState({visible: true})}>编辑</button>
                <Modal
                    visible={visible}
                    onCancel={() => this.setState({visible: false})}
                    footer={false}

                >
                    <PageTitle title={"修改记录内容"}/>
                    <div className='mb25'>
                        <TextArea value={value || ''} onChange={(e) => this.handleChange(e.target.value)}/>
                    </div>
                    <div className="text-c">
                        <button className="gym-button-xs gym-button-default mr10" onClick={this.updateCallRecordRemark}>确定</button>
                        <button className="gym-button-xs gym-button-white" onClick={this.closeModal}>取消</button>
                    </div>
                </Modal>
            </Fragment>
        )
    }
}

export {EditCallRecordRemark}
