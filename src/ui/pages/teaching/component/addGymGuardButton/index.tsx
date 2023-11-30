/**
 * desc: 添加gym guard
 * User: colin.lu
 * Date: 2018/12/17
 * Time: 上午10:00
 */

import React from 'react';
import {Modal, message, Button, TimePicker, DatePicker, Form, Row, Col} from "antd";
import {Select, Option} from "@/ui/component/select";
import {form} from "@/common/decorator/form";
import moment from "moment";
import {PageTitle} from "@/ui/component/pageTitle";
import {selectScheduleRoom} from "@/saga/selectors/teaching/scheduleSelector";
import {connect} from "@/common/decorator/connect";
import {ModalFooter} from "../../schedule/part/modalFooter";
import {User} from "@/common/beans/user";
import {getCenterConfig} from "@redux-actions/setting/center";
import {getCenterStaffList, addGymGuard} from "@redux-actions/teaching/applyManage";
import {Message} from "@/ui/component/message/message";
import history from "../../../../../router/history";
import {Routes} from "@/router/enum/routes";
import './index.scss'

const FormItem = Form.Item;

@form()
@connect(
    (state) => ({
        roomList: selectScheduleRoom(state)
    }),
    {getCenterConfig}
)

class AddGymGuard extends React.Component <any, any> {
    input: any;
    state = {
        staffList: [], // 员工列表
        data: null,
        contractModalVisible: this.props.fromGymGuard && this.props.fromGymGuard !== null ? this.props.fromGymGuard : false
    };

    componentDidMount() {
        // 获取在职员工信息
        this.getCenterStaffList();
    }

    getCenterStaffList = () => {
        const postData = {
            "centerId": User.currentCenterId, // ID
            "currentCenterId": User.currentCenterId // 当前登录中心id NEWMATE-7452 要求修改此字段从centercode 改为centerid
        };
        /**
         * 收付款列表
         * @param someParam<>
         * @method post
         * @response  res<>
         */
        getCenterStaffList(postData).then(
            (res) => {
                if(Array.isArray(res) && res.length > 0){
                    const staffList = res.filter(item=>item.isHqStaff !==1);
                    this.setState({
                        staffList
                    })
                }
            },
            (err) => {
                // 返回请求reject
                message.error(err)
            }
        )
    };

    /**
     * 开启弹窗
     */
    openAddGym = () => {
        this.setState({contractModalVisible: true})
    };

    /**
     * 关闭弹窗
     */
    closeModal = () => {
        this.setState({contractModalVisible: false})
    };

    /**
     * 选择教室
     */
    changeRoom = (value) => {
        const {roomList} = this.props;
        const currentRoom = roomList.filter((item) => (item.id === value))[0];
        this.setState({maxCapacity: currentRoom.maxCapacity});

    };

    /**
     * 新建gym guard
     */
    onSubmit = () => {
        const {form} = this.props;

        form.validateFields((err: any, values) => {
            if (!err) {
                if (form.getFieldsValue().firstCheckStaff === form.getFieldsValue().secondCheckStaff) {// 检查人员相同
                    Message.error('检查人员1和检查人员2不能相同');
                    return;
                }

                if (moment(form.getFieldsValue().endTime).valueOf() <= moment(form.getFieldsValue().startTime).valueOf()) {
                    Message.error('请输入合法的时间');
                    return;
                }

                // 新增gym guard
                let postData = {
                    "classroomId": form.getFieldsValue().classroomId,
                    "currentCenterId": User.currentCenterId,
                    "date": moment(form.getFieldsValue().startDate).valueOf(),
                    "endTime": moment(form.getFieldsValue().endTime).format('HH:mm'),
                    "firstCheckStaff": form.getFieldsValue().firstCheckStaff,
                    "id": User.userId,
                    "secondCheckStaff": form.getFieldsValue().secondCheckStaff,
                    "startTime": moment(form.getFieldsValue().startTime).format('HH:mm')
                };

                // Todo success
                addGymGuard(postData).then(
                    (res: any) => {
                        message.success('保存成功');
                        this.setState({
                            contractModalVisible: false
                        });
                        history.push(Routes.gymguard.path);
                    },
                    (err: any) => {
                        message.error(err.msg);
                    })
            }
        })
    };

    render() {
        const {form, roomList} = this.props;
        const {getFieldDecorator} = form;
        const {contractModalVisible, staffList} = this.state;

        return (
            <div className='gym-customer-create-list-modal'>
                <Modal
                    className='gym-teaching-add-gymguard-button-modal gym-guard-modal'
                    visible={contractModalVisible}
                    footer={false}
                    onCancel={this.closeModal}
                    centered={true}
                    destroyOnClose={true}
                    width={700}
                >
                    <div className="plr20 gym-teaching-schedule-add">
                        <PageTitle title={`新建检查`} className='gym-teaching-schedule-add-page-title'/>
                        <div>
                            <Form onSubmit={this.onSubmit}>
                                <Row>
                                    <Col span={12}>
                                        <FormItem label={`课程时间:`} className='flex'>
                                            {
                                                getFieldDecorator(`startDate`, {
                                                    rules: [{required: true, message: '请选择课程时间'}],
                                                    initialValue: null
                                                })(<DatePicker style={{width: '200px'}}/>)
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label={`教室:`} className='flex'>
                                            {
                                                getFieldDecorator(`classroomId`, {
                                                    rules: [{required: true, message: '请选择一个教室'}]
                                                })(
                                                    <Select
                                                        placeholder={'请选择'}
                                                        onChange={this.changeRoom}
                                                        style={{width: '200px'}}
                                                        getPopupContainer={() => document.querySelector('.gym-teaching-schedule-add')}
                                                    >
                                                        {
                                                            roomList.map((item) => {
                                                                return (
                                                                    <Option
                                                                        value={item.id}
                                                                        key={item.id}
                                                                    >
                                                                        {item.classroomName}
                                                                    </Option>
                                                                )
                                                            })
                                                        }
                                                    </Select>
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12}>
                                        <FormItem label={`开始时间:`} className='flex'>
                                            {
                                                getFieldDecorator(`startTime`, {
                                                    rules: [{required: true, message: '请选择开始时间'}]
                                                })(
                                                    <TimePicker
                                                        style={{width: '200px'}}
                                                        minuteStep={15}
                                                        format={`HH:mm`}
                                                        defaultOpenValue={moment('07:00', 'HH:mm')}
                                                    />
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label={`结束时间:`} className='flex'>
                                            {
                                                getFieldDecorator(`endTime`, {
                                                    rules: [{required: true, message: '请选择结束时间'}]
                                                })(
                                                    <TimePicker
                                                        style={{width: '200px'}}
                                                        minuteStep={15}
                                                        format={`HH:mm`}
                                                        defaultOpenValue={moment('07:00', 'HH:mm')}
                                                    />
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12}>
                                        <FormItem label={`检查人1:`} className='flex'>
                                            {
                                                getFieldDecorator(`firstCheckStaff`, {
                                                    rules: [{required: true, message: '请选择检查人1'}]
                                                })(
                                                    <Select
                                                        placeholder={'请选择'}
                                                        style={{width: '200px'}}
                                                        getPopupContainer={() => document.querySelector('.gym-teaching-schedule-add')}
                                                    >
                                                        {
                                                            staffList.map((item) => {
                                                                return (
                                                                    <Option value={item.id} key={item.id}>
                                                                        {item.englishName}{item.chineseName}
                                                                    </Option>
                                                                )
                                                            })
                                                        }
                                                    </Select>
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label={`检查人2:`} className='flex'>
                                            {
                                                getFieldDecorator(`secondCheckStaff`, {
                                                    rules: []
                                                })(
                                                    <Select
                                                        allowClear={true}
                                                        placeholder={'请选择'}
                                                        style={{width: '200px'}}
                                                        getPopupContainer={() => document.querySelector('.gym-teaching-schedule-add')}
                                                    >
                                                        {
                                                            staffList.map((item) => {
                                                                return (
                                                                    <Option value={item.id} key={item.id}>
                                                                        {item.englishName}{item.chineseName}
                                                                    </Option>
                                                                )
                                                            })
                                                        }
                                                    </Select>
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                        <ModalFooter
                            withDelete={false}
                            onOk={this.onSubmit}
                            onCancel={this.closeModal}
                        />
                    </div>
                </Modal>
                <Button
                    style={{position: 'absolute', float: 'right'}}
                    className='gym-button-wBlue-lg mr10'
                    onClick={this.openAddGym}
                >
                    Gym Guard
                </Button>
            </div>
        )
    }
}

export {AddGymGuard}
