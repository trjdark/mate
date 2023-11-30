/**
 * desc: 添加修改教室
 * User: Colin.lu
 * Date: 2018/8/11
 * Time: 下午5:27
 */
import React from 'react';
import {Form, Row, Col, Alert} from "antd";
import {Input, InputNumber} from "@/ui/component/input";
import {Select,Option} from "@/ui/component/select";
import {form} from "@/common/decorator/form";
import {RoomStatus, RoomType} from "../../enum/classroom";
import {CommonUtils} from "@/common/utils/commonUtils";
import {getRoomInfo,createRoom,editRoom} from "@redux-actions/setting/roomActions";
import {User} from "@/common/beans/user";
import {CancelButton} from "@/ui/component/cancelButton";
import {Routes} from "@/router/enum/routes";
import {Message} from "@/ui/component/message/message";

const FormItem = Form.Item;
const lessonMaterialType = [
    {
        key: '93001',
        value: '93001',
        name: '四代教具'
    },
    {
        key: '93002',
        value: '93002',
        name: '五代教具'
    }
];

@form()
class RoomAddOrEdit extends React.Component<any, any>{
    pid:string;
    constructor(props:any){
        super(props);
        this.pid = CommonUtils.hasParams(props) ? CommonUtils.parse(props).id : null;
        this.state = {
            isChanged:false,
            isShowAlert: false,
            classroomInfo: {},                  // 教室信息
        };
    }
    componentDidMount(){
        if(this.pid){
            getRoomInfo({
                id: this.pid,
                currentCenterId: User.currentCenterId
            }).then((res:any) => {
                this.setState({classroomInfo:res})
            });
        }

    }
    handleFormChange(){
        this.setState({isChanged:true})
    }
    onSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err,values)=>{
            if(!err){
                // 判断是否是5/6带教具
                const params = Object.assign({}, values, {
                    id:this.pid,
                    currentCenterId:User.currentCenterId,
                });
                if(this.pid){ // 编辑
                    this.updateRoom(params);
                }else{ // 新建
                    this.addRoom(params);
                }
            }
        })
    };
    /**
     * 更新教室信息
     * @param param
     */
    updateRoom = (param:any) => {
        editRoom(param).then(() => {
            Message.success('更新成功');
        })
    };
    /**
     * 更新教室信息
     * @param param
     */
    addRoom = (param:any) => {
        createRoom(param).then(() => {
            Message.success('添加成功');
        })
    };
    /**
     * 修改教具代数
     */
    handleChangeMaterial = () => {
        this.setState({isShowAlert: true})
    }
    render(){
        const {form}=this.props;
        const {classroomInfo} = this.state;
        const { getFieldDecorator } = this.props.form;
        const {isShowAlert} = this.state;
        const formItemLayout = {
            labelCol: {
                sm: { span: 4 },
            }
        };
        return(
            <div id='gym-classroom-add-edit' className='gym-classroom-create'>
                <Form onSubmit={this.onSubmit}  onChange={this.handleFormChange.bind(this)}>
                    <FormItem label={'教室编号'} {...formItemLayout}>
                        {
                            getFieldDecorator('classroomCode', {
                                rules: [
                                    {required: true, message: '请输入教室编号',}
                                ],
                                initialValue:classroomInfo.classroomCode

                            })(
                                <Input placeholder={`教室编号`} maxLength={50}/>
                            )
                        }
                    </FormItem>
                    <FormItem label={'教室名称'} {...formItemLayout}>
                        {
                            getFieldDecorator('classroomName', {
                                rules: [
                                    {required: true, message: '请输入教室名称',}
                                ],
                                initialValue:classroomInfo.classroomName

                            })(
                                <Input placeholder={`教室名称`} maxLength={50}/>
                            )
                        }
                    </FormItem>
                    <FormItem label={'教室类型'} {...formItemLayout}>
                        {
                            getFieldDecorator('classroomType', {
                                rules: [
                                    {required: true, message: '请输入教室类型',}
                                ],
                                initialValue:classroomInfo.classroomType
                            })(
                                <Select style={{width:200}} placeholder={`请选择教室类型`} onChange={this.handleFormChange.bind(this)}>
                                    {
                                        (RoomType || []).map((item:any) =>
                                            <Option key={item} value={item}>
                                                {item}
                                            </Option>
                                        )
                                    }
                                </Select>
                            )
                        }
                    </FormItem>
                    {
                        form.getFieldsValue().classroomType === 'Play' &&
                        <FormItem label={'教具代数'} {...formItemLayout}>
                            {
                                getFieldDecorator('teachPropCode', {
                                    rules: [
                                        {required: true, message: '请选择教具代数',}
                                    ],
                                    initialValue:classroomInfo.teachPropCode
                                })(
                                    <Select style={{width:200}} placeholder={`请选择教具代数`}
                                        onChange={this.handleChangeMaterial}
                                    >
                                        {
                                            (lessonMaterialType || []).map((item:any) =>
                                                <Option key={item.key} value={item.value}>
                                                    {item.name}
                                                </Option>
                                            )
                                        }
                                    </Select>
                                )
                            }
                        </FormItem>
                    }
                    {
                        isShowAlert &&
                            <Row>
                                <Col span={4}/>
                                <Col span={8}>
                                    <Alert message="修改‘教具代数’可能影响RRP配置管理，请及时前往配置" type="warning" />
                                </Col>
                            </Row>
                    }
                    <FormItem label={'标准容量'} {...formItemLayout}>
                        {
                            getFieldDecorator('capacity', {
                                rules: [
                                    {required: true, message: '请输入标准容量'},
                                ],
                                initialValue:(classroomInfo.capacity === 0 ? '0' : classroomInfo.capacity) || 10
                            })(
                                <InputNumber min={1} precision={0}  onChange={this.handleFormChange.bind(this)} style={{width: 120}} max={100}/>
                            )
                        }
                        <span className='gym-room-size-unit'> 单位： 人</span>
                    </FormItem>

                    <FormItem label={'最大容量'} {...formItemLayout}>
                        {
                            getFieldDecorator('maxCapacity', {
                                rules: [
                                    {required: true, message: '请输入最大容量'},
                                ],
                                initialValue:(classroomInfo.maxCapacity === 0 ? '0' : classroomInfo.maxCapacity) ||15
                            })(
                                <InputNumber precision={0} onChange={this.handleFormChange.bind(this)}  style={{width: 120}} min={1} max={100}/>
                            )
                        }
                        <span className='gym-room-size-unit '> 单位： 人</span>
                    </FormItem>

                    <FormItem label={'所属中心'} {...formItemLayout}>
                        {
                            getFieldDecorator('roomBelongs', {
                                rules: [
                                    {required: true, message: '请选择所属中心',}
                                ],
                                initialValue: User.currentCenterName
                            })(
                                <Input disabled={true} placeholder={`所属中心`}/>
                            )
                        }
                    </FormItem>
                    <FormItem label={'备注'} {...formItemLayout}>
                        {
                            getFieldDecorator('remark', {
                                initialValue:classroomInfo.remark
                            })(
                                <Input placeholder={`备注`} maxLength={100}/>
                            )
                        }
                    </FormItem>

                    <FormItem label={'启用状态'} {...formItemLayout}>
                        {
                            getFieldDecorator('isEnabled', {
                                rules:[
                                  {required:true}
                                ],
                                initialValue: classroomInfo.isEnabled === undefined ? 1 : classroomInfo.isEnabled
                            })(
                                <Select  style={{width: 200}} placeholder={'启用'}>
                                    {
                                        (RoomStatus || []).map((item:any) =>
                                            <Option key={item.key} value={item.value}>
                                                {item.name}
                                            </Option>
                                        )
                                    }
                                </Select>
                            )
                        }
                    </FormItem>
                    <Row>
                        <Col span={24}>
                            <CancelButton form={form} goBackLink={Routes.教室管理列表.path}/>
                        </Col>
                    </Row>
                </Form>
            </div>
        )
    }
}

export {RoomAddOrEdit}
