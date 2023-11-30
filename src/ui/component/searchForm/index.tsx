/**
 * desc: 高阶组件
 * Date: 2018/8/14
 * Time: 下午2:39
 */
import React from 'react';
import {Form, Button, DatePicker, InputNumber} from "antd";
import {Select, Option} from "../select";
import {DateInput, MonthInput} from "../datePicker";
import Input from "antd/es/input/Input";
import {form} from "@/common/decorator/form";
import './index.scss';
import {SearchFormCheckBox} from "@/ui/component/searchForm/checkBox";

const {RangePicker} = DatePicker;

const FormItem = Form.Item;

export declare interface item {
    type: 'number' | 'text' | 'select' | 'rangePicker' | 'dates' | 'months' | 'month' | 'datesPicker' | 'ageInput' | 'checkbox',
    label:string,
    name: any,
    options?: Array<any>,
    initialValue?: any,
    placeholder?:string
    colon?:boolean,
    startInitialValue?:any,
    endInitialValue?:any,
    popupContainer?:any,
    props?:any,
    handleChange?:any,
    multiple?:boolean
}

declare interface SearchFormProps {
    items: Array<item>,
    form?: any,
    onSearch: (json: any) => void,
    onReset?: (value: any) => void,
    [propName: string]: any
}

@form()
class SearchForm extends React.Component <SearchFormProps, any> {
    child:any;
    onSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.onSearch(values)
            }
        });
    };
    onReset = () => {
        const {form, onReset} = this.props;
        form.resetFields();
        if (typeof onReset === 'function') {
            onReset(form.getFieldsValue());
            // this.child.onReset()
        }
    };
    handleChange = () => {

    };
    /**
     * 排序勾选
     */
    sortCheckBox = (list) => {
        let result = [];
        list.sort(function(a, b){
            return a.finallyId - b.finallyId
        });
        list.forEach((item) => {
            if(result[item.finallyId]){
                result[item.finallyId].push(item)
            }else{
                result[item.finallyId] = [item]
            }
        });
        return result;
    };
    getFields = () => {
        const children = [];
        const {items, form, className} = this.props;
        const inputNodes = items;
        const {getFieldDecorator} = form;
        for (let i = 0, len = inputNodes.length; i < len; i++) {
            children.push(
                <div key={`form_${i}`} className="gym-form-item-wrap">
                    {
                        inputNodes[i].type === 'text' &&
                        <FormItem label={inputNodes[i].label} className={`gym-form-item ${className || ''}`}>
                            {
                                getFieldDecorator(inputNodes[i].name)(
                                    <Input
                                        className='gym-form-item-input'
                                        placeholder={inputNodes[i].placeholder}
                                        onChange={this.handleChange}
                                    />
                                )
                            }

                        </FormItem>
                    }
                    {
                        inputNodes[i].type === 'number' &&
                        <FormItem
                            label={inputNodes[i].label}
                            className={`gym-form-item ${className || ''}`}
                            colon={typeof inputNodes[i].colon === 'undefined' ? true: inputNodes[i].colon}
                        >
                            {
                                getFieldDecorator(inputNodes[i].name, {
                                    initialValue: inputNodes[i].initialValue
                                })(
                                    <InputNumber className='gym-form-item-input' {...inputNodes[i].props}/>
                                )
                            }
                        </FormItem>
                    }
                    {
                        inputNodes[i].type === 'select' &&
                        <FormItem label={inputNodes[i].label} className={`gym-form-item ${className || ''}`}>
                            {
                                getFieldDecorator(inputNodes[i].name, {
                                    initialValue: inputNodes[i].initialValue
                                })(
                                    <Select
                                        className='gym-form-item-select'
                                        mode={inputNodes[i].multiple ? "multiple" : null}
                                        onChange={this.handleChange}
                                        placeholder={inputNodes[i].placeholder}
                                        getPopupContainer={()=>document.querySelector(inputNodes[i].popupContainer || '.gym-common-search-form')}
                                        showSearch={true}
                                        filterOption={(input, option) => {
                                            const text = option.props.children as string;
                                            return text.toLowerCase().includes(input.toLowerCase())
                                        }}
                                    >
                                        {
                                            (inputNodes[i].options || []).map((item: any, index: number) =>
                                                <Option
                                                    key={`${item.postCode}_${index}`}
                                                    value={item.postCode}
                                                >
                                                    {item.postName}
                                                </Option>
                                            )
                                        }
                                    </Select>
                                )
                            }
                        </FormItem>
                    }
                    {
                        inputNodes[i].type === 'rangePicker' &&
                        <FormItem label={inputNodes[i].label} className={`gym-form-item ${className || ''}`}>
                            {
                                getFieldDecorator(inputNodes[i].name, {
                                    initialValue: inputNodes[i].initialValue
                                })(
                                    <RangePicker
                                        allowClear={false}

                                    />
                                )
                            }
                        </FormItem>
                    }
                    {
                        inputNodes[i].type === 'dates' &&
                        <div className='gym-form-item-date'>
                            <FormItem label={inputNodes[i].label} className={`gym-form-item ${className || ''}`}>
                                {
                                    getFieldDecorator(inputNodes[i].name.start, {
                                        initialValue: inputNodes[i].name.startInitialValue
                                    })(
                                        <DateInput style={{width: 110}}/>
                                    )
                                }
                            </FormItem>
                            <span className='gym-form-item-date-text'>-</span>
                            <FormItem className='gym-form-item'>
                                {
                                    getFieldDecorator(inputNodes[i].name.end, {
                                        initialValue: inputNodes[i].name.endInitialValue
                                    })(
                                        <DateInput style={{width: 110}}/>
                                    )
                                }
                            </FormItem>
                        </div>
                    }
                    {
                        /*月份区间选择*/
                        inputNodes[i].type === 'months' &&
                        <div className='gym-form-item-date gym-form-item-month'>
                            <FormItem label={inputNodes[i].label} className={`gym-form-item ${className || ''}`}>
                                {
                                    getFieldDecorator(inputNodes[i].name.start, {
                                        initialValue: inputNodes[i].startInitialValue
                                    })(
                                        <MonthInput style={{width: 190}} allowClear={false}/>
                                    )
                                }
                            </FormItem>
                            <span className="gym-form-item-date-text">-</span>
                            <FormItem className='gym-form-item'>
                                {
                                    getFieldDecorator(inputNodes[i].name.end, {
                                        initialValue: inputNodes[i].endInitialValue
                                    })(
                                        <MonthInput style={{width: 190}} allowClear={false}/>
                                    )
                                }
                            </FormItem>
                        </div>
                    }
                    {
                        /*单个月份选择*/
                        inputNodes[i].type === 'month' &&
                        <div className='gym-form-item-date'>
                            <FormItem label={inputNodes[i].label} className={`gym-form-item ${className || ''}`}>
                                {
                                    getFieldDecorator(inputNodes[i].name, {
                                        initialValue: inputNodes[i].initialValue
                                    })(
                                        <MonthInput
                                            style={{width: 200}}
                                            allowClear={false}
                                            {...inputNodes[i].props}
                                        />
                                    )
                                }
                            </FormItem>
                        </div>
                    }
                    {
                        inputNodes[i].type === 'datesPicker' &&
                        <div className='gym-form-item-date'>
                            <FormItem label={inputNodes[i].label} className={`gym-form-item ${className || ''}`}>
                                {
                                    getFieldDecorator(inputNodes[i].name, {
                                        initialValue: inputNodes[i].initialValue
                                    })(
                                        <DateInput/>
                                    )
                                }
                            </FormItem>
                        </div>
                    }
                    {/*******月龄选择******/}
                    {
                        inputNodes[i].type === 'ageInput' &&
                        <div className='gym-form-item-date'>
                            <FormItem label={inputNodes[i].label} className={`gym-form-item ${className || ''}`}>
                                {
                                    getFieldDecorator(inputNodes[i].name.start, {
                                        initialValue: inputNodes[i].name.startInitialValue
                                    })(
                                        <InputNumber style={{width: 100}} precision={0} min={0}/>
                                    )
                                }
                            </FormItem>
                            <span className='gym-form-item-date-text'>-</span>
                            <FormItem className='gym-form-item'>
                                {
                                    getFieldDecorator(inputNodes[i].name.end, {
                                        initialValue: inputNodes[i].name.endInitialValue
                                    })(
                                        <InputNumber style={{width: 100}} precision={0} min={0}/>
                                    )
                                }
                            </FormItem>
                        </div>
                    }
                    {
                        inputNodes[i].type === 'checkbox' &&
                        <FormItem label={inputNodes[i].label} className={`gym-form-item gym-form-item-checkbox ${className || ''}`}>
                            <SearchFormCheckBox
                                items={inputNodes[i]}
                                form={form}
                                onRef={ref => this.child = ref}
                            />
                        </FormItem>
                    }
                </div>)
        }
        return children;
    };

    render() {
        const {items} = this.props;
        return (
            <Form onSubmit={this.onSearch} className="gym-common-search-form">
                {this.getFields()}
                {
                    // 如果正好占满一行，则按钮位置在最后一个
                    items.length % 3 === 0 && [
                        <div className="gym-form-item-wrap" key={'empty_0'}>
                            <FormItem className='gym-form-item'/>
                        </div>,
                        <div className="gym-form-item-wrap" key={'empty_1'}>
                            <FormItem className='gym-form-item'/>
                        </div>,
                    ]
                }
                {
                    // 如果正好占满一行，则按钮位置在最后一个
                    items.length % 3 === 1 && [
                        <div className="gym-form-item-wrap" key={'empty_0'}>
                            <FormItem className='gym-form-item'/>
                        </div>
                    ]
                }
                <div className="gym-form-item-wrap">
                    <FormItem className='gym-form-item' label={' '} colon={false}>
                        <div className="gym-search-form-btn">
                            <Button
                                htmlType="submit"
                                className="gym-button-xs gym-button-blue"
                            >
                                查询
                            </Button>
                            <Button
                                className='gym-button-xs gym-button-wBlue ml15'
                                onClick={this.onReset}
                            >
                                重置
                            </Button>
                        </div>
                    </FormItem>
                </div>
            </Form>
        )
    }
}

export {SearchForm};
