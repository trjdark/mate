/**
*Desc: 动态-展示、编辑切换
*User: Debby.Deng
*Date: 2018/11/5,
*Time: 上午10:29
*/
import * as React from "react";
import {Input, Select, Radio, DatePicker, Checkbox} from "antd";
import moment from 'moment';
const {TextArea}=Input;
const RadioGroup=Radio.Group;
const Option=Select.Option;
declare interface innerProps {
    form:any,
    type:string,
    fieldName:string,
    initialValue?:any,//若为input框则为字符串，若为select 下拉框将[name, id]传进来
    required?:boolean,
    validMsg?:string,
    isEditable:boolean,//是否可编辑
    options?:Array<object>,
    optionName?:string,//select option name 字段
    optionValue?:string,//select option value 字段
    disabled?:boolean,
    onFieldClick?:(value?)=>(void),
    onSelect?:(value)=>(void),
}
class DynamicField extends React.Component<innerProps> {
    state={
        inputDom:null,//推荐人的input dom元素
    };
    getField() {
        const {type,options,optionName,optionValue,form,fieldName,initialValue,required,validMsg,disabled} = this.props;
        const {getFieldDecorator}=form;
        let content = null;
        switch (type) {
            case 'text': {
                content =getFieldDecorator(fieldName,{
                    rules:[{required:required,message:validMsg}],
                    initialValue:initialValue,
                })(
                    <Input ref={(input)=>{fieldName==='referalName' && (this.state.inputDom=input)}}
                           disabled={disabled} onClick={()=>{this.props.onFieldClick(this.state.inputDom)}}/>
                );
                break;
            }
            case 'textArea': {
                content =getFieldDecorator(fieldName,{
                    rules:[{required:required,message:validMsg}],
                    initialValue:initialValue,
                })(
                    <TextArea />
                );
                break;
            }
            case 'select': {
                content = getFieldDecorator(fieldName,{
                    rules:[{required:required,message:validMsg}],
                    initialValue:initialValue[1],
                })(<Select onSelect={this.props.onSelect}>
                    {(options||[]).map((option)=>{
                        return <Option key={option[optionValue]}
                                       value={option[optionValue]}>{option[optionName]}</Option>
                    })}
                </Select>);
                break;
            }
            case 'radio': {
                content=getFieldDecorator(fieldName,{
                    rules:[{required:required,message:validMsg}],
                    initialValue:initialValue,
                })(
                    <RadioGroup>
                        {options.map((option)=>{
                            return <Radio key={option[optionValue]}
                                          value={option[optionValue]}>{option[optionName]}</Radio>
                        })}
                    </RadioGroup>
                );
                break;
            }
            case 'checkbox-readonly':{
                content=getFieldDecorator(fieldName,{
                    initialValue:initialValue
                })(
                   <Checkbox checked={initialValue}  disabled={disabled}/>
                );
                break;
            }
            case 'checkbox':{
                content=getFieldDecorator(fieldName,{
                    initialValue:initialValue
                })(
                    <Checkbox onChange={this.props.onFieldClick} disabled={disabled}/>
                );
                break;
            }
            case 'datePicker': {
                content=getFieldDecorator(fieldName,{
                    rules:[{required:required,message:validMsg}],
                    initialValue:initialValue && moment(initialValue),
                })(
                    <DatePicker/>
                )
            }

        }

        return content;

    }

    render() {
        const {isEditable,initialValue,type} = this.props;
        let disEditableContent=null;
        if(type==='checkbox'||type==='checkbox-readonly'){
            disEditableContent=<Checkbox disabled={true} checked={initialValue}/>;
        }else{
            if(initialValue instanceof Array){//select框，第一个值为value,第二个为ID
                if(!!initialValue[0]){
                    disEditableContent=<span>{initialValue[0]}</span>;
                }
            }else{
                initialValue && (disEditableContent= <span>{initialValue}</span>);
            }
        }
        const content = isEditable? this.getField() : disEditableContent;
        return <div>
            {content}
        </div>
    }




}

export {DynamicField}
