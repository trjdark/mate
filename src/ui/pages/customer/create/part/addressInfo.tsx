import React from 'react'
import {Form, Row, Col} from 'antd';
import {Input} from "@/ui/component/input";
import {SearchArea} from "@/ui/component/searchArea";
import {
    selectCenterArea,
    selectCenterCity,
    selectCenterProvince
} from "@/saga/selectors/setting/center";
import {getCustomerAddressInfo} from '@redux-actions/client360'
import {User} from "@/common/beans/user";
import {getCodeInfoByParentCode} from '@redux-actions/customerCreate';
import {connect} from "@/common/decorator/connect";
import {form} from "@/common/decorator/form";

const FormItem = Form.Item;

@form()
@connect((state: any) => ({
    centerArea: selectCenterArea(state),
    centerProvince: selectCenterProvince(state),
    centerCity: selectCenterCity(state),
}), {})
class AddressInformation extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            districtList: []
        }
    }

    onCityChange = (value) => {
        getCodeInfoByParentCode({
            currentCenterId: User.currentCenterId,
            parentCode: value
        }).then((res) => {
            this.setState({districtList: res})
        })
    }

    componentDidMount (){
        if (this.props.leadsId) {
            getCustomerAddressInfo({
                leadsId: this.props.leadsId,
                currentCenterId: User.currentCenterId
            }).then(res => {
                    getCodeInfoByParentCode({
                        currentCenterId: User.currentCenterId,
                        parentCode: res.cityId
                    }).then((res2) => {
                        // res2 初始cityId下的district列表
                        this.setState({districtList: res2}, () => {
                            this.props.form.setFieldsValue({
                                [`quarter`]: res.quarter,
                                [`postCode`]: res.postCode,
                                [`cityDistrictId`]: res.districtId,
                                [`cityId`]: res.cityId,
                                [`provinceId`]: res.provinceId
                            })
                        })
                    })
                }, err => {
                    console.log('getCustomerAddressInfo err....', err)
                })
        }
    }

    /**
     * 下一步
     */
    handleSubmit = (e) => {
        e.preventDefault();
        const {validateFields} = this.props.form;
        validateFields((err, values) => {
            if(!err){
                values.districtId = values.cityDistrictId;
                this.props.emitNext(values);
            }
        })
    };
    /**
     * 上一步
     */
    handlePrev = () => {
        this.props.emitPrev();
    };
    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 8},
            }
        };
        const {centerArea, centerProvince, centerCity, isEdit=true, data = {}} = this.props;
        return (
            <div style={this.props.style}>
                <div className="gym-customer-create-step-wrapper" >
                    <Form className="formWrapper">
                        <SearchArea
                            form={this.props.form}
                            centerArea={centerArea}
                            centerProvince={centerProvince}
                            centerCity={centerCity}
                            require={false}
                            formItemLayout={formItemLayout}
                            district={true}
                            noArea={true}
                            districtList={this.state.districtList}
                            onCityChange={this.onCityChange}
                            isEdit={isEdit}
                            defaultProvince={data.provinceId}
                            defaultDistrict={data.districtId}
                            defaultCity={data.cityId}
                        />
                        <Row>
                            <Col span={8}>
                                <FormItem label={'地址'} {...formItemLayout}>
                                    {getFieldDecorator(`quarter`, {
                                        rules: [{required: false, message: '请填写地址'}],
                                        initialValue: data.quarter
                                    })(
                                        <Input placeholder={`如需使用电子合同，请完善地址`} disabled={!isEdit}/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem label={'邮编'} {...formItemLayout}>
                                    {getFieldDecorator(`postCode`, {
                                        rules: [],
                                        initialValue: ''
                                    })(
                                        <Input placeholder={`邮编`} disabled={!isEdit}/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>
                {
                    // isEdit
                    this.props.leadsId
                    ?<div className='gym-customer-create-tabs-button mt20'>
                        {
                            isEdit===false&&
                            <button className='gym-button-white gym-button-xs mr15' onClick={this.handlePrev}>上一步</button>
                        }
                        {
                            isEdit !== false&&
                            <button className='gym-button-default gym-button-xs' onClick={this.handleSubmit}>保存</button>
                        }
                        </div>
                    :<div className='gym-customer-create-tabs-button mt20'>
                            <button className='gym-button-white gym-button-xs mr15' onClick={this.handlePrev}>上一步</button>
                            <button className='gym-button-default gym-button-xs' onClick={this.handleSubmit}>下一步</button>
                        </div>
                }

            </div>

        )
    }
}

export {AddressInformation}
