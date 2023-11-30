/**
 * Desc: PR产品管理
 * User: Debby.Deng
 * Date: 2018/8/16,
 * Time: 下午5:09
 */
import React from 'react';
import {Form, Row, Col} from "antd";
import {InputNumber, Input} from "@/ui/component/input";
import {Select, Option} from "@/ui/component/select";
import {form} from "@/common/decorator/form";
import {getProductInfo, addProduct, updateProduct} from "@redux-actions/setting/productActions";
import {CommonUtils} from "@/common/utils/commonUtils";
import {Routes} from "@/router/enum/routes";
import {User} from "@/common/beans/user";
import {CancelButton} from "@/ui/component/cancelButton";
import {Message} from "@/ui/component/message/message";

const ProductStatus = [
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
class ProductAddOrEdit extends React.Component<any, any> {
    pid = CommonUtils.hasParams(this.props) ? CommonUtils.parse(this.props).id : null;
    constructor(props:any){
        super(props);
        this.state = {
            isChanged: false,
            productObj: {}
        }
    }
    onSubmit = (e) => {
        e.preventDefault();
        this.setState({isChanged: false});

        this.props.form.validateFields((err, values) => {
            if (!err) {
                const params = Object.assign({}, values, {
                    id: this.pid,
                    currentCenterId: User.currentCenterId,

                });
                if (this.pid) {// 编辑
                    updateProduct(params).then(() => {
                        Message.success('保存成功！');
                    });
                } else {// 新建
                    addProduct(params).then(() => {
                        Message.success('创建成功！');
                    });
                }
            }
        })
    };

    componentDidMount() {
        if (this.pid) {
            getProductInfo({
                id: this.pid,
                currentCenterId: User.currentCenterId
            }).then((res:any) => {
                this.setState({
                    productObj: res
                })
            });
        }

    }

    handleValidate = () => ({
        priceValid(rule, value, callback) {
            let reg = /^\d+(\.\d{1,2})?$/;
            if (value && !reg.test(value)) {
                callback('请输入小数点不超过两位的数字');
            }
            callback();
        }
    });

    handleFormChange() {
        this.setState({isChanged: true})
    }

    render() {
        const {form} = this.props;
        const {productObj} = this.state;
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 4},
            }
        };
        return (
            <div id='gym-product-add-edit' className='gym-product-create'>
                <Form onSubmit={this.onSubmit} onChange={this.handleFormChange.bind(this)}>
                    <Row>
                        <Col span={16}>
                            <FormItem label={'产品编号'} {...formItemLayout}>
                                {
                                    getFieldDecorator('freeGiftCode', {
                                        rules: [
                                            {required: true, message: '请输入产品编号',}
                                        ],
                                        initialValue: productObj.freeGiftCode

                                    })(
                                        <Input placeholder={`产品编号`} maxLength={50}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={16}>
                            <FormItem label={'产品名称'} {...formItemLayout}>
                                {
                                    getFieldDecorator('freeGiftName', {
                                        rules: [
                                            {required: true, message: '请输入产品名称',}
                                        ],
                                        initialValue: productObj.freeGiftName

                                    })(
                                        <Input placeholder={`产品名称`} maxLength={50}/>
                                    )
                                }
                            </FormItem>
                        </Col>

                        <Col span={16}>
                            <FormItem label={'零售价'} {...formItemLayout}>
                                {
                                    getFieldDecorator('retailPrice', {
                                        rules: [
                                            {required: true, message: '请输入零售价',},
                                            {validator: this.handleValidate().priceValid}
                                        ],
                                        initialValue: productObj.retailPrice

                                    })(
                                        <InputNumber placeholder={`零售价`}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={16}>
                            <FormItem label={'成本价'} {...formItemLayout}>
                                {
                                    getFieldDecorator('costPrice', {
                                        rules: [
                                            {required: true, message: '请输入成本价',},
                                            {validator: this.handleValidate().priceValid}
                                        ],
                                        initialValue: productObj.costPrice

                                    })(
                                        <InputNumber placeholder={`成本价`}/>
                                    )
                                }
                            </FormItem>
                        </Col>

                        <Col span={16}>
                            <FormItem label={'启用状态'} {...formItemLayout}>
                                {
                                    getFieldDecorator('isEnabled', {
                                        initialValue: productObj.isEnabled === 0 ? 0 : 1
                                    })(
                                        <Select style={{width: 200}} onChange={this.handleFormChange.bind(this)}>
                                            {
                                                (ProductStatus || []).map((item: any) =>
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

                    </Row>
                    <Row>
                        <Col span={24}>
                            <CancelButton form={form} goBackLink={Routes.产品管理列表.path}/>
                        </Col>
                    </Row>
                </Form>
            </div>
        )
    }
}

export {ProductAddOrEdit}
