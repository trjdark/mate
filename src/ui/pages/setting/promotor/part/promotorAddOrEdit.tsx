/**
 * Desc: PR产品管理
 * User: Debby.Deng
 * Date: 2018/8/16,
 * Time: 下午5:09
 */
import React from 'react';
import {Form, Row, Col} from "antd";
import {Select,Option} from "@/ui/component/select";
import {Input} from "@/ui/component/input";
import {form} from "@/common/decorator/form";
import {addPromotor,getPromotorInfo,updatePromotor} from "@redux-actions/setting/promotorActions"
import {CommonUtils} from "@/common/utils/commonUtils";
import {Routes} from "@/router/enum/routes";
import {User} from "@/common/beans/user";
import {CancelButton} from "@/ui/component/cancelButton";
import {Message} from "@/ui/component/message/message";

const Status=[
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

@form()
class PromotorAddOrEdit extends React.Component<any, any>{
    pid = CommonUtils.hasParams(this.props)? CommonUtils.parse(this.props).id : null;
    constructor(props:any){
        super(props);
        this.state = {
            promotorObj: {}
        }
    }
    componentDidMount(){
        if(this.pid){
            getPromotorInfo({
                id: this.pid,
                currentCenterId: User.currentCenterId
            }).then((res:any) => {
                this.setState({promotorObj: res})
            });
        }
    }
    onSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err,values)=>{
            if(!err){
                let params = Object.assign({}, values, {
                    id:this.pid,
                    currentCenterId:User.currentCenterId,
                });
                if(this.pid){//编辑
                    updatePromotor(params).then(() => {
                        Message.success("更新成功！");
                    });
                }else{//新建
                    addPromotor(params).then(() => {
                        Message.success("创建成功！");
                    });
                }
            }
        })
    };



    render(){
        const {form} = this.props;
        const { getFieldDecorator } = form;
        const {promotorObj} = this.state;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
        };
        return(
            <div id='gym-promotor-add-edit' className='gym-promotor-create'>
                <Form onSubmit={this.onSubmit} >
                    <Row>
                        <Col span={16}>
                            <FormItem label={'姓名'} {...formItemLayout}>
                                {
                                    getFieldDecorator('promotorName', {
                                        rules: [
                                            {required: true, message: '请输入姓名',}
                                        ],
                                        initialValue:promotorObj.promotorName

                                    })(
                                        <Input placeholder={`姓名`} className="inputWidth"/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={16}>
                            <FormItem label={'备注'} {...formItemLayout}>
                                {
                                    getFieldDecorator('remark', {
                                        rules: [
                                            {required: false, message: '请输入备注',}
                                        ],
                                        initialValue:promotorObj.remark

                                    })(
                                        <Input placeholder={`备注`} className="inputWidth"/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={16}>
                            <FormItem label={'启用状态'} {...formItemLayout}>
                                {
                                    getFieldDecorator('isEnabled', {
                                        rules: [
                                            {required: true, message: '请输入启用状态',}
                                        ],
                                        initialValue:promotorObj.isEnabled
                                    })(
                                        <Select className="inputWidth">
                                            {
                                                (Status || []).map((item:any) =>
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
                            <CancelButton form={form} goBackLink={Routes.promotor管理列表.path}/>
                        </Col>
                    </Row>

                </Form>
            </div>
        )
    }
}

export {PromotorAddOrEdit}
