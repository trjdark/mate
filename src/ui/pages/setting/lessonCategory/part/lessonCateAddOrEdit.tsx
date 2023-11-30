/**
 *Desc: 课程分类管理编辑、新建
 *User: Debby.Deng
 *Date: 2018/8/16,
 *Time: 下午5:09
 */
import React from 'react';
import {Form, Row, Col, Select} from "antd";
import {Input} from "@/ui/component/input";
import {form} from "../../../../../common/decorator/form";
import {CommonUtils} from "../../../../../common/utils/commonUtils";
import {Routes} from "@/router/enum/routes";
import {getCourseCateInfo,addCourse,updateCourse} from "../../../../../redux-actions/setting/lessonCategoryActions";
import {CancelButton} from "../../../../component/cancelButton";
import {User} from "../../../../../common/beans/user";
import {handleValidate, Validation} from "../../../../../common/utils/validate";
import {Message} from "@/ui/component/message/message";
import {connect} from "@/common/decorator/connect";
import {selectBusinessSourceList} from "@/saga/selectors/home";

const status=[
    {
        key: 'status1',
        value: 1,
        name: '启用'
    },
    {
        key: 'status2',
        value: 0,
        name: '停用'
    },
];
const FormItem = Form.Item;
const Option = Select.Option;


@connect((state) => ({
    businessSourceMap: selectBusinessSourceList(state)
}))

@form()

class LessonCateAddOrEdit extends React.Component<any, any>{
    DEFAULT_BUSINESS_TYPE = "75001"
    pid = CommonUtils.hasParams(this.props)? CommonUtils.parse(this.props).id : null;
    constructor(props:any){
        super(props)
        this.state = {
            isChanged:false,
            courseCateInfo: {}
        }
    }
    componentDidMount(){
        if(this.pid){//编辑
            getCourseCateInfo({
                id: this.pid,
                currentCenterId: User.currentCenterId
            }).then((res:any) => {
                this.setState({
                    courseCateInfo: res
                })
            });
        }
    }
    handleFormChange(){
        this.setState({isChanged:true})
    }
    onSubmit = (e) => {
        e.preventDefault();
        this.setState({isChanged:false});
        this.props.form.validateFields((err,values)=>{
            if(!err){
                const params = Object.assign({}, values, {
                    currentCenterId:User.currentCenterId,
                    id:this.pid,
                })
                if(this.pid){//编辑
                    updateCourse(params).then(() => {
                        Message.success("更新成功！")
                    });
                }else{//新建
                    addCourse(params).then(() => {
                        Message.success("创建成功！")
                    });
                }
            }
        })
    };
    render(){
        const {form, businessSourceMap}=this.props;
        const {courseCateInfo} = this.state;
        const { getFieldDecorator } = form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 7 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 7 },
            },
        };
        return(
            <div id='gym-category-add-edit' className='gym-category-create'>
                <Form onSubmit={this.onSubmit} onChange={this.handleFormChange.bind(this)}>
                    <Row>
                        <Col span={16}>
                            <FormItem label='课程分类代码' {...formItemLayout}>
                                {
                                    getFieldDecorator('courseTypeCode', {
                                        rules: [
                                            {required: true, message: '请输入课程分类代码',}
                                        ],
                                        initialValue: courseCateInfo.courseTypeCode

                                    })(
                                        <Input placeholder={`课程分类代码`}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={16}>
                            <FormItem label={'课程业务来源'} {...formItemLayout}>
                                {
                                    getFieldDecorator('businessSource', {
                                        rules: [
                                            {required: true, message: '请选择课程业务来源',}
                                        ],
                                        initialValue: courseCateInfo.businessSource?courseCateInfo.businessSource:this.DEFAULT_BUSINESS_TYPE,

                                    })(
                                        <Select style={{width: 200}} disabled={this.pid?true:false}>
                                            {
                                                (businessSourceMap || []).map((item:any) =>
                                                    <Option key={item.businessSourceCode} value={item.businessSourceCode}>
                                                        {item.businessSourceValue}
                                                    </Option>
                                                )
                                            }
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={16}>
                            <FormItem label={'课程分类名称'} {...formItemLayout}>
                                {
                                    getFieldDecorator('courseTypeName', {
                                        rules: [
                                            {required: true, message: '请输入课程分类名称',}
                                        ],
                                        initialValue: courseCateInfo.courseTypeName

                                    })(
                                        <Input placeholder={`课程分类名称`}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={16}>
                            <FormItem label={'排序（按数字大小升序）'} {...formItemLayout}>
                                {
                                    getFieldDecorator('sortOrder', {
                                        rules: [
                                            {validator:handleValidate[Validation.正整数]}
                                        ],
                                        initialValue: courseCateInfo.sortOrder

                                    })(
                                        <Input placeholder={`排序数字`}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={16}>
                            <FormItem label={'启用状态'} {...formItemLayout}>
                                {
                                    getFieldDecorator('isEnabled', {
                                        rules:[{
                                          required:true
                                        }],
                                        initialValue: courseCateInfo.isEnabled !== undefined ? courseCateInfo.isEnabled : 1
                                    })(
                                        <Select  style={{width: 200}}>
                                            {
                                                (status || []).map((item:any) =>
                                                    <Option key={item.key} value={item.value}>
                                                        {item.name}
                                                    </Option>
                                                )
                                            }
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </Col>


                        <Col span={24}>
                            <CancelButton form={form} goBackLink={Routes.课程分类管理.path}/>
                        </Col>
                    </Row>

                </Form>
            </div>
        )
    }
}

export {LessonCateAddOrEdit}
