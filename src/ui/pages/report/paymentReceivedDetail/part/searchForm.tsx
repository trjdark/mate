/**
 * desc: 权益金报表搜索
 * User: Dean.yue
 * Date: 2021/1/6
 * Time: 上午10:38
 */
import React, { Component } from 'react';
import { Form,DatePicker,Checkbox,Button } from 'antd';
import {form } from '@/common/decorator/form';
import { searchSelectOptions } from './enum';
import moment from 'moment';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import '../style/style.scss';

const {Item} = Form;
const { MonthPicker } = DatePicker;
const { Group } = Checkbox;
declare interface SearchFormProps {
  searchClick:(searchList:any) => void,
  time:string,
  [propsName:string]:any
};
@form()
class SearchForm extends Component <SearchFormProps,any>{
  constructor(props){
    super(props)
    this.state = {
      allCheckbox:false // 全选状态
    };
  };
  /**
   * 点击全选
   * @param e
   */
  allChange = (e)=>{
    if(e.target.checked ){
      this.setState({allCheckbox:true});
      this.props.form.setFieldsValue({financialType:searchSelectOptions.map(item => item.value)});
    }else{
      this.setState({allCheckbox:false});
      this.props.form.setFieldsValue({financialType:[]});
    }
  }
  /**
   * 点击单选
   * @param checkboxList
   */
  clickChange = (checkboxList:Array<any>) => {
    checkboxList.length === searchSelectOptions.map(item => item.value).length ? this.setState({allCheckbox:true}) : this.setState({allCheckbox:false})
  };
  render() {
    const { allCheckbox } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form className='gym-common-search-form'>
          <Item className='flex' label={<span className='gym-mate-payment-item-label'>查询年月:</span>} labelCol={{span:2}} colon={false}>
            {
              getFieldDecorator('financialTime',{
                initialValue:this.props.time
              })(
                <MonthPicker locale={locale} allowClear={false}  disabledDate={(current:any)=>{
                  return moment(current).format('x') < moment('2021-1-1').format('x')
                }} />
              )
            }
          </Item>
        <Item label={<span className='gym-mate-payment-item-label'>费用类型:</span>} className='flex' labelCol={{span:2}} colon={false}>
          <Checkbox value={0} checked={allCheckbox} className='gym-mate-payment-checkbox' onChange={(e)=>this.allChange(e)}>全部</Checkbox>
          {
            getFieldDecorator('financialType')(
              <Group onChange={this.clickChange} className='gym-mate-payment-checkboxList'>
                {
                  searchSelectOptions.map(item => (
                    <Checkbox key={item.value} value={item.value} className='gym-mate-payment-checkbox'>{item.label}</Checkbox>
                  ))
                }
              </Group>
            )
          }
        </Item>
        <Item className='flex gym-payment-item'>
          <Button
            className="gym-button-xs gym-button-blue"  onClick={()=>{
              this.props.form.validateFields((err:any,values:any)=>{
                if(!err) this.props.searchClick(values);
              });
            }}>查询</Button>
          <Button
            className='gym-button-xs gym-button-wBlue ml15'
            onClick={()=>{
              this.setState({allCheckbox:false});
              this.props.form.resetFields(['financialType']);
              this.props.form.setFieldsValue({financialTime:moment()})
            }}
          >重置</Button>
        </Item>
      </Form>
    )
  }
}
export {SearchForm};
