/**
 * Desc: 批量选择宝宝请假弹框
 * User: Debby.Deng
 * Date: 2018/12/26,
 * Time: 下午4:00
 */
import "./index.scss";
import * as React from "react";
import {PageTitle} from "@/ui/component/pageTitle";
import {Select} from "antd";
import {bookWayName, leaveType} from "../../enum/schedule";
import {form} from "@/common/decorator/form";
import {ListModal} from "@/ui/component/listModal";
import {Table} from "@/ui/component/tablePagination";
import {Message} from "@/ui/component/message/message";

const Option = Select.Option;

interface PropSet {
    dataSource: Array<any>
    showModal: boolean,
    onOk: (value) => (void),
    onCancel: () => (void),

    [propsName: string]: any,
}

@form()
class MultLeaveConfirm extends React.Component<PropSet> {

    columns = [
        {
            title: '宝宝姓名',
            dataIndex: 'babyName',
            key: 'babyName',
            align: 'center',
        },
        {
            title: '当前合同剩余请假次数',
            dataIndex: 'remainingLeaveTimes',
            key: 'remainingLeaveTimes',
            align: 'center',
        },
        {
            title: '累计请假数',
            dataIndex: 'leaveTimes',
            key: 'leaveTimes',
            align: 'center',
        },
        {
            title: '请假类型',
            dataIndex: 'leaveType',
            key: 'leaveType',
            align: 'center',
            render: (text, record) => (
                <div>{
                    this.props.form.getFieldDecorator(record.attendanceId, {
                        initialValue: '29001'
                    })(
                        <Select>
                            {leaveType.map((item) => (
                                <Option
                                    key={item.value}
                                    value={item.value}
                                >
                                    {item.name}
                                </Option>))
                            }
                        </Select>
                    )}
                </div>
            )
        }
    ];
    /**
     * 弹框点击确定
     * @returns {any}
     */
    handleOk = () => {
        const {form, dataSource} = this.props;
        const value = form.getFieldsValue();
        const cantLeave = dataSource.some((data) => (
            data.bookWay !== bookWayName.P.value && data.remainingLeaveTimes === 0));
        if (cantLeave) {// 非试听剩余请假次数为0
            Message.error('剩余请假次数不足，提交失败！');
            return;
        }
        this.props.onOk(value);
    };
    /**
     * 弹框点击取消
     * @returns {any}
     */
    handleCancel = () => {
        this.props.onCancel();
    };

    componentDidMount() {

    }

    render() {
        const {showModal, dataSource} = this.props;
        return (
            <ListModal
                visible={showModal}
                closable={true}
                maskClosable={true}
                handleOk={this.handleOk}
                handleCancel={this.handleCancel}
                okText={`提交`}
                cancelText={`取消`}
                destroyOnClose={true}
            >
                <PageTitle title={`请假确认`}/>
                <Table
                    className='gym-mult-leave-confirm'
                    columns={this.columns}
                    dataSource={dataSource}
                    rowKey={`attendanceId`}
                />
            </ListModal>
        )
    }
}

export {MultLeaveConfirm}
