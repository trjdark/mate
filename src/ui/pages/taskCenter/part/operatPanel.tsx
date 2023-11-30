import React, {Component, Fragment} from 'react';
import {Button, Card, Col, Row, Select} from "antd";
import {connect} from "react-redux";
import {deleteSelectedTask,setSelectedTask} from "../../../../redux-actions/customer/taskCenter";

// 解构出组件的二级组件，方便调用
const {Option} = Select;

class OperatPanel extends Component<any,any> {
    constructor(props){
        super(props)
    }
    render() {
        const {selectedRowKeys} = this.props;
        return (
            <Fragment>
                {
                    selectedRowKeys.length > 0 ? (
                        <Card className="gym-wrap-card">
                            <Row>
                                <Col span={2}>
                                    <Button htmlType="button" type="danger" onClick={this.handleDelete}>
                                        删除
                                    </Button>
                                </Col>
                                <Col span={4} offset={18}>
                                    <Select style={{width: '100%'}} onChange={this.handleChange} placeholder="标记为">
                                        <Option value="0">已完成</Option>
                                        <Option value="1">待完成</Option>
                                        <Option value="2">忽略</Option>
                                        <Option value="3">全部设为已完成</Option>
                                    </Select>
                                </Col>
                            </Row>
                        </Card>
                    ) : null
                }
            </Fragment>
        )

    }

    handleDelete = ()=>{
        const {selectedRowKeys,deleteSelectedTaskItem} = this.props;
        deleteSelectedTaskItem(selectedRowKeys);
    };

    handleChange = (value)=>{
        const {setSelectedTaskItem} = this.props;
        switch (value) {
            case '0':
                setSelectedTaskItem({a:'已完成'});
                break;
            case '1':
                setSelectedTaskItem({a:'待完成'});
                break;
            case '2':
                setSelectedTaskItem({a:'已忽略'});
                break;
            case '3':
                setSelectedTaskItem({a:'所有已完成'});
                break;
            default:
                break;
        }
    }
}

// 定义mapStateToProps和mapDispatchToProps
const mapStateToProps = state => {
    const {selectedRowKeys} = state.taskList;
    return {
        selectedRowKeys
    }
};

const mapDispatchToProps = dispatch=>({
    deleteSelectedTaskItem(params){
        dispatch(deleteSelectedTask(params));
    },
    setSelectedTaskItem(params){
        dispatch(setSelectedTask(params));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(OperatPanel);
