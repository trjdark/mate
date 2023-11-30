/**
 * desc: 表单组件
 * Date: 2018/8/16
 * Time: 下午1:41
 */
import React from 'react';
import {Select, Input} from 'antd';
const SelectOption = Select.Option;

declare interface MySelectProps {
    options: any,
    onChange?: any,
    defaultValue?: string,
    placeholder?:string,
}
class MySearchSelect extends React.Component<MySelectProps,any>{
    render(){
        const {options, onChange, placeholder} = this.props;
        return(
            <Select className='gym-form-select' onChange={(e) => {
                onChange(e)
            }} placeholder={placeholder}>
                {
                    (options || []).map((item:any, index:number) =>
                        <SelectOption key={`${item.postCode}_${index}`} value={item.postCode}>{item.postName}</SelectOption>
                    )
                }
            </Select>
        )
    }
}

declare interface MySearchInputProps {
    onChange?:any,
    placeholder?: string
}

class MySearchInput extends React.Component<MySearchInputProps,any>{
    render(){
        const {onChange, placeholder} = this.props;
        return(
            <Input placeholder={placeholder} onChange={(e) => onChange(e.target.value)}/>
        )
    }
}


export {MySearchSelect, MySearchInput}
