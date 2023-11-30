/**
 * desc: 地区搜索三连组件
 * Date: 2018/8/13
 * Time: 上午11:17
 */
import React from 'react';
import {Row, Col, Form} from 'antd';
import { Select, Option } from "@/ui/component/select";


const FormItem = Form.Item;
import './index.scss'

declare interface SearchAreaProps {
    form?: any,
    centerArea?: Array<any>,
    centerProvince?: Array<any>,
    centerCity?: Array<any>,
    defaultArea?: string,
    defaultProvince?: string,
    defaultCity?: string,
    require?: boolean,
    onCityChange?:any,
    isEdit?:boolean,//是否可编辑
    formItemLayout?:any
    noArea?:boolean
    districtList?:Array<any>
    district?:any
    defaultDistrict?:any
}

class SearchArea extends React.Component<SearchAreaProps, any> {
    isEdit:boolean;
    constructor(props: any) {
        super(props)
        this.state = {
            isChangeState: true,
            centerArea: [],
            centerProvince: [],
            centerCity: []
        };
        this.isEdit=(typeof(props.isEdit)==='undefined'? true : props.isEdit);
    }

    onSelectArea = (value) => {
        const {centerProvince, centerCity} = this.props;
        const provinceList = centerProvince.filter((item: any) => item.parentCode === value);
        const provinceCodeList = provinceList.map((item: any) => item.code);
        this.setState({
            isChangeState: false,
            centerProvince: provinceList,
            centerCity: centerCity.filter((item: any) => provinceCodeList.includes(item.parentCode)),
        })
        this.props.form.setFieldsValue({provinceId: undefined, cityId: undefined, cityDistrictId: undefined})
    };
    onSelectProvince = (value) => {
        const {centerCity} = this.props;
        this.setState({
            isChangeState: false,
            centerCity: centerCity.filter((item: any) => item.parentCode === value)
        })
        this.props.form.setFieldsValue({cityId: undefined, cityDistrictId: undefined})
    }

    static getDerivedStateFromProps(props, state) {
        if (state.isChangeState) {
            return {
                centerArea: props.centerArea,
                centerProvince: props.defaultArea ? props.centerProvince.filter((item: any) => item.parentCode === props.defaultArea) : props.centerProvince,
                centerCity: props.defaultProvince ? props.centerCity.filter((item: any) => item.parentCode === props.defaultProvince) : props.centerCity
            };
        }
        return null;
    }

    onSelectCity = (value) => {
        this.props.form.setFieldsValue({cityDistrictId: undefined})
        if (this.props.onCityChange) {
            this.props.onCityChange(value)
        }
    }
    getArea = () => {
        const { defaultArea, require, isEdit=true} = this.props;
        const {centerArea} = this.state;
        const {getFieldDecorator} = this.props.form;
        const {formItemLayout} = this.props;
        return <FormItem label={'区域'} {...formItemLayout}>
            {
                getFieldDecorator('districtId', {
                    rules: [
                        {required: require, message: '请输入区域'}
                    ],
                    initialValue: defaultArea || ''
                })(
                    <Select
                        className='gym-center-add-select'
                        style={{width: 200}}
                        onSelect={this.onSelectArea}
                        placeholder='请选择'
                        getPopupContainer={() => document.querySelector('.gym-search')}
                        disabled={!isEdit}
                    >
                        {
                            centerArea.map((item: any) => (
                                <Option key={item.id} value={item.code}>{item.codeValue}</Option>
                            ))
                        }
                    </Select>
                )
            }
        </FormItem>
    };
    getProvince = () => {
        const { defaultProvince, require, isEdit=true} = this.props;
        const {centerProvince} = this.state;
        const {getFieldDecorator} = this.props.form;
        const {formItemLayout} = this.props;
        return <FormItem label={'省份'} {...formItemLayout}>
            {
                getFieldDecorator('provinceId', {
                    rules: [
                        {required: require, message: '请输入省份'}
                    ],
                    initialValue: defaultProvince ? defaultProvince:undefined,
                })(
                    <Select
                        className='gym-center-add-select'
                        onSelect={this.onSelectProvince}
                        getPopupContainer={() => document.querySelector('.gym-search')}
                        disabled={!isEdit}
                    >
                        {
                            centerProvince.map((item: any) => (
                                <Option key={item.id} value={item.code}>{item.codeValue}</Option>
                            ))
                        }
                    </Select>
                )
            }
        </FormItem>
    };
    getCity = () => {
        const {defaultCity, require,isEdit=true} = this.props;
        const {centerCity} = this.state;
        const {getFieldDecorator} = this.props.form;
        const {formItemLayout} = this.props;

        return <FormItem label={'城市'} {...formItemLayout}>
            {
                getFieldDecorator('cityId', {
                    rules: [
                        {required: require, message: '请输入城市'}
                    ],
                    initialValue: defaultCity ? defaultCity:undefined,
                })(
                    <Select
                        className='gym-center-add-select'
                        onSelect={this.onSelectCity}
                        style={{width: 200}}
                        getPopupContainer={() => document.querySelector('.gym-search')}
                        disabled={!isEdit}
                    >
                        {
                            centerCity.map((item: any) => (
                                <Option key={item.id} value={item.code}>{item.codeValue}</Option>
                            ))
                        }
                    </Select>
                )
            }
        </FormItem>
    };
    getDistrict = () => {
        const {formItemLayout, require, districtList, defaultDistrict,isEdit=true} = this.props;
        const {getFieldDecorator} = this.props.form;
        return <FormItem label={'区县'} {...formItemLayout}>
            {
                getFieldDecorator('cityDistrictId', {
                    rules: [
                        {required: require, message: '请输入区县'}
                    ],
                    initialValue: defaultDistrict,
                })(
                    <Select
                        className='gym-center-add-select'
                        style={{width: 200}}
                        getPopupContainer={() => document.querySelector('.gym-search')}
                        disabled={!isEdit}
                        placeholder={`如需使用电子合同，请完善区县`}
                    >
                        {
                            districtList.map((item: any) => (
                                <Option key={item.id} value={item.code}>{item.codeValue}</Option>
                            ))
                        }
                    </Select>
                )
            }
        </FormItem>
    }

    render() {
        return (
            <Row className='gym-search'>
                {
                    (this.props.noArea === true) ? (
                        null
                    ) : (
                        <Col span={8}>{this.getArea()}</Col>
                    )
                }
                <Col span={8}>{this.getProvince()}</Col>
                <Col span={8}>{this.getCity()}</Col>
                {
                    (this.props.district) &&
                    <Col span={8}>{this.getDistrict()}</Col>
                }
            </Row>

        )
    }
}

export {SearchArea}
