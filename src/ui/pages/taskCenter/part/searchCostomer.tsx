/**
 * desc:跟进预约到访，任务中心查询服务对象
 * User: lyon.li@gymboglobal.com
 * Date: 2018/11/5
 * Time: 下午4:05
 */
import React, {Component} from 'react';
import {Form, Card, Row, Col, Select, Input, Button, Table, message, Modal} from "antd";
import {connect} from "react-redux";
import {ColumnProps} from 'antd/lib/table';
import {switchCustomerModal, choiceCustomListItem} from "@/saga/actions/customer/taskCenter";
import {getGA, getGB} from "../../../../redux-actions/customer/taskCenter";
import {Pagination} from "@/ui/component/pagination";
import {Fetch} from "@/service/fetch";
import {CustomerApi} from "@/api/customerApi";

// 解构出组件的二级组件，方便调用
const {Item} = Form;
const {Option} = Select;

// 定义表格columns的结构和数据源结构
declare interface CustomListColumns extends ColumnProps {
    key: string,
    title: string,
    dataIndex: string,
    [propName: string]: any
}

declare interface CustomListData {
    childrenName: string,   // 宝宝名字
    nickName: string,   // 宝宝昵称
    courseName: string, // 课程名称
    contactName: string,    // 联系人
    gb: string,
    ga: string,
    [propName: string]: any
}

// 定义props和state的数据结构
interface SearchCostomerProps {
    selectedCustomKeys: number[], // 服务对象被选择的行号
    selectedCustomRows: any[],  // 服务对象被选择的数据
    [propName: string]: any
}

interface SearchCostomerState {
    columns: CustomListColumns[],   // 定义表头
    dataSource: CustomListData[],   // 数据源
    pageNo: number,                 // 当前页
    pageSize: number,               // 每页条数
    totalNo: number,                // 总页数
    [propName: string]: any
}

class SearchCostomer extends Component<SearchCostomerProps, SearchCostomerState> {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: '宝宝姓名',
                    dataIndex: 'childrenName',
                    key: 'childrenName',
                    align: 'center'
                },
                {
                    title: '昵称',
                    dataIndex: 'nickName',
                    key: 'nickName',
                    align: 'center'
                },
                {
                    title: '课程包名称',
                    dataIndex: 'courseName',
                    key: 'courseName',
                    align: 'center'
                },
                {
                    title: '联系人',
                    dataIndex: 'contactName',
                    key: 'contactName',
                    align: 'center'
                },
                {
                    title: 'GB',
                    dataIndex: 'gb',
                    key: 'gb',
                    align: 'center'
                },
                {
                    title: 'GA',
                    dataIndex: 'ga',
                    key: 'ga',
                    align: 'center'
                },
            ],
            dataSource: [{
                id: 0,
                childrenName: '王大宝',
                nickName: '宝宝',
                courseName: '96合约',
                contactName: '唐开立',
                gb: 'Jack.Wang 王琴',
                ga: 'Lucy.Zhang 张艺轩'
            }],
            /*分页数据*/
            pageNo: 1,
            pageSize: 10,
            totalNo: 20
        }
    }

    render() {
        // 解构出props和state里需要用到的方法和数据，避免反复取值
        const {form, switchCustomModal, selectedCustomKeys, GAlist, GBlist} = this.props;
        const {getFieldDecorator} = form;
        const {columns, dataSource, pageNo, pageSize, totalNo} = this.state;
        return (
            <Modal
                title="添加服务对象"
                visible={true}
                bodyStyle={{padding: 10}}
                width={760}
                onCancel={() => switchCustomModal(false)}
                onOk={this.handleComfirmCustomer}
            >
                <Card className="gym-wrap-card">
                    <Form className="gym-search-form gym-search-costormer">
                        <Row gutter={24}>
                            <Col span={7}>
                                <Item label="GA:">
                                    {
                                        getFieldDecorator('ga', {})(
                                            <Select>
                                                {
                                                    GAlist.map(item => (
                                                        <Option key={item.id} value={item.id}>{item.name}</Option>))
                                                }
                                            </Select>
                                        )
                                    }
                                </Item>
                            </Col>
                            <Col span={7}>
                                <Item label="GB:">
                                    {
                                        getFieldDecorator('gb', {})(
                                            <Select>
                                                {
                                                    GBlist.map(item => (
                                                        <Option key={item.id} value={item.id}>{item.name}</Option>))
                                                }
                                            </Select>
                                        )
                                    }
                                </Item>
                            </Col>
                            <Col span={7}>
                                <Item label="关键字">
                                    {
                                        getFieldDecorator('keyWord', {})(
                                            <Input/>
                                        )
                                    }
                                </Item>
                            </Col>
                            <Col span={3}>
                                <div className="gym-search-btn-group">
                                    <Button htmlType="button" type="primary" onClick={this.handleSearch}>搜索</Button>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </Card>
                <Card className="gym-wrap-card">
                    <Table
                        className="gym-mini-table"
                        bordered={true}
                        columns={columns}
                        dataSource={dataSource}
                        pagination={false}
                        rowKey={(item:any) => item.id}
                        rowSelection={{
                            type: 'checkbox',
                            selectedRowKeys: selectedCustomKeys,
                            onChange: this.handleCheckChange
                        }}
                    />
                    <Pagination
                        className="mt20"
                        total={totalNo}
                        defaultCurrent={pageNo}
                        pageSize={pageSize}
                        onChange={this.handleChangePage}
                    />
                </Card>
            </Modal>
        )
    }

    handleChangePage = ({pageNo, pageSize}) => {
        // 处理分页;
        if (pageSize === this.state.pageSize) {
            this.setState({
                pageNo
            })
        } else {
            this.setState({
                pageNo, pageSize
            })
        }
        requestAnimationFrame(() => this.handleSearch())
    };

    handleSearch = () => {
        /*点击搜索按钮时执行的操作*/
        const {pageSize, pageNo} = this.state;
        this.props.form.validateFields((err: Error, values: any) => {
            if (err) {
                message.error('获取搜索条件出错，请重试');
                return;
            }
            if (!values.ga && !values.gb && !values.keyWord) {
                // 如果没有搜索条件，提示必须有搜索条件
                message.error('搜索条件不能为空');
                return;
            }
            values.pageNo = pageNo;
            values.pageSize = pageSize;
            Fetch.post({url:CustomerApi.获取服务对象列表, data:values}).then((res)=>{
                this.setState({
                    dataSource: res.list || []
                })
            })
        })
    };

    handleComfirmCustomer = () => {
        /*确定添加服务对象*/
        message.success('选择服务对象成功');
        this.props.switchCustomModal(false);
    };

    handleCheckChange = (selectedCustomKeysArr: string[], selectedCustomRows: Object[]) => {
        // 发送选择服务对象action
        this.props.choiceCustomItem(selectedCustomKeysArr, selectedCustomRows);
    }
}

// 定义mapStateToProps和mapDispatchToProps
const mapStateToProps = state => {
    const {selectedCustomKeys, selectedCustomRows, GAlist, GBlist} = state.taskList;
    return {
        selectedCustomKeys,
        selectedCustomRows,
        GAlist,
        GBlist
    };
};

const mapDispatchToProps = dispatch => ({
    switchCustomModal(showCustomModel: boolean) {
        // 控制弹框是否显示
        dispatch(switchCustomerModal(showCustomModel))
    },
    choiceCustomItem(selectedCustomKeys: number[], selectedCustomRows: object[]) {
        // 选择服务对象
        dispatch(choiceCustomListItem(selectedCustomKeys, selectedCustomRows))
    },
    getGAlist(params) {
        // 获取ga列表
        dispatch(getGA(params));
    },
    getGBlist(params) {
        // 获取gb列表
        dispatch(getGB(params))
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(SearchCostomer));
