import React, {Component, Fragment} from 'react';
import {Modal} from 'antd';
import {InputNumber} from "@/ui/component/input";

class FillNumberButton extends Component<any, any>{
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
    handleSubmit = () => {
        const {value} = this.state;
        this.props.emitChangeSort(value, this.props.id);
        this.closeModal();
    }
    render(){
        const {visible, value} = this.state;
        return (
            <Fragment>
                <button className='mr10 gym-button-xxs gym-button-white' onClick={this.showModal}>填写序号</button>
                <Modal
                    visible={visible}
                    title='修改资源排序'
                    onCancel={this.closeModal}
                    onOk={this.handleSubmit}
                    destroyOnClose={true}
                >
                    <InputNumber value={value} onChange={this.handleChange}/>
                </Modal>
            </Fragment>
        )
    }
}

export {FillNumberButton}
